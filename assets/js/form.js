import { validateForm } from './validation.js';

const SECTION_NAMES = ['student', 'tutor', 'father', 'mother'];
const OPTIONAL_SECTIONS = ['father', 'mother'];

const STATUS_TEXT = {
  pending: 'Pendiente',
  complete: 'Completa',
  error: 'Revisar',
  optional: 'Opcional',
};

function query(root, selector) {
  return root.querySelector(selector);
}

function queryAll(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Controla el acordeón, la lectura de datos, los errores visibles y los
 * estados de cada sección. No conoce la generación del PDF.
 */
export class FormController {
  constructor(form, { alert = null, generationStatus = null } = {}) {
    this.form = form;
    this.alert = alert;
    this.alertTitle = alert ? query(alert, '#form-alert-title') : null;
    this.alertList = alert ? query(alert, '#form-alert-list') : null;
    this.generationStatus = generationStatus;

    this.touched = new Set();
    this.dirty = new Set();
    this.submitted = false;
    this.busy = false;
    this.errors = {};
    this.sections = new Map();

    for (const name of SECTION_NAMES) {
      const root = query(form, `[data-section="${name}"]`);
      if (!root) continue;
      this.sections.set(name, {
        root,
        trigger: query(root, '.accordion__trigger'),
        panel: query(root, '[data-accordion-panel]'),
        chip: query(root, '[data-status-for]'),
        fields: query(root, '[data-fields]') ?? query(root, '[data-accordion-panel]'),
        include: query(root, 'input[data-include]'),
      });
    }

    this.bind();
    this.applyInitialOptionalState();
    this.refresh();
  }

  bind() {
    for (const [section, info] of this.sections) {
      if (!info.trigger) continue;
      info.trigger.addEventListener('click', () => this.toggleSection(section));
      info.trigger.addEventListener('keydown', (event) => this.handleAccordionKeydown(event));
    }

    this.form.addEventListener('input', (event) => this.handleActivity(event, { touch: false }));
    this.form.addEventListener('change', (event) => this.handleActivity(event, { touch: true }));
    this.form.addEventListener('focusout', (event) => this.handleFocusOut(event));

    for (const section of OPTIONAL_SECTIONS) {
      const include = this.sections.get(section)?.include;
      include?.addEventListener('change', () => this.handleIncludeChange(section));
    }
  }

  applyInitialOptionalState() {
    for (const section of OPTIONAL_SECTIONS) {
      this.applyIncludeState(section, this.isIncluded(section));
    }
  }

  /* ------------------------------------------------------------------ */
  /* Datos                                                               */
  /* ------------------------------------------------------------------ */

  isIncluded(section) {
    const info = this.sections.get(section);
    return info?.include ? Boolean(info.include.checked) : true;
  }

  getData() {
    const data = { student: {}, tutor: {}, father: {}, mother: {} };
    const seenRadioGroups = new Set();

    for (const holder of queryAll(this.form, '[data-field]')) {
      const path = holder.dataset.field;
      if (!path || !path.includes('.')) continue;
      const [section, key] = path.split('.');
      if (!data[section]) data[section] = {};

      if (holder.matches('fieldset')) {
        if (seenRadioGroups.has(path)) continue;
        seenRadioGroups.add(path);
        const checked = query(holder, 'input[type="radio"]:checked');
        data[section][key] = checked ? checked.value : '';
        continue;
      }

      data[section][key] = holder.value ?? '';
    }

    for (const section of OPTIONAL_SECTIONS) {
      if (!data[section]) data[section] = {};
      data[section].include = this.isIncluded(section);
    }

    return data;
  }

  /* ------------------------------------------------------------------ */
  /* Validación y errores                                                */
  /* ------------------------------------------------------------------ */

  validate(reference = new Date()) {
    const result = validateForm(this.getData(), reference);
    this.errors = result.errors;
    return result;
  }

  refresh() {
    this.validate();
    this.renderErrors();
    this.updateSectionStatuses();
  }

  fieldElement(path) {
    return query(this.form, `[data-field="${path}"]`);
  }

  setFieldError(path, message) {
    const holder = this.fieldElement(path);
    if (!holder) return;

    const errorElement = query(this.form, `[data-error-for="${path}"]`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = !message;
    }

    if (message) {
      holder.setAttribute('aria-invalid', 'true');
    } else {
      holder.removeAttribute('aria-invalid');
    }
  }

  /** Muestra solo los errores de campos ya tocados o de un envío intentado. */
  renderErrors() {
    for (const holder of queryAll(this.form, '[data-field]')) {
      const path = holder.dataset.field;
      if (!path) continue;
      const section = path.split('.')[0];
      const included = !OPTIONAL_SECTIONS.includes(section) || this.isIncluded(section);
      const visible = included && (this.submitted || this.touched.has(path));
      this.setFieldError(path, visible ? this.errors[path] ?? '' : '');
    }

    if (this.alert && !this.alert.hidden) {
      this.renderErrorSummary();
    }
  }

  sectionErrors(section) {
    return Object.fromEntries(
      Object.entries(this.errors).filter(([path]) => path.startsWith(`${section}.`)),
    );
  }

  updateSectionStatuses() {
    for (const name of SECTION_NAMES) {
      const info = this.sections.get(name);
      if (!info?.chip) continue;
      const status = this.getSectionStatus(name);
      info.chip.textContent = STATUS_TEXT[status];
      info.chip.dataset.status = status;
      info.root.dataset.status = status;
    }
  }

  getSectionStatus(section) {
    if (OPTIONAL_SECTIONS.includes(section) && !this.isIncluded(section)) {
      return 'optional';
    }

    const errors = this.sectionErrors(section);
    const errorPaths = Object.keys(errors);
    if (errorPaths.length === 0) return 'complete';

    const hasVisibleError = errorPaths.some((path) => this.submitted || this.touched.has(path));
    return hasVisibleError ? 'error' : 'pending';
  }

  /** Valida al intentar generar: muestra todos los errores y abre el primero. */
  validateForSubmit() {
    this.submitted = true;
    const result = this.validate();
    this.renderErrors();
    this.updateSectionStatuses();

    if (!result.valid) {
      this.showErrorSummary();
      const first = this.firstError();
      if (first) {
        this.openSection(first.section);
        requestAnimationFrame(() => this.focusField(first.path));
      }
    } else {
      this.hideAlert();
    }

    return result;
  }

  /** Presenta un error de generación asociado a un campo concreto. */
  showFieldGenerationError(path, message) {
    this.submitted = true;
    this.touched.add(path);
    this.errors[path] = message;
    this.renderErrors();
    this.updateSectionStatuses();
    this.showAlertMessage(message);
    this.openSection(path.split('.')[0]);
    requestAnimationFrame(() => this.focusField(path));
  }

  firstError() {
    for (const holder of queryAll(this.form, '[data-field]')) {
      const path = holder.dataset.field;
      if (!path || !this.errors[path]) continue;
      return { path, section: path.split('.')[0] };
    }
    return null;
  }

  focusField(path) {
    const holder = this.fieldElement(path);
    if (!holder) return;
    const target = holder.matches('input, select, textarea')
      ? holder
      : query(holder, 'input, select, textarea');
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ------------------------------------------------------------------ */
  /* Resumen de errores                                                  */
  /* ------------------------------------------------------------------ */

  fieldLabel(path) {
    const holder = this.fieldElement(path);
    if (!holder) return path;

    if (holder.matches('fieldset')) {
      const legend = query(holder, 'legend');
      return legend ? legend.textContent.replace(/\*/g, '').trim() : path;
    }

    if (holder.id) {
      const label = query(this.form, `label[for="${holder.id}"]`);
      if (label) return label.textContent.replace(/\*/g, '').trim();
    }

    return path;
  }

  orderedErrorPaths(errors) {
    const ordered = [];
    const seen = new Set();
    for (const holder of queryAll(this.form, '[data-field]')) {
      const path = holder.dataset.field;
      if (path && errors[path] && !seen.has(path)) {
        seen.add(path);
        ordered.push(path);
      }
    }
    for (const path of Object.keys(errors)) {
      if (!seen.has(path)) ordered.push(path);
    }
    return ordered;
  }

  renderErrorSummary() {
    if (!this.alert) return;

    const paths = this.orderedErrorPaths(this.errors);
    if (paths.length === 0) {
      this.hideAlert();
      return;
    }

    this.alert.hidden = false;
    if (this.alertTitle) {
      this.alertTitle.textContent =
        paths.length === 1
          ? 'Hay 1 campo para revisar.'
          : `Hay ${paths.length} campos para revisar.`;
    }

    if (this.alertList) {
      const items = paths.map((path) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'form-alert__link';
        button.textContent = this.fieldLabel(path);
        button.addEventListener('click', () => {
          this.openSection(path.split('.')[0]);
          this.focusField(path);
        });
        li.appendChild(button);
        return li;
      });
      this.alertList.replaceChildren(...items);
    }
  }

  showErrorSummary() {
    this.renderErrorSummary();
  }

  showAlertMessage(message) {
    if (!this.alert) return;
    this.alert.hidden = false;
    if (this.alertTitle) this.alertTitle.textContent = message;
    if (this.alertList) this.alertList.replaceChildren();
  }

  hideAlert() {
    if (!this.alert) return;
    this.alert.hidden = true;
    if (this.alertTitle) this.alertTitle.textContent = '';
    if (this.alertList) this.alertList.replaceChildren();
  }

  isAlertVisible() {
    return Boolean(this.alert && !this.alert.hidden);
  }

  /* ------------------------------------------------------------------ */
  /* Actividad de campos                                                 */
  /* ------------------------------------------------------------------ */

  handleActivity(event, { touch }) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const holder = target.closest('[data-field]');
    if (!holder) return;

    const path = holder.dataset.field;
    if (!path) return;

    this.dirty.add(path);
    if (touch) this.touched.add(path);

    this.validate();
    this.renderErrors();
    this.updateSectionStatuses();
  }

  handleFocusOut(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const holder = target.closest('[data-field]');
    if (!holder) return;

    const path = holder.dataset.field;
    if (!path || !this.dirty.has(path)) return;

    this.touched.add(path);
    this.validate();
    this.renderErrors();
    this.updateSectionStatuses();
  }

  /* ------------------------------------------------------------------ */
  /* Secciones opcionales                                                */
  /* ------------------------------------------------------------------ */

  handleIncludeChange(section) {
    const included = this.isIncluded(section);
    this.applyIncludeState(section, included);

    if (!included) {
      for (const path of [...this.touched]) {
        if (path.startsWith(`${section}.`)) this.touched.delete(path);
      }
      for (const path of [...this.dirty]) {
        if (path.startsWith(`${section}.`)) this.dirty.delete(path);
      }
    }

    this.refresh();
    if (this.isAlertVisible()) this.renderErrorSummary();
  }

  applyIncludeState(section, included) {
    const info = this.sections.get(section);
    if (!info) return;

    info.root.dataset.included = included ? 'true' : 'false';
    if (info.include) info.include.checked = included;
    if (info.fields) info.fields.hidden = !included;

    for (const control of info.fields ? queryAll(info.fields, 'input, select, textarea') : []) {
      control.disabled = !included;
      control.required = included;
    }

    if (!included) {
      for (const holder of info.fields ? queryAll(info.fields, '[data-field]') : []) {
        const path = holder.dataset.field;
        if (path) this.setFieldError(path, '');
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Acordeón                                                            */
  /* ------------------------------------------------------------------ */

  setSectionOpen(info, open) {
    if (!info) return;
    if (info.trigger) info.trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (info.panel) info.panel.hidden = !open;
    info.root.classList.toggle('is-open', open);
  }

  openSection(section) {
    for (const [name, info] of this.sections) {
      this.setSectionOpen(info, name === section);
    }
  }

  toggleSection(section) {
    const info = this.sections.get(section);
    if (!info) return;
    const isOpen = info.trigger?.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      this.setSectionOpen(info, false);
    } else {
      this.openSection(section);
    }
  }

  handleAccordionKeydown(event) {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    const triggers = [...this.sections.values()]
      .map((info) => info.trigger)
      .filter(Boolean);
    const index = triggers.indexOf(event.currentTarget);
    if (index === -1) return;

    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowDown') next = (index + 1) % triggers.length;
    if (event.key === 'ArrowUp') next = (index - 1 + triggers.length) % triggers.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = triggers.length - 1;
    triggers[next].focus();
  }

  /* ------------------------------------------------------------------ */
  /* Estado de generación                                                */
  /* ------------------------------------------------------------------ */

  setBusy(busy) {
    this.busy = busy;
    this.form.setAttribute('aria-busy', busy ? 'true' : 'false');

    const button = query(this.form, '#generate-button');
    if (button) {
      button.disabled = busy;
      const label = query(button, '.btn__label');
      if (label) label.textContent = busy ? 'Generando documento…' : 'Generar y descargar PDF';
      const spinner = query(button, '.spinner');
      if (spinner) spinner.hidden = !busy;
    }
  }

  announce(message, tone = 'info') {
    if (!this.generationStatus) return;
    this.generationStatus.textContent = message;
    this.generationStatus.dataset.tone = tone;
  }
}

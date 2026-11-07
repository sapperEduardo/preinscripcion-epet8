import { FormController } from './form.js';
import { downloadPdf, generatePdf, PdfGenerationError } from './pdf-generator.js';
import { INSTITUTIONAL_URL, MIN_AGE, PDF_FILENAME } from './config.js';
import { getMinimumYear } from './validation.js';

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function configureInstitutionalLink() {
  const wrapper = document.getElementById('institutional-link-wrap');
  const link = document.getElementById('institutional-link');
  if (!wrapper || !link) return;

  if (INSTITUTIONAL_URL) {
    link.href = INSTITUTIONAL_URL;
    wrapper.hidden = false;
  } else {
    link.removeAttribute('href');
    wrapper.hidden = true;
  }
}

function configureDynamicLimits() {
  const now = new Date();
  const minimumYear = getMinimumYear(now);

  const yearInput = document.getElementById('student-year');
  if (yearInput) {
    yearInput.min = String(minimumYear);
    yearInput.placeholder = String(minimumYear);
  }

  const birthDateInput = document.getElementById('student-birthDate');
  if (birthDateInput) {
    const maximumBirthDate = new Date(
      now.getFullYear() - MIN_AGE,
      now.getMonth(),
      now.getDate(),
    );
    birthDateInput.min = '1900-01-01';
    birthDateInput.max = toIsoDate(maximumBirthDate);
  }

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(now.getFullYear());
  });

  document.querySelectorAll('[data-minimum-year]').forEach((element) => {
    element.textContent = String(minimumYear);
  });
}

function init() {
  configureInstitutionalLink();
  configureDynamicLimits();

  const form = document.getElementById('preinscription-form');
  if (!form) return;

  const controller = new FormController(form, {
    alert: document.getElementById('form-alert'),
    generationStatus: document.getElementById('generation-status'),
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (controller.busy) return;

    const result = controller.validateForSubmit();
    if (!result.valid) {
      controller.announce('Revisá los campos marcados antes de generar el documento.', 'error');
      return;
    }

    controller.announce('');
    controller.setBusy(true);

    try {
      const bytes = await generatePdf(controller.getData());
      downloadPdf(bytes, PDF_FILENAME);
      controller.announce(
        'Documento generado. La descarga del archivo PDF se inició automáticamente.',
        'success',
      );
    } catch (error) {
      if (error instanceof PdfGenerationError && error.fieldPath) {
        controller.showFieldGenerationError(error.fieldPath, error.message);
        controller.announce('No se pudo generar el documento. Revisá el campo indicado.', 'error');
      } else {
        const message =
          error instanceof PdfGenerationError
            ? error.message
            : 'No se pudo generar el documento. Intentá nuevamente.';
        controller.showAlertMessage(message);
        controller.announce('No se pudo generar el documento. Intentá nuevamente.', 'error');
        document.getElementById('form-alert')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    } finally {
      controller.setBusy(false);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

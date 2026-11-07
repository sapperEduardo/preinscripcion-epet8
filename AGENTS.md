# AGENTS.md — Generador de preinscripciones EPET N.º 8

## 1. Propósito del proyecto

Desarrollar una aplicación web independiente, de una sola página, para la E.P.E.T. N.º 8 — Mundo Técnico.

La aplicación permitirá completar digitalmente los datos de una solicitud de preinscripción y generar un documento PDF personalizado a partir de la plantilla institucional original:

`Solicitud_de_Preinscripcion_EPET_8_Digital.pdf`

El documento generado debe conservar íntegramente el diseño, contenido, estructura y distribución de la plantilla original. Únicamente se reemplazarán las líneas destinadas a completar datos por los valores ingresados por el usuario.

La aplicación estará enlazada desde la web institucional existente, desarrollada en Wix, y será alojada en Netlify.

## 2. Principios generales

- Aplicación independiente de Wix.
- Sitio de una sola página (SPA no necesaria).
- Diseño mobile-first y completamente responsive.
- Interfaz elegante, moderna, minimalista y accesible.
- Generación de PDF del lado del cliente.
- Sin backend, base de datos ni almacenamiento de datos personales.
- Código simple, mantenible y organizado.
- Evitar dependencias innecesarias.
- No modificar ni recrear la plantilla PDF original.
- No introducir funcionalidades que no hayan sido solicitadas.

## 3. Tecnologías

Preferir una arquitectura estática y liviana:

- HTML5.
- CSS3.
- JavaScript moderno (ES Modules).
- PDF-lib para manipulación de documentos PDF.
- Netlify para alojamiento y despliegue.
- Git para control de versiones.

No incorporar frameworks como React, Vue o Angular salvo que exista una justificación técnica concreta y se consulte previamente.

No utilizar servicios externos de generación de PDF.

## 4. Identidad visual

La interfaz debe tomar como referencia visual la web institucional Mundo Técnico EPET 8.

### Paleta de colores

Colores de énfasis:
- Azul: `#2188FF`
- Coral: `#F78166`
- Gris: `#30363D`
- Negro: `#000000`

Colores base:
- Fondo principal: `#0D1117`
- Blanco: `#FFFFFF`

Tonos complementarios:
- `#161B22`
- `#21262D`
- `#C9D1D9`

### Estética

- Tema predominantemente oscuro.
- Fondos oscuros y superficies diferenciadas.
- Texto blanco y gris claro.
- Azul como color principal de interacción.
- Coral como color de énfasis secundario.
- Bordes discretos.
- Esquinas ligeramente redondeadas.
- Sombras sutiles.
- Tipografía sans-serif moderna.
- Jerarquía tipográfica clara.
- Iconografía discreta y consistente.

La interfaz debe transmitir una imagen institucional, tecnológica, moderna y profesional.

No sobrecargar la página con animaciones, efectos visuales ni elementos decorativos innecesarios.

### Referencia institucional

Nombre: Mundo Técnico EPET 8.

La captura de la web principal proporcionada por el usuario debe utilizarse como referencia visual.

No inventar ni recrear logotipos institucionales. Si no se dispone del archivo original del logo, reservar un espacio adecuado para incorporarlo posteriormente.

## 5. Diseño responsive

La mayoría de los usuarios accederá desde teléfonos móviles.

Por lo tanto:

- Diseñar primero para pantallas móviles.
- Adaptar correctamente la interfaz a tablets y escritorio.
- Evitar desplazamiento horizontal.
- Utilizar campos de entrada cómodos para pantallas táctiles.
- Mantener tamaños de fuente legibles.
- Separar visualmente las secciones.
- Utilizar contenedores con ancho máximo en escritorio.
- Mantener márgenes y espaciados consistentes.
- Los botones principales deben ocupar un ancho cómodo en móviles.

El diseño no debe consistir simplemente en reducir la versión de escritorio: debe adaptarse específicamente a la experiencia móvil.

## 6. Estructura de la página

La página debe contener:

1. Encabezado institucional.
2. Título y breve explicación del generador.
3. Formulario dividido en secciones desplegables.
4. Indicaciones sobre campos obligatorios y opcionales.
5. Botón de generación y descarga del PDF.
6. Mensajes de validación y resultado.
7. Pie de página con enlace a la web institucional.

El encabezado debe incluir la identidad de Mundo Técnico EPET 8.

El pie de página debe ofrecer un enlace para regresar al sitio institucional principal. La URL definitiva se configurará mediante una constante fácilmente modificable.

## 7. Formulario y comportamiento desplegable

El formulario debe utilizar un patrón de acordeón (accordion).

No mostrar todos los campos simultáneamente.

Secciones:

1. Datos personales del/de la alumno/a.
2. Datos del tutor o responsable legal.
3. Datos del padre.
4. Datos de la madre.

### Comportamiento

- La primera sección debe aparecer abierta inicialmente.
- Las secciones restantes deben aparecer contraídas.
- El usuario podrá abrir y cerrar las secciones libremente.
- Preferentemente, mantener una sola sección abierta a la vez.
- Las secciones obligatorias deben identificarse claramente.
- Las secciones opcionales deben identificarse como tales.
- Mostrar indicadores visuales del estado de cada sección: pendiente, completa o con errores.
- Los errores de validación deben poder localizarse aunque la sección correspondiente esté cerrada.
- Al intentar generar el documento, abrir automáticamente la primera sección que contenga errores.
- No borrar los datos al cerrar una sección.
- Permitir regresar a cualquier sección y modificar información.

El acordeón no debe convertirse en un asistente rígido que obligue a completar una sección antes de poder consultar otra.

### Datos personales del/de la alumno/a

Todos los campos son obligatorios:

- Apellido y nombres.
- CUIL.
- DNI.
- Fecha de nacimiento.
- Lugar de nacimiento.
- Nacionalidad.
- Domicilio (calle y número).
- Localidad.
- Provincia.
- País.
- Correo electrónico.
- Número de teléfono móvil.
- Año al que solicita preinscripción.
- División.

### Datos del tutor o responsable legal

Todos los campos son obligatorios:

- Apellido y nombres.
- DNI.
- Domicilio (calle y número).
- Localidad.
- Teléfono.
- Correo electrónico.
- Relación con el/la alumno/a.
- A cargo: Sí / No.
- Estado civil.
- Nacionalidad.

La opción "A cargo" debe implementarse mediante una selección excluyente (radio buttons).

### Datos del padre

Todos los campos de esta sección son opcionales:

- Apellido y nombres.
- DNI.
- Teléfono.
- A cargo: Sí / No.
- Estado civil.
- Nacionalidad.

### Datos de la madre

Todos los campos de esta sección son opcionales:

- Apellido y nombres.
- DNI.
- Teléfono.
- A cargo: Sí / No.
- Estado civil.
- Nacionalidad.

Las secciones del padre y de la madre deben permanecer contraídas inicialmente.

Los campos opcionales pueden completarse de manera independiente. No exigir que se complete toda una sección para utilizar alguno de sus datos.

Si un campo opcional no se completa, su línea correspondiente debe permanecer intacta en el PDF.

## 8. Validaciones

La generación del PDF debe bloquearse cuando exista algún campo obligatorio vacío o inválido.

Implementar validaciones en JavaScript, tanto durante la interacción cuando resulte conveniente como al intentar generar el documento.

### Reglas específicas

**Apellido y nombres**
- Obligatorio en las secciones correspondientes.
- Exigir al menos dos palabras.
- Debe existir al menos un apellido y un nombre.
- Rechazar valores compuestos únicamente por espacios o caracteres inválidos.

**DNI**
- Obligatorio para alumno y tutor.
- Debe contener exclusivamente dígitos.
- Mínimo 7 dígitos.

**CUIL**
- Obligatorio para alumno.
- Exigir exactamente 11 dígitos numéricos.
- No implementar validación de dígito verificador salvo que posteriormente se solicite.

**Fecha de nacimiento**
- Obligatoria.
- Formato de fecha válido.
- No permitir fechas futuras.
- La edad debe ser igual o superior a 12 años al momento de completar la solicitud.
- Calcular la edad dinámicamente, contemplando cumpleaños.

**Año de preinscripción**
- Obligatorio.
- Número entero válido.
- El mínimo permitido será el año calendario actual más uno.
- No establecer 2027 como valor fijo: debe calcularse dinámicamente.

**Correo electrónico**
- Obligatorio cuando corresponda.
- Aplicar validación básica de formato.

**Teléfonos**
- Obligatorios para alumno y tutor.
- Permitir dígitos, espacios, guiones y prefijo internacional.
- Exigir una longitud mínima razonable de dígitos.

**Domicilios y localidades**
- Exigir contenido no vacío.
- Rechazar valores compuestos únicamente por espacios.

**A cargo**
- Para el tutor, exigir una selección entre Sí y No.
- Para padre y madre, permitir dejar ambas opciones sin seleccionar.

**Campos opcionales**
- No exigir datos.
- Validar el formato cuando el usuario decida completarlos.

Las validaciones deben presentar mensajes claros en español y señalar el campo que necesita corrección.

No utilizar alertas genéricas del navegador como mecanismo principal de validación.

## 9. Plantilla PDF

Archivo original:

`Solicitud_de_Preinscripcion_EPET_8_Digital.pdf`

Es un documento de dos páginas en formato A4.

No contiene campos AcroForm interactivos.

### Regla fundamental

La plantilla original debe conservarse sin modificaciones.

Cada generación debe comenzar desde los bytes originales de la plantilla, no desde un PDF previamente generado.

Utilizar PDF-lib para:

1. Cargar la plantilla original.
2. Obtener sus páginas.
3. Insertar los datos correspondientes.
4. Mantener intactos los textos, tablas, títulos, líneas y demás elementos.
5. Generar un nuevo PDF.
6. Permitir su descarga desde el navegador.

No recrear el PDF mediante HTML, CSS, capturas de pantalla ni generación desde cero.

### Campos que deben completarse

Los valores deben insertarse en los espacios correspondientes de la plantilla.

La aplicación debe contemplar:

- Datos del alumno/a.
- Datos del tutor o responsable legal.
- Datos del padre.
- Datos de la madre.

La sección de observaciones debe permanecer disponible para completar manualmente.

También deben permanecer en blanco los espacios institucionales, las firmas, la declaración, el lugar y fecha de firma, la resolución y los espacios de uso exclusivo de la institución.

Los campos de encabezado que no formen parte del formulario no deben modificarse.

### Campos opcionales

Si un campo opcional no se completa:

- Conservar su línea original de guiones bajos.
- No insertar textos como "N/A", "No corresponde" o similares.
- No desplazar ni modificar los elementos vecinos.

### Casillas de selección

Para los campos "A cargo: Sí / No":

- Marcar la opción seleccionada.
- Conservar la apariencia original de las casillas.
- Si no existe selección en un campo opcional, mantener ambas casillas vacías.

### Calidad del documento

- Mantener el tamaño A4.
- Conservar las dos páginas.
- Evitar superposiciones.
- Evitar desbordamientos de texto.
- Ajustar el tamaño de fuente cuando sea necesario.
- Contemplar caracteres españoles, tildes y ñ.
- Mantener legibilidad y alineación.

Antes de implementar las coordenadas, inspeccionar visualmente las dos páginas de la plantilla.

No asumir posiciones sin comprobarlas.

Utilizar coordenadas PDF consistentes y documentar el mapeo de campos.

Si un dato resulta demasiado largo, aplicar una estrategia de ajuste de tamaño o salto de línea únicamente cuando sea compatible con el espacio disponible, sin alterar el resto del documento.

## 10. Generación y descarga

El botón principal debe indicar claramente que permite generar y descargar el documento.

Al accionarlo:

1. Validar todos los campos obligatorios.
2. Validar los campos opcionales que se hayan completado.
3. Si existen errores, impedir la generación y mostrar los mensajes correspondientes.
4. Abrir la sección que contiene el primer error.
5. Si todo es válido, cargar la plantilla original.
6. Insertar los valores.
7. Generar el PDF.
8. Descargar el archivo.

El nombre del documento descargado debe ser descriptivo y no contener datos personales innecesarios. Por ejemplo:

`Solicitud_Preinscripcion_EPET8.pdf`

Mostrar un indicador de procesamiento mientras se genera el archivo y evitar múltiples generaciones simultáneas por clics repetidos.

La generación debe realizarse enteramente en el navegador.

No enviar los datos personales a Netlify, servicios externos, analíticas ni endpoints remotos.

No almacenar datos del formulario en localStorage, sessionStorage, cookies ni bases de datos.

## 11. Privacidad y seguridad

Los datos personales corresponden a estudiantes y responsables legales.

Por lo tanto:

- No enviar información del formulario a servidores.
- No incorporar servicios de seguimiento que recolecten datos personales.
- No registrar valores de campos en consola.
- No persistir los datos entre sesiones.
- No incluir datos personales en nombres de archivo.
- No agregar dependencias remotas innecesarias.
- La plantilla PDF debe ser un recurso estático de la aplicación.

La aplicación debe funcionar mediante HTTPS en producción.

## 12. Accesibilidad y experiencia de usuario

- Etiquetas asociadas correctamente a los inputs.
- Navegación mediante teclado.
- Acordeón accesible mediante botones y atributos ARIA.
- Estados de error comunicados de forma comprensible.
- Contraste suficiente.
- Indicadores visuales que no dependan exclusivamente del color.
- Botones con estados hover, focus, active y disabled.
- Mensajes de éxito y error claros.

## 13. Organización del proyecto

Mantener una estructura simple y modular.

Una estructura inicial sugerida:

```text
/
├── AGENTS.md
├── index.html
├── netlify.toml
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js
│   │   ├── form.js
│   │   ├── validation.js
│   │   └── pdf-generator.js
│   ├── images/
│   └── fonts/
├── documents/
│   └── Solicitud_de_Preinscripcion_EPET_8_Digital.pdf
└── tests/
```

La estructura puede ajustarse si existe una razón técnica, pero se debe evitar una arquitectura innecesariamente compleja.

No duplicar código ni concentrar toda la lógica en un único archivo JavaScript.

## 14. Pruebas y criterios de aceptación

Antes de considerar terminada la aplicación, comprobar:

1. La página funciona correctamente en móviles y escritorio.
2. El acordeón abre y cierra correctamente.
3. Los datos no se pierden al contraer secciones.
4. Los campos obligatorios son efectivamente obligatorios.
5. Las validaciones funcionan.
6. Las secciones opcionales admiten datos parciales.
7. No se puede generar el PDF con datos obligatorios faltantes.
8. El PDF generado contiene los datos correspondientes.
9. Los campos opcionales vacíos conservan sus líneas.
10. Las casillas se marcan correctamente.
11. El documento conserva sus dos páginas y formato A4.
12. No existen superposiciones ni textos cortados.
13. La plantilla original no se modifica.
14. Los datos no se transmiten ni almacenan.
15. La descarga funciona en navegadores móviles y de escritorio.

## 15. Instrucciones para agentes de desarrollo

- Leer este archivo antes de comenzar cualquier modificación.
- Inspeccionar los archivos existentes antes de crear otros.
- No reemplazar ni eliminar recursos originales sin autorización.
- No inventar información institucional.
- No cambiar las reglas de negocio establecidas.
- No incorporar funcionalidades no solicitadas.
- Priorizar simplicidad, claridad y mantenibilidad.
- No considerar terminado un desarrollo solamente porque compila o no presenta errores de consola.
- Verificar visualmente el resultado, especialmente el PDF.
- Informar qué se implementó, qué se probó y qué queda pendiente.
- Consultar antes de tomar decisiones que modifiquen sustancialmente la arquitectura o los requerimientos.

El objetivo principal es entregar una aplicación confiable, visualmente coherente con la institución y fácil de utilizar desde un teléfono móvil.
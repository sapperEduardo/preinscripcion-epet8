# Generador de preinscripciones — E.P.E.T. N.º 8

Aplicación web estática para completar la solicitud de preinscripción de la
E.P.E.T. N.º 8 — Mundo Técnico y descargar el documento en PDF con el formato
institucional original.

Todos los datos se procesan en el navegador. La aplicación no tiene backend,
no envía información a servidores, no usa servicios de analítica y no almacena
datos en `localStorage`, `sessionStorage` ni cookies.

## Requisitos

- Un navegador moderno con soporte de módulos ES, `fetch` y `Blob`.
- Node.js únicamente para ejecutar el servidor local y las pruebas
  automatizadas (no es necesario para usar el sitio publicado).
- No requiere compilación ni instalación de dependencias.

PDF-lib está incorporado localmente en `assets/vendor/pdf-lib.esm.min.js`
(versión 1.17.1, licencia MIT). No se cargan bibliotecas desde CDN.

## Uso local

Los módulos ES y la carga de la plantilla requieren un servidor HTTP; abrir
`index.html` con `file://` no funciona.

```powershell
npm start
```

Luego abrir `http://127.0.0.1:8080`.

El servidor incluido en `tools/serve.mjs` no tiene dependencias externas y solo
sirve archivos del proyecto. Para cambiar el puerto o permitir el acceso desde
otro dispositivo de la red local:

```powershell
$env:PORT=3000; npm start
$env:HOST='0.0.0.0'; npm start
```

También se puede usar cualquier otro servidor estático:

```powershell
# Opción 1: Python
python -m http.server 8080

# Opción 2: Node.js
npx serve .
```

## Pruebas

```powershell
npm test
```

Las pruebas verifican:

- Las reglas de validación y los límites calculados dinámicamente.
- Que la copia de la plantilla conserva su huella SHA-256 original.
- Que el PDF generado conserva dos páginas A4 y contiene los datos.
- Que las secciones opcionales apagadas no escriben datos.
- Que un texto que no entra ni al tamaño mínimo bloquea la generación.
- La normalización de comillas, guiones y caracteres españoles.

La lista de comprobaciones manuales está en
[`tests/acceptance.md`](tests/acceptance.md).

## Estructura

```text
/
├── .gitignore
├── index.html
├── netlify.toml
├── package-lock.json
├── package.json
├── README.md
├── AGENTS.md
├── tools/
│   └── serve.mjs
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── config.js
│   │   ├── form.js
│   │   ├── main.js
│   │   ├── pdf-field-map.js
│   │   ├── pdf-generator.js
│   │   └── validation.js
│   ├── images/
│   └── vendor/
│       ├── pdf-lib.esm.min.js
│       └── LICENSE.pdf-lib.md
├── documents/
│   └── Solicitud_de_Preinscripcion_EPET_8_Digital.pdf
└── tests/
    ├── acceptance.md
    ├── pdf.test.mjs
    └── validation.test.mjs
```

## Configuración

Toda la configuración editable está en `assets/js/config.js`:

| Constante | Uso |
| --- | --- |
| `INSTITUTIONAL_URL` | URL del sitio institucional. Mientras esté vacía, el enlace del pie permanece oculto. |
| `PDF_TEMPLATE_URL` | Ruta de la plantilla dentro del sitio. |
| `PDF_FILENAME` | Nombre del archivo descargado. No contiene datos personales. |
| `MIN_AGE` | Edad mínima para la preinscripción. |
| `MIN_DNI_DIGITS`, `CUIL_DIGITS`, `MIN_PHONE_DIGITS` | Límites de validación. |
| `PDF_FONT_SIZE`, `PDF_MIN_FONT_SIZE` | Tamaño inicial y mínimo del texto en el PDF. |

### Identidad institucional

El encabezado usa la identidad textual «Mundo Técnico / E.P.E.T. N.º 8».
Cuando se disponga del archivo original del logotipo, debe incorporarse en
`assets/images/` y reemplazar el bloque de texto del encabezado. No se debe
recrear ni inventar el logotipo. La captura de la web institucional fue solo
una referencia visual y no forma parte del repositorio ni se usa en tiempo de
ejecución.

### Enlace institucional

Cuando se defina la dirección definitiva, completar:

```js
export const INSTITUTIONAL_URL = 'https://...';
```

El enlace del pie se mostrará automáticamente.

## Generación del PDF

La plantilla original tiene dos páginas A4, no contiene campos AcroForm y no
se modifica nunca. En cada generación la aplicación:

1. Descarga la plantilla original desde `documents/`.
2. Verifica que tenga dos páginas A4.
3. Superpone los valores en las coordenadas verificadas de
   `assets/js/pdf-field-map.js`.
4. Marca las casillas «A cargo» con una X vectorial.
5. Descarga el archivo como `Solicitud_Preinscripcion_EPET8.pdf`.

Las coordenadas del mapa de campos se obtuvieron de las matrices de texto del
PDF y de un análisis de píxeles del documento renderizado. Si se reemplaza la
plantilla, hay que revisar y actualizar todo el mapeo y la huella SHA-256 de las
pruebas.

### Caracteres y desbordes

Se usa `Helvetica` (fuente estándar, codificación WinAnsi) a 10 pt. Los valores
largos reducen el tamaño hasta 6,5 pt. Si un valor todavía no entra, la
generación se bloquea y se muestra un mensaje asociado al campo. Nunca se
recorta ni se trunca la información.

Las comillas tipográficas, los guiones largos y los puntos suspensivos se
normalizan a caracteres admitidos. Las tildes y la ñ se conservan.

### Secciones opcionales

Las secciones «Datos del padre» y «Datos de la madre» están apagadas por
defecto. Al activarlas, todos sus campos pasan a ser obligatorios. Al
desactivarlas, sus datos se conservan en el formulario pero no se validan ni se
escriben en el PDF, y las líneas originales de la plantilla quedan intactas.

## Privacidad y seguridad

- No se envían datos del formulario a ningún servidor.
- No se usan cookies, almacenamiento local ni sessionStorage.
- No se registran valores de campos en la consola.
- No se incluyen datos personales en el nombre del archivo.
- `netlify.toml` define una política de seguridad de contenido restrictiva y
  cabeceras de protección.
- El sitio debe publicarse por HTTPS.

## Despliegue en Netlify

1. Conectar el repositorio o arrastrar la carpeta del proyecto en Netlify.
2. No configurar comando de build: el sitio se publica tal cual.
3. Netlify toma `netlify.toml`, publica la raíz del proyecto y aplica las
   cabeceras de seguridad.

Para una vista previa, alcanza con desplegar la carpeta completa. No se
requieren variables de entorno ni funciones.

## Estado y pendientes

- [x] Formulario, acordeón y validaciones.
- [x] Secciones opcionales con interruptores independientes.
- [x] Generación y descarga del PDF en el navegador.
- [x] Mapeo de campos verificado contra la plantilla real.
- [x] Pruebas de validación y de PDF.
- [ ] Definir `INSTITUTIONAL_URL`.
- [ ] Incorporar el archivo original del logotipo institucional.
- [x] Eliminar la copia duplicada de la plantilla en la raíz del proyecto. La
      única copia es la de `documents/`.

## Licencia

Uso institucional. PDF-lib se distribuye bajo licencia MIT; su texto está en
`assets/vendor/LICENSE.pdf-lib.md`.

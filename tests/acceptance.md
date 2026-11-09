# Comprobaciones de aceptación

Lista manual para validar la aplicación antes de publicarla. Ejecutar también
`npm test` para las comprobaciones automatizadas.

## 1. Carga y diseño

- [ ] `index.html` carga sin errores en la consola.
- [ ] El logotipo del encabezado carga, se ve nítido y no muestra un recuadro
      visible sobre el fondo oscuro.
- [ ] El logotipo conserva completa la forma del libro de la parte inferior,
      sin recortes.
- [ ] El sitio funciona servido por HTTP y HTTPS, no solo con `file://`.
- [ ] La primera sección («Datos del alumno/a») aparece abierta.
- [ ] Las otras tres secciones aparecen contraídas.
- [ ] En móvil no hay desplazamiento horizontal.
- [ ] Los campos y botones son cómodos para pantalla táctil.
- [ ] En escritorio el contenido queda centrado con un ancho máximo.
- [ ] El enlace «Volver al sitio institucional» permanece oculto mientras
      `INSTITUTIONAL_URL` esté vacía.

## 2. Acordeón y conservación de datos

- [ ] Cada sección se abre y se cierra con clic.
- [ ] Solo queda una sección abierta a la vez.
- [ ] Los datos ingresados no se pierden al cerrar y volver a abrir.
- [ ] Se puede volver a cualquier sección y modificar la información.
- [ ] Las flechas ↑/↓, Inicio y Fin mueven el foco entre los encabezados.
- [ ] El foco visible es claro y no queda oculto por el encabezado fijo.

## 3. Validaciones

- [ ] No se genera el PDF con campos obligatorios vacíos.
- [ ] El resumen de errores enumera los campos y permite ir a cada uno.
- [ ] Al intentar generar, se abre automáticamente la primera sección con error.
- [ ] Los errores de una sección cerrada se indican en la cabecera («Revisar»).
- [ ] Apellido y nombres exige al menos dos palabras.
- [ ] DNI acepta solo dígitos, con 7 o más.
- [ ] CUIL exige exactamente 11 dígitos.
- [ ] La fecha de nacimiento rechaza fechas futuras y menores de 12 años.
- [ ] El año de preinscripción mínimo es el año actual más uno.
- [ ] El correo válido se acepta y el inválido se rechaza.
- [ ] El teléfono admite números, espacios, guiones y prefijo `+`.
- [ ] Domicilio y localidad rechazan solo espacios.
- [ ] «A cargo» del tutor exige Sí o No, sin tercera opción.
- [ ] Las validaciones muestran mensajes en español, sin alertas del navegador.

## 4. Secciones opcionales

- [ ] «Datos del padre» está apagada al cargar.
- [ ] «Datos de la madre» está apagada al cargar.
- [ ] Al activar una sección aparecen todos sus campos.
- [ ] Al activarla, todos sus campos pasan a ser obligatorios.
- [ ] Al desactivarla, sus datos se conservan si se vuelve a activar.
- [ ] Al desactivarla, no se validan ni se escriben en el PDF.
- [ ] Los interruptores son independientes entre sí.

## 5. Generación del PDF

- [ ] El botón muestra un indicador mientras genera.
- [ ] Los clics repetidos no inician generaciones simultáneas.
- [ ] La descarga se llama `Solicitud_Preinscripcion_EPET8.pdf`.
- [ ] El PDF conserva exactamente dos páginas A4.
- [ ] El diseño, las líneas, los títulos y las tablas de la plantilla no cambian.
- [ ] Los datos del alumno/a aparecen en sus líneas.
- [ ] Los datos del tutor aparecen en sus líneas.
- [ ] La fecha de nacimiento se ubica en día, mes y año.
- [ ] Las casillas «A cargo» marcadas muestran una X y las demás quedan vacías.
- [ ] Los valores largos reducen el tamaño de fuente sin desbordar.
- [ ] Un valor imposible de ubicar bloquea la generación con mensaje del campo.
- [ ] La sección de observaciones, las firmas, la declaración, el lugar y fecha,
      la resolución y el uso exclusivo de la institución quedan en blanco.
- [ ] Las tildes y la ñ se ven correctamente.
- [ ] Con el padre y la madre apagados, sus líneas de guiones bajos quedan
      intactas y no aparece «N/A» ni texto similar.

## 6. Privacidad

- [ ] El formulario no envía datos en la URL ni en cuerpos de peticiones.
- [ ] Solo se solicitan recursos del mismo origen (HTML, CSS, JS y plantilla).
- [ ] `localStorage`, `sessionStorage` y `document.cookie` quedan vacíos.
- [ ] La consola no muestra valores personales.
- [ ] El nombre del archivo no contiene datos personales.
- [ ] La aplicación no requiere conexión salvo para cargar la página y la
      plantilla al generar.

## 7. Navegadores

- [ ] Chrome de escritorio.
- [ ] Edge de escritorio.
- [ ] Firefox de escritorio.
- [ ] Safari en iPhone.
- [ ] Chrome en Android.

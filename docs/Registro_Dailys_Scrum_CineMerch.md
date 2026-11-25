# Registro de Dailys Scrum – CineMerch E-Commerce Platform

Universidad de Cartagena · Facultad de Ingeniería de Sistemas

Equipo: Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda y María Camila Angulo Martínez.

> Reconstrucción académica actualizada al 25 de noviembre de 2026. Las actividades del proyecto se distribuyen en tres sprints para documentar una secuencia de trabajo coherente. Las fechas, la hora, las asistencias, la atribución de tareas y los acuerdos son referenciales. Este registro no acredita que las reuniones ocurrieran en esas fechas.

## Datos generales del proyecto

| Campo | Detalle |
| --- | --- |
| Proyecto | CineMerch E-Commerce Platform |
| Metodología | SCRUM · Tres sprints de cinco días de trabajo · Quince dailys |
| Periodo referencial | 5 al 25 de noviembre de 2026. Se distribuyen sesiones de lunes a viernes como calendario de trabajo del ejercicio. |
| Capacidad del equipo | 16 SP por sprint · 48 SP para los tres sprints |
| Backlog de referencia | 20 historias · 113 SP originales. La diferencia de 65 SP permanece fuera de la capacidad de los tres sprints. |
| Product Owner / Data Arch. | Juan Ángel Chamorro Puello |
| Scrum Master / QA Lead | Camilo Andrés Buelvas Bornacelly |
| Fullstack Backend Lead | Camilo Isaac Acevedo Rueda |
| Fullstack Frontend Lead | María Camila Angulo Martínez |
| Daily Scrum | 09:00 a. m. a 09:15 a. m. · Hora de Colombia · Presencial en la sala de trabajo del equipo |
| Documento de alcance | Product Backlog actualizado de CineMerch y evidencia de entrega local |

## Guía de diligenciamiento y lectura del avance

- Cada integrante responde qué trabajó en la jornada previa, qué hará en la actual y qué impedimentos afectan sus historias. En Daily 1.1 se registra la preparación anterior al sprint. En los siguientes días se conserva la continuidad de las tareas y se revisan sus resultados.
- Los estados permitidos son Por hacer, En desarrollo, En revisión (Pull Request), En staging y Hecho. La etapa de revisión describe la propuesta del ejercicio. Su nombre conserva la etiqueta de la plantilla y no acredita la creación o aprobación de un PR.
- La Definition of Done exige PR aprobado, TypeScript sin errores, ESLint sin advertencias, pruebas críticas, revisión responsive, staging y aceptación explícita del PO. Como el cierre formal completo sigue pendiente, se registran cero SP cerrados por DoD. El avance funcional se describe por historia y en el cierre semanal.
- Las estimaciones originales se conservan. La selección de 16 SP por sprint es referencial. El trabajo sobre historias de apoyo se identifica para que no aumente implícitamente la capacidad comprometida.
- Las políticas, la identidad visual y la documentación se vinculan a las historias relacionadas y se incluyen en los acuerdos de entrega.
- Las pruebas mencionadas corresponden a la evidencia local del proyecto. Doce grupos iniciales cubren pagos y posteriormente se incorpora el grupo de consentimiento, para un total de trece. Las fechas del registro distribuyen esa evidencia dentro del ejercicio.
- Las discusiones técnicas o de alcance se tratan después del daily. Cada sesión incluye dos impedimentos con responsable y acción.

## Sprint 1 (semana 1) · Infraestructura base, landing y preparación del catálogo

**Periodo referencial** del 05/11/2026 al 11/11/2026.

**Meta del sprint**. Disponer de una base local reproducible, una landing que registre interesados y entregue un cupón, y una primera instrumentación del embudo.

**Capacidad y compromiso referenciales**. 16 SP. Las demás historias de la tabla se incluyen para registrar apoyo, dependencias y brechas del alcance.

| ID | Historia de usuario | Prioridad | SP originales | En el compromiso | Alcance del sprint |
| --- | --- | --- | --- | --- | --- |
| US-01 | Infraestructura local con Next.js, Prisma y SQLite | Must | 5 | Sí | Historia seleccionada |
| US-02 | Landing de captura, consentimiento y cupón de bienvenida | Must | 5 | Sí | Historia seleccionada |
| US-03 | Correo automático de bienvenida mediante Resend | Must | 3 | Sí | Historia seleccionada |
| US-04 | Instrumentación del embudo y atribución por canal | Must | 3 | Sí | Historia seleccionada |

**Tareas planificadas**

1. Acordar alcance académico y modelo de datos.
2. Preparar entorno, esquema SQLite y seed aditivo.
3. Construir landing, validaciones y persistencia del registro.
4. Preparar el cliente TMDB y las fichas de catálogo como dependencias del siguiente sprint.
5. Instrumentar eventos y revisar correo y canales pendientes.

### Daily 1.1

| Campo | Detalle |
| --- | --- |
| Fecha | 05/11/2026 · Referencial |
| Día del sprint | Día 1 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-01 · Revisé el backlog y las relaciones entre catálogo, interesados y órdenes. | US-01 · Definir SQLite como base local y separar las integraciones externas pendientes del alcance de la demo. | US-01 · Falta definir el entorno público. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-02 · Preparé casos para registro nuevo, correo repetido y campos vacíos. | US-01 y US-02 · Preparar la lista de verificación de arranque y de los campos del registro. | US-01 · La DoD requiere evidencias de revisión y staging. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-01 · Inspeccioné las dependencias de Next.js y Prisma. | US-01 · Revisar el esquema Prisma, la configuración local y los modelos Product, Order y WaitlistLead. | US-01 · Falta asegurar que el seed conserve datos previos. |
| María Camila Angulo Martínez (Frontend Lead) | US-02 · Organicé las secciones de propuesta de valor y campaña de captación. | US-02 · Maquetar la landing, el formulario y el resultado de la campaña Primeros 100 Cinéfilos. | US-02 · Sin impedimentos para la maqueta local. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-01 | En desarrollo | 0 | Esquema y arranque en revisión técnica; publicación pendiente. |
| US-02 | En desarrollo | 0 | Diseño de campaña y formulario en construcción. |
| US-03 | Por hacer | 0 | Dependencia externa identificada; falta remitente. |
| US-04 | En desarrollo | 0 | Pendiente definir eventos y canales. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Entorno público sin seleccionar | US-01 | Juan Ángel | Registrar la decisión pendiente y discutir opciones después del daily. | Abierto |
| 2 | Riesgo de borrar datos al repetir el seed | US-01 | Camilo Isaac | Revisar fuera del daily el cambio de borrados iniciales a operaciones aditivas. | En curso |

**Acuerdos y ajustes al plan del sprint**

- US-01 · Conservar la base local durante la adaptación del esquema.
- US-02 · Mantener la campaña de primeros 100 como referencia del contador.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 1.2

| Campo | Detalle |
| --- | --- |
| Fecha | 06/11/2026 · Referencial |
| Día del sprint | Día 2 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-01 · Trabajé en definir SQLite como base local y separar las integraciones externas pendientes del alcance de la demo. | US-02 · Precisar el descuento de bienvenida y la respuesta esperada cuando el correo ya está registrado. | US-02 · Falta restringir el beneficio por cuenta de cliente. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-01 y US-02 · Trabajé en preparar la lista de verificación de arranque y de los campos del registro. | US-02 · Revisar email, teléfono, mensajes de error y contador de cupos. | US-02 · La validación telefónica todavía es genérica. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-01 · Trabajé en revisar el esquema Prisma, la configuración local y los modelos Product, Order y WaitlistLead. | US-01 y US-02 · Implementar el registro persistente, la unicidad del correo y la generación del cupón. | US-03 · Falta un remitente verificado para correo. |
| María Camila Angulo Martínez (Frontend Lead) | US-02 · Trabajé en maquetar la landing, el formulario y el resultado de la campaña Primeros 100 Cinéfilos. | US-02 · Conectar el formulario con el endpoint y mostrar el cupón de la respuesta del servidor. | US-02 · Sin impedimentos para mostrar el resultado. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-01 | En desarrollo | 0 | Entorno local disponible; seed aditivo en preparación. |
| US-02 | En desarrollo | 0 | Registro y cupón conectados; validación de datos en revisión. |
| US-03 | Por hacer | 0 | Remitente y envío asíncrono pendientes. |
| US-04 | En desarrollo | 0 | Eventos de captación por definir. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Validación telefónica sin regla específica de Colombia | US-02 | Camilo Andrés y Camilo Isaac | Anotar la brecha y conservar validación básica mientras se acuerda el criterio. | Abierto |
| 2 | Falta configuración de correo transaccional | US-03 | Juan Ángel | Planificar remitente y acceso de Resend en una reunión aparte. | Abierto |

**Acuerdos y ajustes al plan del sprint**

- US-02 · Entregar el cupón en pantalla como parte del recorrido disponible.
- US-03 · Mantener el correo automático en Por hacer hasta resolver su dependencia.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 1.3

| Campo | Detalle |
| --- | --- |
| Fecha | 09/11/2026 · Referencial |
| Día del sprint | Día 3 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-02 · Trabajé en precisar el descuento de bienvenida y la respuesta esperada cuando el correo ya está registrado. | US-05 y US-07 · Revisar los metadatos que necesita la ficha y las diferencias entre película y edición física. | US-05 · La normalización de entidades requiere una evolución del esquema. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-02 · Trabajé en revisar email, teléfono, mensajes de error y contador de cupos. | US-05 · Preparar casos de ID TMDB válido, consulta fallida y uso del catálogo de respaldo. | US-05 · La API externa puede fallar o carecer de datos. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-01 y US-02 · Trabajé en implementar el registro persistente, la unicidad del correo y la generación del cupón. | US-01 y US-05 · Preparar el cliente TMDB, el respaldo curado y los upsert del seed para conservar precios y stock. | US-05 · El alta aún no persiste todos los metadatos obtenidos. |
| María Camila Angulo Martínez (Frontend Lead) | US-02 · Trabajé en conectar el formulario con el endpoint y mostrar el cupón de la respuesta del servidor. | US-05 a US-07 · Conectar imágenes y fichas con el catálogo existente y revisar su distribución en móvil. | US-07 · Hay especificaciones predeterminadas que deben revisarse. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-01 | En desarrollo | 0 | Seed aditivo y cliente de catálogo preparados; despliegue pendiente. |
| US-02 | En desarrollo | 0 | Formulario disponible para revisar registros repetidos. |
| US-03 | Por hacer | 0 | Integración de correo sin iniciar. |
| US-04 | En desarrollo | 0 | Preparación del embudo y nombres de eventos. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Dependencia de disponibilidad de TMDB | US-05 | Camilo Isaac | Mantener respaldo curado y revisar los errores de consulta. | En curso |
| 2 | Metadatos y ficha con cobertura parcial | US-05 y US-07 | Juan Ángel y María Camila | Registrar los campos faltantes y evitar dar la historia por cerrada. | Abierto |

**Acuerdos y ajustes al plan del sprint**

- US-05 · Usar el catálogo preparado como dependencia del sprint siguiente.
- US-01 · Ejecutar el seed de forma aditiva para preservar datos ya creados.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 1.4

| Campo | Detalle |
| --- | --- |
| Fecha | 10/11/2026 · Referencial |
| Día del sprint | Día 4 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-05 y US-07 · Trabajé en revisar los metadatos que necesita la ficha y las diferencias entre película y edición física. | US-04 · Definir qué eventos describen captación, vista de producto y avance hacia la compra. | US-04 · Meta y TikTok siguen sin integración. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-05 · Trabajé en preparar casos de ID TMDB válido, consulta fallida y uso del catálogo de respaldo. | US-02 y US-04 · Revisar la respuesta a registros repetidos y observar los eventos en el depurador local. | US-04 · La demostración local no acredita conversiones reales. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-01 y US-05 · Trabajé en preparar el cliente TMDB, el respaldo curado y los upsert del seed para conservar precios y stock. | US-04 · Revisar los helpers de analítica y los datos que se incorporan a cada evento. | US-04 · Falta ajustar consentimiento y datos enviados antes de publicación. |
| María Camila Angulo Martínez (Frontend Lead) | US-05 a US-07 · Trabajé en conectar imágenes y fichas con el catálogo existente y revisar su distribución en móvil. | US-04 y US-06 · Integrar el monitor local y revisar búsqueda y filtros como preparación del catálogo. | US-06 · Los filtros todavía no se sincronizan con la URL. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-01 | En revisión (Pull Request) | 0 | Preparado para revisión de arranque y conservación de datos. |
| US-02 | En revisión (Pull Request) | 0 | Registro y cupón en revisión funcional local. |
| US-03 | Por hacer | 0 | Resend pendiente de configuración e implementación. |
| US-04 | En revisión (Pull Request) | 0 | Monitor local instrumentado; integraciones y consentimiento por completar. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Integraciones sociales pendientes | US-04 | Juan Ángel | Mantener Meta y TikTok en el backlog y priorizar la instrumentación disponible. | Abierto |
| 2 | Filtros sin enlace compartible | US-06 | María Camila | Documentar la diferencia y preparar la revisión del catálogo para el sprint 2. | Registrado |

**Acuerdos y ajustes al plan del sprint**

- US-04 · Usar el monitor para observar la emisión local de eventos.
- US-06 · Conservar la navegación existente y registrar los filtros que aún faltan.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 1.5

| Campo | Detalle |
| --- | --- |
| Fecha | 11/11/2026 · Referencial |
| Día del sprint | Día 5 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-04 · Trabajé en definir qué eventos describen captación, vista de producto y avance hacia la compra. | US-01 a US-04 · Revisar el incremento local y trasladar los pendientes externos al siguiente refinamiento. | US-01 · Staging y aceptación formal pendientes. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-02 y US-04 · Trabajé en revisar la respuesta a registros repetidos y observar los eventos en el depurador local. | US-01 y US-02 · Ejecutar la revisión local de arranque, persistencia y visualización responsive. | US-01 · Falta completar las evidencias de la DoD. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-04 · Trabajé en revisar los helpers de analítica y los datos que se incorporan a cada evento. | US-01 y US-05 · Revisar los datos del seed y preparar contratos de productos para el carrito. | US-03 · Correo automático pendiente. |
| María Camila Angulo Martínez (Frontend Lead) | US-04 y US-06 · Trabajé en integrar el monitor local y revisar búsqueda y filtros como preparación del catálogo. | US-02 y US-04 · Ajustar la presentación del formulario y el monitor antes de la demostración del sprint. | US-04 · Píxeles sociales pendientes. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-01 | En revisión (Pull Request) | 0 | Base local y seed disponibles; CI/CD y staging pendientes. |
| US-02 | En revisión (Pull Request) | 0 | Registro y cupón disponibles; regla telefónica y primera compra pendientes. |
| US-03 | Por hacer | 0 | Correo automático pendiente. |
| US-04 | En revisión (Pull Request) | 0 | Monitor local disponible; integraciones externas pendientes. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Cierre formal sin entorno staging | US-01 a US-04 | Camilo Andrés | Dejar la lista de comprobaciones y la aprobación del PO pendientes. | Abierto |
| 2 | Correo y píxeles exceden lo disponible en la demo | US-03 y US-04 | Juan Ángel | Refinar dependencias y reprogramar las integraciones. | Reprogramado |

**Acuerdos y ajustes al plan del sprint**

- US-02 · Presentar el registro persistente y el cupón como incremento funcional de la semana.
- US-09 y US-12 · Iniciar el siguiente sprint con catálogo, esquema y eventos como dependencias disponibles.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

**Cierre de la semana 1**. Landing con registro persistente y cupón, entorno SQLite y seed aditivo, preparación del cliente TMDB y monitor local. Persisten correo automático, píxeles sociales, validación específica de celular y cierre formal.

## Sprint 2 (semana 2) · Catálogo, carrito y ciclo de pago persistente

**Periodo referencial** del 12/11/2026 al 18/11/2026.

**Meta del sprint**. Recorrer el catálogo y el carrito, crear una orden pendiente y resolver un intento de pago simulado con recuperación tras recarga e inventario consistente.

**Capacidad y compromiso referenciales**. 16 SP. Las demás historias de la tabla se incluyen para registrar apoyo, dependencias y brechas del alcance.

| ID | Historia de usuario | Prioridad | SP originales | En el compromiso | Alcance del sprint |
| --- | --- | --- | --- | --- | --- |
| US-05 | Alta y enriquecimiento de productos mediante TMDB | Must | 8 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-06 | Exploración y filtros cinematográficos del catálogo | Must | 8 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-07 | Ficha técnica de las ediciones físicas | Must | 5 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-08 | Presentación y compra de kits temáticos | Should | 8 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-09 | Carrito deslizable y persistente en el navegador | Must | 5 | Sí | Historia seleccionada |
| US-10 | Progreso hacia el envío gratis | Should | 3 | Sí | Historia seleccionada |
| US-11 | Sugerencias de accesorios desde el catálogo | Should | 5 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-12 | Pago simulado, eventos firmados y recuperación | Must | 8 | Sí | Historia seleccionada |
| US-13 | Contraentrega pendiente en Cartagena, Bolívar | Must | 5 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-14 | Resultado del pedido y proforma imprimible | Must | 3 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |

**Tareas planificadas**

1. Revisar catálogo, fichas y kits existentes.
2. Corregir apertura del checkout y progreso de envío gratis.
3. Conectar accesorios por catálogo y precios autoritativos.
4. Persistir órdenes, intentos y eventos firmados.
5. Probar estados, duplicados, stock, contraentrega y recuperación móvil.

### Daily 2.1

| Campo | Detalle |
| --- | --- |
| Fecha | 12/11/2026 · Referencial |
| Día del sprint | Día 1 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-01 a US-04 · Trabajé en revisar el incremento local y trasladar los pendientes externos al siguiente refinamiento. | US-09 y US-12 · Acordar el recorrido carrito, entrega, método, orden pendiente y resultado persistido. | US-12 · El alcance bancario real queda pendiente. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-01 y US-02 · Trabajé en ejecutar la revisión local de arranque, persistencia y visualización responsive. | US-09 y US-12 · Reproducir el cierre del drawer y preparar escenarios de pendiente, aprobación, rechazo y error. | US-09 · El drawer desmonta el checkout. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-01 y US-05 · Trabajé en revisar los datos del seed y preparar contratos de productos para el carrito. | US-12 · Añadir los modelos de intento y evento y preparar la creación idempotente de órdenes. | US-12 · El esquema existente necesita actualización segura. |
| María Camila Angulo Martínez (Frontend Lead) | US-02 y US-04 · Trabajé en ajustar la presentación del formulario y el monitor antes de la demostración del sprint. | US-09 · Mantener el CheckoutModal montado cuando el drawer se cierra para abrir el pago. | US-09 · Falta comprobar la navegación después del arreglo. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-05 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Consulta y respaldo TMDB disponibles; faltan persistencia completa y normalización. |
| US-06 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Filtros locales disponibles; URL compartible, estudio, década y Oscar pendientes. |
| US-07 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Ficha visible; faltan HDR y extras estructurados y revisar valores predeterminados. |
| US-08 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Kits visibles; componentes, variantes y stock individual pendientes. |
| US-09 | En desarrollo | 0 | Corrección del montaje y apertura del checkout en desarrollo. |
| US-10 | En desarrollo | 0 | Umbral de envío preparado para revisión. |
| US-11 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Accesorios del catálogo disponibles; selección contextual pendiente. |
| US-12 | En desarrollo | 0 | Esquema y creación pendiente en desarrollo. |
| US-13 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Contraentrega pendiente en Cartagena, Bolívar; cobro y recogida pendientes. |
| US-14 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Proforma en pantalla; correo y WhatsApp pendientes. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Desmontaje del modal al cerrar el carrito | US-09 | María Camila | Separar el render del drawer y del checkout y repetir el recorrido. | En curso |
| 2 | Persistencia nueva sobre una base existente | US-12 | Camilo Isaac | Respaldar SQLite antes del cambio y verificar conservación de órdenes. | En curso |

**Acuerdos y ajustes al plan del sprint**

- US-12 · Crear la orden pendiente antes de resolver el intento de pago.
- US-09 · Conservar el carrito hasta que el servidor confirme la aprobación.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 2.2

| Campo | Detalle |
| --- | --- |
| Fecha | 13/11/2026 · Referencial |
| Día del sprint | Día 2 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-09 y US-12 · Trabajé en acordar el recorrido carrito, entrega, método, orden pendiente y resultado persistido. | US-10, US-11 y US-13 · Confirmar el umbral de envío y la zona local Cartagena, Bolívar. | US-13 · Falta procedimiento de cobro contraentrega. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-09 y US-12 · Trabajé en reproducir el cierre del drawer y preparar escenarios de pendiente, aprobación, rechazo y error. | US-10 y US-12 · Preparar cantidades inválidas, precios alterados, cupones y stock insuficiente. | US-12 · Los precios del navegador no pueden usarse como autoridad. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-12 · Trabajé en añadir los modelos de intento y evento y preparar la creación idempotente de órdenes. | US-11 a US-13 · Calcular importes desde catálogo y validar cupón, ciudad, departamento y método en servidor. | US-11 · Las sugerencias contextuales siguen pendientes. |
| María Camila Angulo Martínez (Frontend Lead) | US-09 · Trabajé en mantener el CheckoutModal montado cuando el drawer se cierra para abrir el pago. | US-10 y US-11 · Conectar la barra de envío y consultar protectores y claqueta con precios y stock del catálogo. | US-13 · Debe actualizarse el departamento al cambiar de ciudad. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-05 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Consulta y respaldo TMDB disponibles; faltan persistencia completa y normalización. |
| US-06 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Filtros locales disponibles; URL compartible, estudio, década y Oscar pendientes. |
| US-07 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Ficha visible; faltan HDR y extras estructurados y revisar valores predeterminados. |
| US-08 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Kits visibles; componentes, variantes y stock individual pendientes. |
| US-09 | En desarrollo | 0 | Montaje corregido; persistencia en comprobación. |
| US-10 | En desarrollo | 0 | Barra y costo de envío en validación. |
| US-11 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Accesorios del catálogo disponibles; selección contextual pendiente. |
| US-12 | En desarrollo | 0 | Precios autoritativos, cupones y zona local en desarrollo. |
| US-13 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Contraentrega pendiente en Cartagena, Bolívar; cobro y recogida pendientes. |
| US-14 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Proforma en pantalla; correo y WhatsApp pendientes. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Entrega local habilitada por departamento sin ciudad exacta | US-13 | Camilo Isaac y María Camila | Validar Cartagena y Bolívar juntos y ajustar la selección de ciudad. | En curso |
| 2 | Accesorios sugeridos sin resolver por catálogo | US-11 | Camilo Isaac y María Camila | Usar los IDs existentes y ocultar productos sin stock. | En curso |

**Acuerdos y ajustes al plan del sprint**

- US-10 · Calcular envío gratis desde el subtotal de $150.000 COP.
- US-12 · Enviar IDs y cantidades; el servidor determina los importes definitivos.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 2.3

| Campo | Detalle |
| --- | --- |
| Fecha | 16/11/2026 · Referencial |
| Día del sprint | Día 3 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-10, US-11 y US-13 · Trabajé en confirmar el umbral de envío y la zona local Cartagena, Bolívar. | US-12 y US-14 · Revisar qué datos del intento y del pedido deben quedar visibles en el resultado. | US-14 · Los avisos de correo y WhatsApp están pendientes. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-10 y US-12 · Trabajé en preparar cantidades inválidas, precios alterados, cupones y stock insuficiente. | US-12 · Preparar eventos sin firma, duplicados, atrasados y con importe o referencia incorrectos. | US-12 · Hay que comprobar que un duplicado no repita efectos. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-11 a US-13 · Trabajé en calcular importes desde catálogo y validar cupón, ciudad, departamento y método en servidor. | US-12 · Implementar SHA-256, validación de eventos y transición atómica con descuento de stock al aprobar. | US-12 · Un producto sin stock debe revertir toda la aprobación. |
| María Camila Angulo Martínez (Frontend Lead) | US-10 y US-11 · Trabajé en conectar la barra de envío y consultar protectores y claqueta con precios y stock del catálogo. | US-12 y US-14 · Construir la pasarela y el resultado con referencia, operación, método, estado y fecha. | US-12 · Falta bloquear dobles clics mientras se procesa. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-05 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Consulta y respaldo TMDB disponibles; faltan persistencia completa y normalización. |
| US-06 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Filtros locales disponibles; URL compartible, estudio, década y Oscar pendientes. |
| US-07 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Ficha visible; faltan HDR y extras estructurados y revisar valores predeterminados. |
| US-08 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Kits visibles; componentes, variantes y stock individual pendientes. |
| US-09 | En desarrollo | 0 | Carrito disponible sin vaciado al crear orden. |
| US-10 | En desarrollo | 0 | Beneficio de envío calculado en servidor. |
| US-11 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Accesorios del catálogo disponibles; selección contextual pendiente. |
| US-12 | En desarrollo | 0 | Firma, deduplicación y aprobación atómica en revisión técnica. |
| US-13 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Contraentrega pendiente en Cartagena, Bolívar; cobro y recogida pendientes. |
| US-14 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Proforma en pantalla; correo y WhatsApp pendientes. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Eventos repetidos o contradictorios | US-12 | Camilo Isaac | Deduplicar por identidad canónica y admitir solo transiciones válidas. | En curso |
| 2 | Aprobación parcial con inventario insuficiente | US-12 | Camilo Andrés y Camilo Isaac | Probar una transacción que revierta todos los cambios si falta stock. | En curso |

**Acuerdos y ajustes al plan del sprint**

- US-12 · Descontar inventario únicamente cuando el intento se apruebe.
- US-14 · Presentar una proforma de prueba imprimible con IVA incluido y guía sin asignar cuando corresponda.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 2.4

| Campo | Detalle |
| --- | --- |
| Fecha | 17/11/2026 · Referencial |
| Día del sprint | Día 4 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-12 y US-14 · Trabajé en revisar qué datos del intento y del pedido deben quedar visibles en el resultado. | US-12 · Acordar la recuperación del último pedido y los reintentos sobre la misma orden. | US-12 · La recuperación depende del almacenamiento de ese navegador. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-12 · Trabajé en preparar eventos sin firma, duplicados, atrasados y con importe o referencia incorrectos. | US-12 y US-13 · Probar PSE pendiente, contraentrega fuera de zona y autorización de consulta. | US-12 · Las pruebas deben usar una base independiente. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-12 · Trabajé en implementar SHA-256, validación de eventos y transición atómica con descuento de stock al aprobar. | US-12 · Implementar consulta privada de estado, nuevo intento y protección de rutas con tokens. | US-12 · Los reintentos concurrentes no deben crear intentos extra. |
| María Camila Angulo Martínez (Frontend Lead) | US-12 y US-14 · Trabajé en construir la pasarela y el resultado con referencia, operación, método, estado y fecha. | US-09 y US-12 · Guardar el pago activo, recuperar al abrir el carrito y cancelar las consultas al cerrar el modal. | US-12 · Falta comprobar el flujo completo tras recargar. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-05 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Consulta y respaldo TMDB disponibles; faltan persistencia completa y normalización. |
| US-06 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Filtros locales disponibles; URL compartible, estudio, década y Oscar pendientes. |
| US-07 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Ficha visible; faltan HDR y extras estructurados y revisar valores predeterminados. |
| US-08 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Kits visibles; componentes, variantes y stock individual pendientes. |
| US-09 | En revisión (Pull Request) | 0 | Carrito y recuperación listos para revisión responsive. |
| US-10 | En revisión (Pull Request) | 0 | Umbral y felicitación listos para revisión. |
| US-11 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Accesorios del catálogo disponibles; selección contextual pendiente. |
| US-12 | En revisión (Pull Request) | 0 | Consulta privada y reintentos disponibles para prueba integrada. |
| US-13 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Contraentrega pendiente en Cartagena, Bolívar; cobro y recogida pendientes. |
| US-14 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Proforma en pantalla; correo y WhatsApp pendientes. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Reintentos simultáneos | US-12 | Camilo Isaac | Reclamar la transición condicionalmente y devolver el intento pendiente existente. | En curso |
| 2 | Consultas activas después del cierre del modal | US-12 | María Camila | Abortar solicitudes y limpiar temporizadores al cerrar o cambiar de orden. | En curso |

**Acuerdos y ajustes al plan del sprint**

- US-12 · Recuperar el último pedido aun cuando el carrito esté vacío.
- US-12 · Limitar el seguimiento a diez consultas por apertura o cambio de estado.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 2.5

| Campo | Detalle |
| --- | --- |
| Fecha | 18/11/2026 · Referencial |
| Día del sprint | Día 5 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-12 · Trabajé en acordar la recuperación del último pedido y los reintentos sobre la misma orden. | US-05 a US-14 · Revisar el incremento de catálogo y compra y registrar las brechas del alcance bancario. | US-05 a US-08 · Persisten metadatos, filtros y componentes de kit pendientes. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-12 y US-13 · Trabajé en probar PSE pendiente, contraentrega fuera de zona y autorización de consulta. | US-12 · Ejecutar los doce grupos iniciales de pagos y el flujo móvil con recarga, rechazo, reintento y aprobación. | US-12 · Staging y cierre formal pendientes. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-12 · Trabajé en implementar consulta privada de estado, nuevo intento y protección de rutas con tokens. | US-01 y US-12 · Verificar respaldo, actualización aislada del esquema, generación de Prisma y conservación de datos. | US-13 · Cobro local y punto de recogida pendientes. |
| María Camila Angulo Martínez (Frontend Lead) | US-09 y US-12 · Trabajé en guardar el pago activo, recuperar al abrir el carrito y cancelar las consultas al cerrar el modal. | US-09, US-12 y US-14 · Revisar que la aprobación muestre proforma y vacíe el carrito una sola vez por navegador. | US-14 · Confirmaciones externas pendientes. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-05 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Consulta y respaldo TMDB disponibles; faltan persistencia completa y normalización. |
| US-06 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Filtros locales disponibles; URL compartible, estudio, década y Oscar pendientes. |
| US-07 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Ficha visible; faltan HDR y extras estructurados y revisar valores predeterminados. |
| US-08 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Kits visibles; componentes, variantes y stock individual pendientes. |
| US-09 | En revisión (Pull Request) | 0 | Comportamiento funcional disponible; cierre formal pendiente. |
| US-10 | En revisión (Pull Request) | 0 | Comportamiento funcional disponible; cierre formal pendiente. |
| US-11 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Accesorios del catálogo disponibles; selección contextual pendiente. |
| US-12 | En revisión (Pull Request) | 0 | Doce grupos iniciales y flujo móvil documentados; integración bancaria y DoD pendientes. |
| US-13 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Contraentrega pendiente en Cartagena, Bolívar; cobro y recogida pendientes. |
| US-14 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Proforma en pantalla; correo y WhatsApp pendientes. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Cierre de calidad de la compra aún incompleto | US-09, US-10 y US-12 | Camilo Andrés | Adjuntar la revisión local y conservar pendientes PR, staging y aceptación. | Abierto |
| 2 | Criterios originales de catálogo y kits sin cobertura completa | US-05 a US-08 | Juan Ángel | Registrar las diferencias para el refinamiento del backlog. | Registrado |

**Acuerdos y ajustes al plan del sprint**

- US-12 · Presentar los resultados locales como evidencia de la simulación persistente.
- US-15 y US-20 · Preparar el siguiente sprint con órdenes y transacciones disponibles para el panel.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

**Cierre de la semana 2**. Carrito y envío gratis funcionales, catálogo y accesorios disponibles y ciclo de pago simulado persistente. Se documentan precios autoritativos, firmas, duplicados, stock atómico, recuperación y doce grupos iniciales. Persisten integración bancaria, avisos externos, componentes de kits y ampliaciones de filtros.

## Sprint 3 (semana 3) · Operación, privacidad, identidad y preparación de la entrega

**Periodo referencial** del 19/11/2026 al 25/11/2026.

**Meta del sprint**. Revisar preventas y logística, consolidar el panel administrativo, incorporar consentimiento e identidad visual y dejar documentado el alcance para una entrega y un despliegue posteriores.

**Capacidad y compromiso referenciales**. 16 SP. Las demás historias de la tabla se incluyen para registrar apoyo, dependencias y brechas del alcance.

| ID | Historia de usuario | Prioridad | SP originales | En el compromiso | Alcance del sprint |
| --- | --- | --- | --- | --- | --- |
| US-15 | Preventa con fecha estimada y contador | Must | 8 | Sí | Historia seleccionada |
| US-16 | Estados logísticos, transportadora y guía | Must | 5 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-17 | Rangos y proyección de puntos por orden | Must | 8 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-18 | Canje de puntos verificados en el checkout | Must | 5 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-19 | Reseñas verificadas y fotos del unboxing | Should | 5 | No | Apoyo o funcionalidad existente; ampliaciones pendientes |
| US-20 | Administración de órdenes, catálogo y métricas | Must | 8 | Sí | Historia seleccionada |

**Tareas planificadas**

1. Revisar preventas, estados logísticos y fidelización.
2. Proteger el panel y corregir sus métricas y mensajes.
3. Incorporar políticas, consentimiento, SEO y atribución.
4. Integrar el logo y pulir textos de la compra.
5. Actualizar backlog, evidencia y documentación y preparar la versión en Git.

### Daily 3.1

| Campo | Detalle |
| --- | --- |
| Fecha | 19/11/2026 · Referencial |
| Día del sprint | Día 1 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-05 a US-14 · Trabajé en revisar el incremento de catálogo y compra y registrar las brechas del alcance bancario. | US-15 a US-19 · Precisar qué funciones operativas están disponibles y cuáles siguen pendientes. | US-19 · Falta publicación de reseñas verificadas con fotos. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-12 · Trabajé en ejecutar los doce grupos iniciales de pagos y el flujo móvil con recarga, rechazo, reintento y aprobación. | US-15 y US-17 · Revisar contador, fechas de preventa y saldo mostrado en fidelización. | US-15 · El contador reinicia con duración fija al cargar. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-01 y US-12 · Trabajé en verificar respaldo, actualización aislada del esquema, generación de Prisma y conservación de datos. | US-16 y US-17 · Revisar transiciones logísticas y registrar puntos solo como proyección de la orden. | US-17 y US-18 · Falta saldo verificable por cliente. |
| María Camila Angulo Martínez (Frontend Lead) | US-09, US-12 y US-14 · Trabajé en revisar que la aprobación muestre proforma y vacíe el carrito una sola vez por navegador. | US-15, US-17 y US-18 · Revisar las vistas de preventa y rangos y explicar el canje desactivado en checkout. | US-16 · Falta consulta de rastreo por pedido para el cliente. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-15 | En desarrollo | 0 | Página y fechas disponibles; contador real y reglas de reserva pendientes. |
| US-16 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Backend logístico disponible; rastreo por pedido, guía desde panel y avisos pendientes. |
| US-17 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Rangos y proyección visibles; saldo real y acreditación pendientes. |
| US-18 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Canje desactivado; falta saldo verificable y débito atómico. |
| US-19 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Reseñas iniciales visibles; publicación verificada y fotos pendientes. |
| US-20 | En desarrollo | 0 | Revisión de acceso y métricas del panel iniciada. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Contador sin fecha persistente de cierre | US-15 | María Camila | Registrar la brecha y planificar vincular el contador a una fecha real. | Abierto |
| 2 | Puntos del navegador sin respaldo de cuenta | US-17 y US-18 | Camilo Isaac | Mantener el canje desactivado hasta contar con saldo persistido y débito atómico. | Abierto |

**Acuerdos y ajustes al plan del sprint**

- US-15 · Conservar la fecha estimada visible y documentar el límite del contador.
- US-17 y US-19 · Diferenciar las vistas de demostración de las operaciones de cliente pendientes.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 3.2

| Campo | Detalle |
| --- | --- |
| Fecha | 20/11/2026 · Referencial |
| Día del sprint | Día 2 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-15 a US-19 · Trabajé en precisar qué funciones operativas están disponibles y cuáles siguen pendientes. | US-20 · Definir ventas cobradas, ticket promedio y conteos por estado usando pagos aprobados. | US-20 · Falta autenticación por usuarios y rol ADMIN. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-15 y US-17 · Trabajé en revisar contador, fechas de preventa y saldo mostrado en fidelización. | US-16 y US-20 · Probar consulta sin token, token inválido y bloqueo de despacho con pago pendiente. | US-20 · Las métricas mensuales y el CAC no están calculados. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-16 y US-17 · Trabajé en revisar transiciones logísticas y registrar puntos solo como proyección de la orden. | US-20 · Aplicar autorización administrativa a órdenes, productos e interesados y limitar el PATCH logístico. | US-16 · Falta un procedimiento de cobro contraentrega. |
| María Camila Angulo Martínez (Frontend Lead) | US-15, US-17 y US-18 · Trabajé en revisar las vistas de preventa y rangos y explicar el canje desactivado en checkout. | US-20 · Añadir token en sessionStorage y distinguir falta de autorización, error de consulta y ausencia de órdenes. | US-20 · El panel vacío puede confundirse con pérdida de órdenes. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-15 | En desarrollo | 0 | Brechas del contador registradas. |
| US-16 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Backend logístico disponible; rastreo por pedido, guía desde panel y avisos pendientes. |
| US-17 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Rangos y proyección visibles; saldo real y acreditación pendientes. |
| US-18 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Canje desactivado; falta saldo verificable y débito atómico. |
| US-19 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Reseñas iniciales visibles; publicación verificada y fotos pendientes. |
| US-20 | En desarrollo | 0 | Token, acceso, métricas y mensajes de autorización en revisión integrada. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Órdenes ocultas por consulta sin autorización | US-20 | María Camila y Camilo Isaac | Mostrar instrucciones del token y limpiar datos anteriores cuando falle el acceso. | En curso |
| 2 | Despacho de pedidos pendientes | US-16 | Camilo Isaac | Permitir únicamente transiciones logísticas de órdenes aprobadas. | En curso |

**Acuerdos y ajustes al plan del sprint**

- US-20 · Sumar únicamente órdenes con paymentStatus APPROVED para ventas y ticket.
- US-20 · Mostrar estado de pago, logística, método y último intento por orden.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 3.3

| Campo | Detalle |
| --- | --- |
| Fecha | 23/11/2026 · Referencial |
| Día del sprint | Día 3 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-20 · Trabajé en definir ventas cobradas, ticket promedio y conteos por estado usando pagos aprobados. | US-02 y US-04 · Revisar los requisitos de entrega sobre privacidad, captación y medición. | US-02 · Los datos de responsable y canales operativos reales siguen pendientes. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-16 y US-20 · Trabajé en probar consulta sin token, token inválido y bloqueo de despacho con pago pendiente. | US-02 y US-12 · Preparar la prueba que exige consentimiento vigente y registra su fecha y versión. | US-01 · La base necesita respaldo antes de añadir campos. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-20 · Trabajé en aplicar autorización administrativa a órdenes, productos e interesados y limitar el PATCH logístico. | US-02 y US-12 · Añadir campos de autorización sin alterar registros históricos y validar consentimiento en servidor. | US-04 · Hay que excluir datos de contacto de los eventos. |
| María Camila Angulo Martínez (Frontend Lead) | US-20 · Trabajé en añadir token en sessionStorage y distinguir falta de autorización, error de consulta y ausencia de órdenes. | US-02 y US-04 · Incorporar política de datos, condiciones, casillas sin premarcar y preferencia de GA4. | US-04 · Los enlaces sociales requieren direcciones propias verificadas. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-15 | En desarrollo | 0 | Fecha y contador sin ampliación del alcance. |
| US-16 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Backend logístico disponible; rastreo por pedido, guía desde panel y avisos pendientes. |
| US-17 | En desarrollo | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Rangos y proyección visibles; saldo real y acreditación pendientes. |
| US-18 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Canje desactivado; falta saldo verificable y débito atómico. |
| US-19 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Reseñas iniciales visibles; publicación verificada y fotos pendientes. |
| US-20 | En desarrollo | 0 | Panel operativo de demo disponible; revisión de datos personales y acceso. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Registro sin evidencia explícita de autorización | US-02 y US-12 | Camilo Isaac y María Camila | Exigir la versión vigente y guardar fecha y versión para los registros nuevos. | En curso |
| 2 | Instrumentación externa y datos personales | US-04 | Juan Ángel y Camilo Isaac | Aplicar consentimiento opcional y revisar que los eventos excluyan contacto y cupones individuales. | En curso |

**Acuerdos y ajustes al plan del sprint**

- US-02 · Conservar los registros históricos sin atribuirles una autorización nueva.
- US-04 · Mantener el monitor local disponible con GA4 externo sujeto a configuración y consentimiento.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 3.4

| Campo | Detalle |
| --- | --- |
| Fecha | 24/11/2026 · Referencial |
| Día del sprint | Día 4 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-02 y US-04 · Trabajé en revisar los requisitos de entrega sobre privacidad, captación y medición. | US-01, US-04 y US-20 · Revisar la matriz de entrega, SEO técnico y coherencia de la presentación. | US-01 · Falta seleccionar proveedor y preparar despliegue. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-02 y US-12 · Trabajé en preparar la prueba que exige consentimiento vigente y registra su fecha y versión. | US-02 y US-12 · Ejecutar los trece grupos con consentimiento y repetir el recorrido móvil en una base aislada. | US-20 · La revisión local no cierra la aceptación formal. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-02 y US-12 · Trabajé en añadir campos de autorización sin alterar registros históricos y validar consentimiento en servidor. | US-01 y US-04 · Verificar conservación de SQLite, sitemap y robots con un origen HTTPS de prueba. | US-04 · Falta dominio y propiedad GA4 verificados para medición real. |
| María Camila Angulo Martínez (Frontend Lead) | US-02 y US-04 · Trabajé en incorporar política de datos, condiciones, casillas sin premarcar y preferencia de GA4. | US-04 y US-20 · Completar atribución UTM, indicadores del monitor y evidencia con guion y diapositiva. | US-20 · Persisten gráficos, exportación de órdenes y métricas avanzadas pendientes. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-15 | En revisión (Pull Request) | 0 | Pendiente vincular contador a fecha real y definir reserva. |
| US-16 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Backend logístico disponible; rastreo por pedido, guía desde panel y avisos pendientes. |
| US-17 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Rangos y proyección visibles; saldo real y acreditación pendientes. |
| US-18 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Canje desactivado; falta saldo verificable y débito atómico. |
| US-19 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Reseñas iniciales visibles; publicación verificada y fotos pendientes. |
| US-20 | En revisión (Pull Request) | 0 | Consulta y métricas básicas comprobadas; ampliar indicadores permanece pendiente. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Preparación de entrega sin entorno público | US-01 | Juan Ángel y Camilo Isaac | Documentar volumen o base externa, secretos y comandos antes del despliegue. | Abierto |
| 2 | Documentación desalineada con el alcance construido | US-01 a US-20 | Juan Ángel y Camilo Andrés | Actualizar backlog, matriz de requisitos y guion para distinguir disponible y pendiente. | En curso |

**Acuerdos y ajustes al plan del sprint**

- US-12 · Registrar la comprobación móvil de pendiente, recarga, rechazo, reintento y aprobación.
- US-04 · Utilizar enlaces UTM de ejemplo para demostrar atribución, sin presentar tráfico ficticio como resultados comerciales.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

### Daily 3.5

| Campo | Detalle |
| --- | --- |
| Fecha | 25/11/2026 · Referencial |
| Día del sprint | Día 5 de 5 |
| Hora y duración | 09:00 a. m. a 09:15 a. m. · 15 minutos · Hora de Colombia |
| Modalidad | Presencial · Sala de trabajo del equipo · Enlace no aplica |
| Facilitador | Camilo Andrés Buelvas Bornacelly · Scrum Master |
| Asistentes | Juan Ángel Chamorro Puello, Camilo Andrés Buelvas Bornacelly, Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez · Asistencia referencial del ejercicio |
| Ausentes y motivo | Ninguno en el escenario reconstruido · Motivo no aplica |

**Avance por integrante**

| Integrante | Ayer (aporte al Sprint Goal) | Hoy (con ID de US) | Impedimentos |
| --- | --- | --- | --- |
| Juan Ángel Chamorro Puello (PO / Data Arch.) | US-01, US-04 y US-20 · Trabajé en revisar la matriz de entrega, SEO técnico y coherencia de la presentación. | US-01 a US-20 · Actualizar Product Backlog y dailys con el alcance final, la capacidad y las diferencias pendientes. | US-01 · El despliegue sigue pendiente. |
| Camilo Andrés Buelvas Bornacelly (SM / QA Lead) | US-02 y US-12 · Trabajé en ejecutar los trece grupos con consentimiento y repetir el recorrido móvil en una base aislada. | US-09, US-12 y US-20 · Revisar legibilidad de los cambios visuales y conservar la lista de aceptación y staging pendientes. | US-12 · Cancelar mantiene DECLINED y muestra un resultado que debe alinearse. |
| Camilo Isaac Acevedo Rueda (Backend Lead) | US-01 y US-04 · Trabajé en verificar conservación de SQLite, sitemap y robots con un origen HTTPS de prueba. | US-01 · Revisar los commits de la entrega y registrar los ajustes necesarios de Next.js, arranque y persistencia antes del deploy. | US-01 · La actualización de Next.js y la configuración de producción siguen pendientes. |
| María Camila Angulo Martínez (Frontend Lead) | US-04 y US-20 · Trabajé en completar atribución UTM, indicadores del monitor y evidencia con guion y diapositiva. | US-09, US-12 y US-16 · Integrar logo y transparencia del pie, retirar textos solicitados del carrito y pasarela y enlazar Inter Rapidísimo. | US-09 y US-12 · El cupón sigue en la franja superior y algunos textos operativos requieren revisión. |

**Estado del Sprint Backlog**

| ID | Estado | SP completados | Observaciones (PR, staging, DoD) |
| --- | --- | --- | --- |
| US-15 | En revisión (Pull Request) | 0 | Página y fecha visibles; contador real y reglas de reserva pendientes. |
| US-16 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Backend logístico disponible; rastreo por pedido, guía desde panel y avisos pendientes. |
| US-17 | En revisión (Pull Request) | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Rangos y proyección visibles; saldo real y acreditación pendientes. |
| US-18 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Canje desactivado; falta saldo verificable y débito atómico. |
| US-19 | Por hacer | 0 | Actividad de apoyo o alcance existente; fuera del compromiso de 16 SP. Reseñas iniciales visibles; publicación verificada y fotos pendientes. |
| US-20 | En revisión (Pull Request) | 0 | Panel y métricas básicas disponibles; rol ADMIN y métricas avanzadas pendientes. |

**Impedimentos y acciones**

| # | Impedimento | Historia afectada | Responsable | Acción acordada | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Coherencia del botón Cancelar y su resultado | US-12 | Camilo Isaac y María Camila | Registrar que DECLINED conserva el mensaje de fondos insuficientes y planificar su ajuste. | Abierto |
| 2 | Versión local lista para preparar despliegue | US-01 | Juan Ángel y Camilo Isaac | Confirmar commits y planificar runtime soportado, base persistente y variables del entorno público. | Abierto |

**Acuerdos y ajustes al plan del sprint**

- US-09 y US-12 · Conservar las etiquetas Wompi y Cancelar y la retirada de Simular error y del ejemplo de cupón en el campo del carrito.
- US-01 y US-20 · Entregar backlog actualizado, TXT de cambios, evidencia y registro completo de reuniones; conservar el deploy como trabajo posterior.

**Avance del sprint**. SP completados acumulados por DoD, 0 / 16. SP restantes para cierre formal, 16. ¿Se mantiene el Sprint Goal? Sí, como meta de la demo local. Los pendientes se conservan en las observaciones y en el cierre semanal.

**Cierre de la semana 3**. Panel protegido y métricas básicas, consentimiento persistido, políticas, SEO y atribución, logo y transparencia del pie, ajustes de textos y documentación actualizada. Se documentan trece grupos de pruebas y recorrido móvil. Los commits locales están registrados. El despliegue y las funciones avanzadas siguen pendientes.

## Cierre general del registro

| Sprint | Compromiso referencial | SP previstos | SP cerrados por DoD | SP pendientes de cierre |
| --- | --- | --- | --- | --- |
| 1 | US-01, US-02, US-03 y US-04 | 16 | 0 | 16 |
| 2 | US-09, US-10 y US-12 | 16 | 0 | 16 |
| 3 | US-15 y US-20 | 16 | 0 | 16 |
| Total | Tres selecciones de trabajo | 48 | 0 | 48 |

La cifra de cero puntos cerrados expresa el estado del cierre formal de calidad. La cobertura funcional, las pruebas y las limitaciones quedan registradas en cada historia. Los 113 SP del backlog completo se mantienen como estimación histórica; el remanente de 65 SP queda fuera del compromiso referencial.

**Pendientes que se llevan al siguiente refinamiento**

- US-01. Actualización de Next.js, arranque de producción, persistencia y respaldos del entorno público, proveedor y staging.
- US-02 a US-04. Validación específica de celular, primera compra por cliente, Resend y canales de Meta y TikTok.
- US-05 a US-08. Persistencia completa de metadatos, filtros compartibles y adicionales, ficha técnica sin datos asumidos y componentes de kits con variantes y stock individual.
- US-11 a US-14. Recomendaciones contextuales, resultado coherente de Cancelar, integración bancaria, cobro contraentrega, punto de recogida y notificaciones.
- US-15 a US-19. Contador ligado a fecha real, reglas de reserva, consulta de rastreo por pedido, saldo de cliente, canje y reseñas verificadas con imágenes.
- US-20. Usuarios con rol ADMIN, ventas por periodo, CAC, preventas pendientes, productos más vendidos, gráficos y exportación de órdenes.

**Documentos y evidencia asociados**

- [Product Backlog actualizado](../output/pdf/Product_Backlog_CineMerch_actualizado.pdf).
- [Relación de cambios del Product Backlog](../output/pdf/Cambios_Product_Backlog_CineMerch.txt).
- [Matriz de entrega, alcance y guion de sustentación](evidencia-entrega.md).
- [Diapositiva de CineMerch](Diapositiva%20CineMerch.pptx).
- [Pruebas de pagos y consentimiento](../tests/payments.test.ts).
- [Preparación y ejecución local](../README.md).

# Evidencia de entrega de CineMerch

Universidad de Cartagena · Ingeniería de Sistemas · rama `cambios2k`

CineMerch es una tienda académica para coleccionistas de cine físico en Colombia. La demostración local usa datos ficticios. El [README](../README.md) permite reproducir el entorno y la [diapositiva editable](./Diapositiva%20CineMerch.pptx) acompaña la sustentación.

## Matriz de requisitos

| Requisito | Evidencia en la demo | Pendiente para una operación real |
| --- | --- | --- |
| Requisitos legales | Condiciones visibles, precios en COP, importe de entrega, resumen y corrección de cantidades antes de registrar, identificador persistente de pedido y enlace a la SIC. | Identidad y contactos verificables del vendedor, canal con radicación y seguimiento de PQR, políticas operativas de entrega, garantía, retracto y reversión, y revisión del texto aplicable a la operación. |
| Protección de datos | Página de privacidad con finalidades, almacenamiento y derechos. Lista de espera y checkout requieren una autorización expresa y guardan su versión y fecha en SQLite. Analítica externa optativa. | Identificar al responsable real con su canal permanente, definir retención, supresión y atención de derechos, y revisar los proveedores que tratarían los datos. |
| Seguridad en pagos | Pasarela Wompi simulada sin credenciales bancarias. Cálculo de importes en servidor, token privado por pedido, eventos firmados y control de duplicados. Descuento de stock solo al aprobar. | Proveedor, credenciales, integraciones, atribuciones y controles de un comercio operativo. |
| Captación multicanal | Landing «Primeros 100 Cinéfilos», cupón y soporte de atribución de campaña por canal. Instagram, TikTok y WhatsApp admiten enlaces configurables. | Perfiles oficiales, mensajes y calendario de campañas. Solo publicar enlaces propios y verificados. |
| SEO y SEM | Metadatos diferenciados, URLs canónicas, sitemap y robots configurables. Plan de búsqueda pagada con enlaces UTM. | Dominio autorizado, alta en Search Console y campaña pagada con presupuesto aprobado. |
| Análisis de impacto | Monitor local con eventos de registro, carrito, checkout y aprobación. Atribución por canal disponible en los eventos de la demo. | Una propiedad GA4 verificada y datos reales suficientes para evaluar conversiones. |
| Alcance y trazabilidad | Backlog y registro de ajustes en este documento. Los cambios de esta entrega se pueden auditar con los archivos de la rama. | Registrar las modificaciones posteriores a la entrega en la herramienta de seguimiento del equipo. |
| Evidencia y sustentación | Documento, diapositiva y guion de prueba reproducibles en la copia local. | Sustentación por el equipo. |

Fuentes oficiales para la revisión del comercio real. [Ley 1480 de 2011, artículos 47 y 49–51](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=44306) · [Ley 2439 de 2024](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=257116) · [Ley 1581 de 2012](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981).

## Captación, SEO y SEM

| Canal | Propuesta | Destino | Indicador |
| --- | --- | --- | --- |
| Web y búsqueda orgánica | Páginas de catálogo, preventa y campaña con términos de intención específica, por ejemplo «Steelbook 4K Colombia» o «preventas 4K UHD». | `/catalogo`, `/preventas` y `/#primeros-100`. | Visitas orgánicas y registros. |
| Instagram y TikTok | Clips de colecciones y fichas con formato, región y extras. | `/?utm_source=instagram&utm_medium=social&utm_campaign=primeros_100#primeros-100` y equivalente con `tiktok`. | Visitas y registros por canal. |
| WhatsApp y correo | Compartir la campaña con audiencias autorizadas mediante canales del equipo. | En el mismo enlace usar `whatsapp/messaging` o `email/email` como valores de fuente y medio. | Registros atribuidos y clics reportados por el canal. |
| SEM | Campaña de búsqueda propuesta, inicialmente en Colombia. Agrupar «steelbook 4k Colombia» y «comprar Blu-ray 4K». Excluir búsquedas de descargas o streaming. El anuncio debe identificar la demostración. | `/?utm_source=google&utm_medium=cpc&utm_campaign=primeros_100#primeros-100` | CTR, costo por registro y registros por canal. Activación sujeta a contar con un dominio y presupuesto autorizados. |

Define `NEXT_PUBLIC_SITE_URL` con el origen HTTPS de un dominio autorizado si deseas habilitar sitemap, canónicas e indexación. La copia local mantiene la indexación deshabilitada. Los enlaces sociales se configuran con las variables de `.env.example`.

## Medición y lectura del embudo

- `page_view` identifica visitas e incluye la atribución de campaña cuando se usó un enlace etiquetado.
- `generate_lead` identifica un registro nuevo. Repetir el registro no suma otro lead.
- `view_item`, `add_to_cart` y `begin_checkout` permiten detectar en qué etapa cae la interacción.
- `purchase` se emite solo por una aprobación de prueba. El valor en COP corresponde a la simulación y no representa ingresos.
- En una medición real, calcula por el mismo periodo y canal el porcentaje de sesiones con registro sobre sesiones de entrada y el porcentaje de checkouts con compra aprobada sobre checkouts iniciados. Para SEM, calcula CTR como clics sobre impresiones y costo por registro como gasto sobre registros atribuidos. Con cero en el denominador, reporta el indicador como no disponible.
- El monitor local muestra los últimos 30 eventos en memoria. Sirve para demostrar instrumentación. Las pruebas automatizadas comprueban la persistencia y las transiciones sin generar estadísticas de tráfico real.

## Product Backlog y registro de cambios

| Alcance | Historias | Estado según la implementación |
| --- | --- | --- |
| Landing y captación | US-01 a US-04 | Infraestructura local, formulario, cupón y analítica local. Resend y píxeles sociales quedan fuera de la demo. |
| Catálogo y kits | US-05 a US-08 | Alta con metadatos TMDB, filtros, ficha y vista de kits. |
| Carrito y pago | US-09 a US-14 | Drawer, envío gratis y venta cruzada. Wompi simulado, contraentrega pendiente y proforma en pantalla. Avisos externos y punto de recogida pendientes. |
| Operación y fidelización | US-15 a US-20 | Preventas, logística administrativa, reseñas iniciales y panel protegido. El checkout desactiva el canje y registra una proyección de puntos. Saldo, fotos de unboxing y rastreo de cara al cliente quedan pendientes. |
| Entrega académica | CE-01 a CE-03 | CE-01 incorpora privacidad, condiciones y registro de autorización. CE-02 añade SEO técnico y atribución. CE-03 reúne evidencia, guion y diapositiva. |

| Cambio | Justificación | Evidencia |
| --- | --- | --- |
| Alcance del pago | Demostrar los distintos resultados y reintentos sin dinero ni datos bancarios. | Checkout, eventos firmados y suite de pagos. |
| Protección y consentimiento | Explicar el tratamiento y dejar evidencia recuperable para nuevos registros. | Política, formularios, validación en servidor y campos en Prisma. |
| Captación y medición | Distinguir canales y validar el embudo con una demo local. | Enlaces UTM, monitor y plan de campañas. |
| SEO técnico | Permitir configurar el dominio de una entrega autorizada y evitar indexación accidental de la copia de prueba. | Metadatos, robots y sitemap. |

Para cambios después de la entrega, registra en la herramienta de seguimiento la fecha, historia, cambio, motivo y evidencia. Conserva el enlace a ese registro junto con la versión entregada.

## Verificación local

- La suite de 13 pruebas, TypeScript y la compilación de Next.js pasaron. Se comparó SQLite con el respaldo para confirmar la conservación de órdenes, leads, catálogo e historial de pagos.
- En Edge a 390 × 844, el registro exigió consentimiento y mostró el cupón. Se ejecutó PSE pendiente, recuperación tras recarga, rechazo, reintento sobre el mismo pedido y aprobación con proforma y carrito vacío. El evento de compra conservó la atribución de Instagram. No se observaron errores JavaScript ni solicitudes a Wompi o GA4 durante esa prueba.
- Se verificaron robots y sitemap con un origen HTTPS ficticio. La prueba de navegador usó una copia aislada de SQLite y el monitor local.

## Guion de la sustentación

1. Inicia la tienda según el README. Abre la landing con un enlace UTM y muestra condiciones y política de datos.
2. Con datos ficticios, intenta registrar el interés sin consentimiento. Márcalo, envía y muestra el cupón. En el monitor debe aparecer un solo `generate_lead`. Repetir el correo no genera otro.
3. Agrega un producto, verifica subtotal y envío, acepta las condiciones y elige PSE. Deja pendiente, recarga y recupera el pedido desde el carrito.
4. Rechaza el intento, crea uno nuevo y comprueba que conserva el número de pedido. Aprueba y muestra la proforma de prueba, el carrito vacío y el evento `purchase`.
5. Ejecuta las derivaciones de error y contraentrega local. Confirma que se conserva el carrito y verifica que la contraentrega no está disponible fuera de Cartagena, Bolívar.
6. Abre `/admin` con token, muestra las órdenes e identifica las que cuentan en ventas aprobadas. Enseña los estados de pago y el paso logístico permitido.

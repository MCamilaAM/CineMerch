# CineMerch

Tienda de ediciones físicas y coleccionables con Next.js, Prisma y SQLite. Wompi funciona como simulación académica, sin cobros ni conexiones bancarias.

## Preparación local

1. Ejecuta `npm install`.
2. Si es una instalación nueva, copia `.env.example` a `.env.local`. Si ya tienes `.env`, conserva su configuración. Next.js y los scripts de base cargan `.env.local` mediante `@next/env`. Las variables de la terminal tienen prioridad.
3. Genera dos valores independientes con `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` y guárdalos en `.env.local` como `MOCK_WOMPI_EVENT_SECRET` y `ADMIN_ACCESS_TOKEN`. Conserva `PAYMENT_PROVIDER=WOMPI_SIMULATED` y `PAYMENT_SIMULATION_ENABLED=true` para activar la demo.
4. Ejecuta `npm run prisma:generate`, prepara SQLite y ejecuta `npm run db:seed`.
5. Inicia con `npm run dev` y abre `http://localhost:3000`.

### Preparar SQLite

Usa `npm run db:setup` si la base es nueva. La URL `file:./dev.db` se resuelve desde `prisma/`. Para una base existente, detén la aplicación y cualquier otro cliente SQLite. Ejecuta `npm run db:setup -- --app-stopped`. El script rechaza archivos `-wal` o `-journal`, guarda un respaldo fechado y ejecuta `prisma db push` sin opciones de pérdida de datos. Conserva el respaldo hasta verificar la actualización.

El seed agrega el catálogo y los accesorios faltantes, inserta reseñas iniciales si la tabla está vacía y agrega leads de ejemplo por correo. Conserva pedidos, precios y existencias previas.

### Probar el checkout

Agrega un producto y selecciona Tarjeta, Nequi, PSE, Bancolombia o Bre-B. La pasarela permite aprobar, rechazar, dejar pendiente y simular un error. Después de un rechazo o error, puedes crear un nuevo intento sobre el mismo pedido. Tras recargar, abre el carrito y selecciona **Consultar último pedido de prueba guardado**. Un pago aprobado muestra una proforma imprimible. La contraentrega solo está disponible en Cartagena, Bolívar y queda pendiente.

En `/admin`, aplica el valor local de `ADMIN_ACCESS_TOKEN`. El navegador lo guarda en `sessionStorage`. Las ventas cobradas y el ticket promedio incluyen los pedidos con pago aprobado. La logística permite pasar de pagado a enviado y luego a entregado.

## API local

| Ruta | Acceso | Comportamiento |
| --- | --- | --- |
| `POST /api/orders` | Público, con UUID privado por checkout | Recibe entrega, método, IDs, cantidades y cupón. Calcula importes del catálogo y devuelve la orden, su token y el primer intento, si aplica. |
| `GET /api/orders` | Bearer administrativo | Lista pedidos con su último intento. |
| `PATCH /api/orders/:id` | Bearer administrativo | Admite `status`, `carrier` y `trackingNumber` para logística de pedidos aprobados. |
| `GET /api/orders/:id/payment-status` | Bearer del pedido | Devuelve el estado y el último intento, sin datos personales. |
| `POST /api/orders/:id/payment-attempt` | Bearer del pedido | Devuelve el intento pendiente o crea uno tras rechazo o error. |
| `POST /api/wompi/simulate` | Bearer del pedido | Recibe `transactionId` y `scenario`. Genera y aplica el evento localmente. |
| `POST /api/wompi/webhook` | Firma local | Verifica y aplica `transaction.updated` en entorno `test`. |
| `POST /api/products` | Bearer administrativo | Crea productos. |
| `GET /api/waitlist` | Público, bearer administrativo para datos personales | Publica cantidades y cupos. La lista de leads requiere el token. |
| `POST /api/waitlist` | Público | Registra interesados. |

Los importes de transacciones se devuelven como cadenas de centavos COP. Para la firma ficticia se concatenan los valores de `signature.properties` en el orden indicado, el `timestamp` numérico del cuerpo y `MOCK_WOMPI_EVENT_SECRET`. Se calcula SHA-256 hexadecimal. Se admite `X-Event-Checksum` o `signature.checksum`. Si se envían ambos, los dos deben coincidir. El receptor compara también el ID, la referencia, la moneda y el importe persistidos.

## Límites de la demo

- El inventario se descuenta al aprobar. Antes de ese momento no se reserva.
- Los puntos son una proyección de la orden. No hay saldo de cliente verificable ni canje activo.
- La contraentrega queda pendiente. La demo no registra su cobro ni permite despacharla.
- Los cupones públicos demo no tienen canje único por cliente. Los códigos individuales deben existir y estar vigentes.
- El token administrativo es una protección mínima para la demo local.
- El navegador deduplica el evento de compra con una marca en `localStorage`. Borrar esa marca permite una nueva emisión.
- El último pedido y su token se guardan en `localStorage`. Usa datos ficticios y limpia el almacenamiento en equipos compartidos.

## Verificación

`npm run test:payments` crea una base aislada en `work/`, aplica el esquema, ejecuta las pruebas y elimina su propia carpeta temporal. En Windows pasaron los 12 grupos. La actualización de SQLite generó un respaldo y conservó las filas históricas de pedidos, productos, reseñas y leads. Los nuevos defaults de pedido son `PENDING` y `PENDIENTE`.

El flujo móvil a 390 × 844 confirmó que un PSE pendiente se recupera tras recargar, que el reintento mantiene el número de pedido y que la aprobación muestra la proforma y vacía el carrito. La consola no registró errores durante el recorrido.

También pasaron `npm run typecheck`, `npm run build` y `node scripts/run-local.mjs npx prisma validate`.

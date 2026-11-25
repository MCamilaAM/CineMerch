# Arranque de producción con SQLite

El proyecto usa Next.js 16, React 19 y Node.js 24. Prisma se mantiene en 5.22.0, con la misma versión para la CLI y el cliente. La actualización del framework conserva el esquema y los datos del comercio.

Desarrollo y compilación usan Webpack, soportado por Next.js 16. Turbopack falló al iniciar el proceso de CSS en el entorno Windows de validación.

## Instalación y compilación

```sh
npm ci
npm run build
```

`postinstall` genera el cliente Prisma y `build` vuelve a generarlo antes de compilar Next.js. La compilación no crea ni modifica SQLite: el volumen de datos solo se necesita al arrancar. Para compilar, instala también las dependencias de desarrollo; el arranque conserva la CLI de Prisma entre las dependencias de producción.

Define las variables `NEXT_PUBLIC_*` antes de compilar porque Next.js las incorpora al JavaScript público. Usa `.env.production.example` como referencia. Nunca copies secretos a variables con ese prefijo ni subas archivos `.env` o bases de datos a Git.

## Disco y variables

- Monta almacenamiento persistente y define una ruta absoluta, por ejemplo `DATABASE_URL=file:/data/cinemerch.db`.
- En Windows, una ruta de ejemplo es `file:C:/datos/cinemerch/cinemerch.db`.
- Ejecuta una sola instancia contra ese archivo. El directorio debe permitir lectura y escritura al usuario del servidor.
- El script puede crear el directorio; debes montar el volumen persistente en el proveedor antes de arrancar. Crear un directorio no garantiza persistencia.
- Configura `ADMIN_ACCESS_TOKEN` y `MOCK_WOMPI_EVENT_SECRET` con valores aleatorios independientes. Conserva los respaldos en otro almacenamiento y verifica periódicamente su restauración.

Si usas Railway, un montaje `/data` permite usar la URL del ejemplo. El SQLite local no es adecuado para funciones con almacenamiento efímero. Para una arquitectura de varias instancias, cambia a una base de datos compartida antes de escalar.

Las variables del proveedor o de la terminal tienen prioridad sobre los archivos. Los scripts de producción cargan `.env.production.local`, `.env.local`, `.env.production` y `.env` con la misma prioridad de Next.js. No cargan `.env.development`. En tu equipo debes sobrescribir la URL relativa de desarrollo con la URL absoluta de producción.

## Base nueva

```sh
npm start
```

Con `DATABASE_URL` configurada, el arranque ejecuta `prisma migrate deploy`, crea una base vacía si hace falta, aplica las migraciones pendientes y solo entonces inicia Next.js en `0.0.0.0` y el puerto `PORT` (3000 por defecto). Si falta la compilación, la URL es inválida o falla una migración, el servidor no inicia.

Puedes ejecutar únicamente las migraciones con `npm run db:deploy`. No se ejecuta `db push`, no se reinicia la base y no se cargan productos, reseñas, leads ni pedidos ficticios durante el arranque. Una base nueva tendrá el catálogo vacío hasta que añadas productos o transfieras una base existente.

## Conservar una base existente

La migración `0_init` reproduce el esquema actual. Las bases creadas previamente con `db push` requieren registrar esa línea base una sola vez:

1. Detén la aplicación y cualquier cliente SQLite. Si existen archivos `-wal` o `-journal`, permite que SQLite termine de consolidarlos; no los borres manualmente.
2. Apunta `DATABASE_URL` a la base que vas a adoptar. Para producción, usa una ruta absoluta y `NODE_ENV=production`.
3. Ejecuta `npm run db:baseline -- --app-stopped`.
4. El script crea un respaldo fechado, comprueba que la base coincide con el esquema y registra `0_init` como aplicada. Si hay diferencias, se detiene sin aplicar cambios al esquema.
5. Ejecuta `npm run db:deploy` para producción, o `npm run db:setup -- --app-stopped` para la base local. Verifica las filas y conserva el respaldo.

El comando de adopción está limitado a la migración inicial. No lo uses para ocultar diferencias de esquema ni para marcar migraciones posteriores como aplicadas.

Para trasladar los datos locales al servidor, detén la aplicación, respalda el archivo y cópialo al volumen mediante un canal privado. Si la base ya tiene el historial de Prisma, arranca directamente; si no lo tiene, realiza la adopción anterior antes de arrancar. No reemplaces una base del servidor que ya tenga pedidos nuevos.

## Cambios futuros y respaldos

Crea nuevas migraciones en desarrollo con `node scripts/run-local.mjs npx prisma migrate dev --name nombre_del_cambio`, revisa el SQL y versiona el directorio `prisma/migrations`. En producción aplica únicamente `migrate deploy`. Antes de actualizar el esquema de una base con datos, detén las escrituras y crea un respaldo consistente. El arranque no hace copias automáticas ni adopta bases desconocidas.

`db:setup` está reservado al desarrollo y respalda las bases existentes antes de aplicar las migraciones. `db:seed` sigue disponible como carga de demostración explícita; no forma parte de la instalación ni del arranque de producción.

## Pruebas antes de publicar

```sh
npm run lint
npm run typecheck
npm run test:payments
npm run test:deployment
npm run build
```

Las pruebas de despliegue usan archivos temporales aislados y comprueban creación, repetición de migraciones, adopción con respaldo, preservación de filas y rechazo de esquemas distintos o rutas inseguras. Para probar el servidor localmente, usa una copia de la base en una ruta absoluta distinta de `prisma/dev.db`, define `DATABASE_URL` y ejecuta `npm start`. El servidor queda activo hasta detenerlo con Ctrl+C.

El lint mantiene como advertencia la recomendación nueva `react-hooks/set-state-in-effect`: algunos componentes existentes restauran almacenamiento del navegador y reinician diálogos tras la hidratación. También informa el uso del componente de imágenes con respaldo propio. Estas recomendaciones no impiden compilar.

Validación local del 25 de noviembre de 2026: generación de Prisma, TypeScript y compilación de producción correctos; 13 pruebas de pagos y 5 de despliegue aprobadas; lint sin errores y con 8 advertencias. Dos arranques contra una copia aislada comprobaron portada, catálogo, autorización administrativa, creación y consulta de un pedido, reintento pendiente y persistencia tras reiniciar. La base local conservó sus 7 pedidos, 15 productos, 3 reseñas, 5 leads, 6 transacciones y 6 eventos; también se verificaron su integridad y la igualdad del contenido antes y después de registrar la línea base.

La pasarela sigue siendo una simulación. La plantilla de producción la deja desactivada; activarla para una demostración requiere `PAYMENT_SIMULATION_ENABLED=true` y los secretos configurados. Esta preparación no integra cobros reales ni publica el proyecto.

Referencias: [actualización de Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16), [alojamiento de Next.js](https://nextjs.org/docs/app/guides/self-hosting) y [línea base de Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining).

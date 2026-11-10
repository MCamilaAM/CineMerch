# 🎬 CineMerch - Plataforma E-Commerce Especializada en Cine y Coleccionismo

> **Universidad de Cartagena • Facultad de Ingeniería • Ingeniería de Sistemas**  
> **Asignatura:** Comercio Electrónico | **Metodología:** SCRUM (Sprints de 5 días)  
> **Integrantes:** Camilo Isaac Acevedo Rueda, María Camila Angulo Martínez, Camilo Andrés Buelvas Bornacelly y Juan Ángel Chamorro Puello.

---

## 🌟 Resumen del Proyecto

**CineMerch** es una plataforma de comercio electrónico diseñada para satisfacer las demandas de los coleccionistas y cinéfilos de Colombia, iniciando operaciones en **Cartagena de Indias y el departamento de Bolívar**.

A diferencia de los marketplaces genéricos, CineMerch ofrece:
- **Curaduría Técnica del Séptimo Arte:** Verificación de masters 4K UHD, compatibilidad de región (Región Libre y Región A), especificaciones sin pérdida (Dolby Atmos / DTS-HD Master Audio) y empaque blindado anti-impactos para estuches metálicos (Steelbooks).
- **Integración Directa con TMDB API v3:** Enriquecimiento de productos con directores, elencos, estudios, calificaciones y afiches oficiales en alta resolución.
- **Pasarela de Pagos Localizada con Wompi:** Soporte para Nequi (Push / QR dinámico), Botón Bancolombia, transferencias Bre-B / Llaves, tarjetas Visa/Mastercard, PSE y **Pago Contraentrega Local en Cartagena**.
- **Analítica Integrada con Google Analytics 4 (GA4):** Medición de eventos del embudo de conversión (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `lead_capture`).
- **Programa de Fidelización Cinéfilo:** Rangos de cliente (*Extra*, *Reparto*, *Protagonista*, *Director*) con acumulación de 1 punto por cada $1.000 COP y redención de hasta un 30% en checkout.

---

## 🎨 Diseño Visual y Paleta de Colores

El frontend está desarrollado siguiendo la estructura visual de la imagen de referencia con **tonalidades rojas de terciopelo cinematográfico** (`#5D1217`, `#7F1D1D`, `#B91C1C`), acentos en tonos crema / pergamino cálido (`#FAF7F2`, `#F5EFE6`) y detalles en oro cinematográfico (`#F59E0B`):
1. **Top Announcement Ribbon:** Anuncio de la campaña *"Primeros 100 Cinéfilos"* (10% OFF con código `CINEMERCH10`) y meta de envío gratis a partir de $150.000 COP.
2. **Hero Cinéfilo:** Titular imponente, llamada a la acción y visuales de estuches metálicos.
3. **Barra de Métricas y Estadísticas:** `+1,500` Cinéfilos Registrados, `99.2%` Calificaciones 5 Estrellas, `+2,400` Ediciones Entregadas, `100%` Región Libre.
4. **4 Tarjetas de Categoría Curadas:** *Ediciones 4K & Steelbooks*, *Kits Temáticos & Bundles*, *Preventas de Estreno*, *Merch Oficial & Accesorios*.
5. **Sección "CineMerch & el Equipo":** Narrativa del proyecto en la Universidad de Cartagena con sus pilares técnicos.
6. **Reel Circular de Miniaturas:** Franja de detalles de colección en círculos.
7. **Catálogo Reactivo "Nuestra Selección":** Filtros por género, formato y directores de culto (Christopher Nolan, Quentin Tarantino, Denis Villeneuve, Stanley Kubrick, Francis Ford Coppola, Ridley Scott).
8. **Ficha Técnica Detallada (Modal):** Región de disco, pistas de audio, subtítulos, relación de aspecto y calificación TMDB.
9. **"La Curaduría CineMerch: El Estándar":** Inspección 4K, Empaque blindado y logística.
10. **Testimonios de Coleccionistas:** Reseñas verificadas con comillas tipográficas rojas estilizadas.
11. **Acordeón de Preguntas Frecuentes (FAQs):** Respuestas sobre compatibilidad en Colombia, medios de pago y tiempos de envío.
12. **Banner de Captura de Leads:** Formulario con validación para WhatsApp (+57) y correo, contador dinámico de cupos restantes y confeti interactivo.
13. **Footer Imponente:** Logotipo tipográfico gigante *CineMerch*, enlaces directos y badges de medios de pago colombianos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS | Interfaz reactiva, Server & Client Components, animaciones fluidas |
| **Backend** | Next.js Route Handlers (`/api/...`) | Endpoints REST para productos, órdenes, lista de espera, webhooks y TMDB |
| **Base de Datos** | PostgreSQL / SQLite vía Prisma ORM | Modelado relacional (`Product`, `Order`, `WaitlistLead`, `Review`) |
| **API Cinematográfica** | The Movie Database (TMDB v3 API) | Consulta y autocompletado de metadatos oficiales de películas |
| **Pasarela de Pagos** | Wompi API Bancolombia + Simulador Local | Nequi, Bancolombia, Bre-B, tarjetas, PSE y Contraentrega Cartagena |
| **Analítica** | Google Analytics 4 (GA4) + Inspector en Vivo | Medición y trazabilidad de eventos de comercio electrónico |

---

## 📊 Integración de Google Analytics 4 (GA4)

La aplicación tiene configurado el script oficial de Google Analytics (`gtag.js`) a través de la variable `NEXT_PUBLIC_GA_ID`.

### Eventos GA4 Emitidos en Tiempo Real:
- `page_view`: Registro de navegación en cada ruta (`/`, `/catalogo`, `/preventas`, `/kits`, `/fidelizacion`, `/admin`).
- `view_item`: Se dispara al abrir la **Ficha Técnica** de cualquier película con su ID, título, categoría y precio en COP.
- `add_to_cart`: Se emite al añadir un producto o kit al carrito de compras.
- `remove_from_cart`: Se emite al eliminar un artículo del carrito.
- `begin_checkout`: Se emite al iniciar el proceso de checkout con el desglose de productos y monto total.
- `purchase`: Se emite al confirmar la compra, registrando el número de orden (`CNM-2026-XXXX`), subtotal, IVA del 19%, costo de envío y método de pago (Wompi o Contraentrega).
- `lead_capture`: Se emite cuando un usuario se registra en la campaña *"Primeros 100 Cinéfilos"*.

### 🔍 Inspector de Eventos en Tiempo Real (GA4 Live Debugger)
En la esquina inferior derecha de la pantalla encontrarás un botón flotante con pulso verde: **"GA4 Live: X eventos"**. Al hacer clic, puedes desplegar el monitor en vivo para inspeccionar cada evento emitido con su timestamp y payload JSON completo.

---

## 🚀 Puesta en Marcha Local

### 1. Requisitos Previos
- Node.js versión 18+ (probado en Node v22.17.0).
- NPM versión 9+.

### 2. Instalación de Dependencias
```bash
npm install
```

### 3. Sincronización de Base de Datos y Carga de Semillas
```bash
# Sincroniza el esquema relacional de Prisma
npx prisma db push

# Puebla la base de datos con películas curadas (Oppenheimer, Pulp Fiction, Dune, etc.)
npx tsx prisma/seed.ts
```

### 4. Ejecución del Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🧭 Rutas Principales de la Aplicación

- **`/`**: Página de inicio completa con diseño inspirado en la fotografía de referencia.
- **`/catalogo`**: Catálogo reactivo con buscador en vivo y filtros facetados por director, género y formato.
- **`/preventas`**: Módulo de preventas con reloj de cuenta regresiva en vivo y fechas estimadas de entrega.
- **`/kits`**: Colección de kits temáticos y bundles con cálculo dinámico de ahorro (8% al 12% OFF).
- **`/fidelizacion`**: Explicación del Club de Rangos (*Extra*, *Reparto*, *Protagonista*, *Director*) y calculadora de puntos.
- **`/admin`**: Panel administrativo protegido con KPIs de ventas en COP, ticket promedio, gestión de órdenes de despacho y alta de productos con autocompletado TMDB.

---

## 📄 Cumplimiento de Historias de Usuario (Product Backlog)

- ✅ **US-01 / US-02 / US-03 / US-04**: Infraestructura Next.js + Tailwind, formulario reactivo con validación de celular Colombia (+57), contador de cupos para los primeros 100 y eventos GA4 `lead_capture`.
- ✅ **US-05**: Conexión con TMDB API para autocompletar título, director, elenco, productora y póster por ID.
- ✅ **US-06 / US-07**: Catálogo facetado y fichas técnicas completas con badges de región, Dolby Atmos y extras.
- ✅ **US-08**: Modelado de bundles y kits temáticos con ahorro del 11%.
- ✅ **US-09 / US-10 / US-11**: Carrito deslizable con persistencia en localStorage, barra de progreso hacia envío gratis ($150.000 COP) y sugerencias de venta cruzada en 1 clic.
- ✅ **US-12 / US-13 / US-14**: Pasarela de pago Wompi (Nequi, Bancolombia, Bre-B, tarjetas), opción contraentrega en Cartagena y generación de factura proforma con desglose de IVA (19%).
- ✅ **US-15 / US-16**: Módulo de preventas con cuenta regresiva y asignación de transportadoras (Coordinadora / Inter Rapidísimo / Mensajería Cartagena).
- ✅ **US-17 / US-18**: Rangos cinéfilos y redención de puntos en checkout (hasta 30% de la orden).
- ✅ **US-19 / US-20**: Testimonios y dashboard administrativo con métricas financieras y exportación a CSV.

import Link from "next/link";
import type { Metadata } from "next";
import { termsVersion } from "@/lib/store-policy";

export const metadata: Metadata = { title: "Condiciones de la compra de prueba | CineMerch" };

export default function ConditionsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-6 py-12 leading-relaxed text-zinc-800">
      <header>
        <h1 className="font-serif text-3xl font-bold text-cine-900">Condiciones de la compra de prueba</h1>
        <p>Versión {termsVersion} · Equipo académico CineMerch · Cartagena, Colombia</p>
      </header>
      <section>
        <h2 className="text-xl font-bold">Catálogo, precios y entrega</h2>
        <p>Las fichas muestran formato, descripción y precio en COP. El servidor confirma disponibilidad, descuento y envío al registrar el pedido. El pedido local cuesta $8.000 COP de envío en Cartagena, Bolívar. El envío nacional cuesta $15.000 COP. El envío es gratis a partir de $150.000 COP de subtotal.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Confirmación y pagos</h2>
        <p>Puedes modificar el carrito antes de registrar el pedido. El checkout muestra el resumen con los importes confirmados, el número de pedido y el último intento. Wompi funciona como simulación académica con tarjeta, Nequi, PSE, Bancolombia y Bre-B. La contraentrega se registra como pendiente en Cartagena, Bolívar.</p>
        <p>La demo funciona sin cobros ni despachos. La proforma aprobada es un comprobante de prueba sin validez fiscal. Puedes volver al carrito y consultar el último pedido guardado en ese navegador.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Orientación al consumidor</h2>
        <p>Para operaciones reales, la Ley 1480 establece obligaciones de información y mecanismos de atención. Consulta allí las condiciones y excepciones del retracto y la reversión del pago. En esta demo, el equipo recibe observaciones durante la sustentación.</p>
        <p><a className="underline" href="https://sedeelectronica.sic.gov.co/">Autoridad de protección al consumidor · SIC</a></p>
        <p><Link className="underline" href="/privacidad">Política de tratamiento de datos</Link></p>
      </section>
    </article>
  );
}

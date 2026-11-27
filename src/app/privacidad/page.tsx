import type { Metadata } from "next";
import { privacyVersion } from "@/lib/store-policy";
import AnalyticsPreference from "@/components/AnalyticsPreference";

export const metadata: Metadata = { title: "Política de tratamiento de datos | CineMerch" };

export default function PrivacyPage() {
  const contact = process.env.CINEMERCH_PRIVACY_EMAIL;

  return (
    <article className="mx-auto max-w-3xl space-y-6 px-6 py-12 leading-relaxed text-zinc-800">
      <header>
        <h1 className="font-serif text-3xl font-bold text-cine-900">Política de tratamiento de datos</h1>
        <p>Versión {privacyVersion} · Demostración académica local</p>
      </header>
      <section>
        <h2 className="text-xl font-bold">Responsable de la demostración</h2>
        <p>Equipo académico de CineMerch, Ingeniería de Sistemas de la Universidad de Cartagena. Usa únicamente datos ficticios para el registro y la compra.</p>
        {contact
          ? <p>Solicitudes de privacidad por correo a <a className="underline" href={"mailto:" + contact}>{contact}</a>.</p>
          : <p>Para solicitar cambios o supresión en una copia local, acude al equipo que administra esa copia durante la demostración.</p>}
      </section>
      <section>
        <h2 className="text-xl font-bold">Datos y finalidades</h2>
        <p>La lista de espera guarda nombre, correo y teléfono para registrar el interés y mostrar un cupón. El checkout añade ciudad, departamento y dirección para registrar la entrega de prueba. Guardamos la fecha y versión de la autorización. La demo utiliza el correo y teléfono como datos de contacto del pedido y no envía avisos comerciales.</p>
        <p>La base SQLite guarda registros e intentos de pago para verificar la demo. El panel restringe la consulta administrativa por token. El navegador guarda el carrito y el último pedido con su token de acceso para recuperarlo tras recargar. El sistema conserva los registros durante la evaluación local y el equipo puede suprimirlos junto con sus copias de respaldo al terminar el ejercicio.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Derechos y solicitudes</h2>
        <p>Puedes conocer, actualizar o rectificar tus datos, solicitar prueba de la autorización e información sobre su uso, y pedir la revocación o supresión cuando proceda. Indica el registro que deseas consultar y la acción solicitada. Si corresponde, puedes presentar una queja ante la Superintendencia de Industria y Comercio después de agotar el trámite de consulta o reclamo.</p>
        <p><a className="underline" href="https://sedeelectronica.sic.gov.co/">Superintendencia de Industria y Comercio (SIC)</a></p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-bold">Analítica opcional</h2>
        <p>El monitor administrativo registra eventos de la demo en memoria de la página. La analítica externa está activada por defecto y puedes desactivarla con la opción siguiente. Respetamos las preferencias de rechazo ya guardadas en este navegador. Mientras esté habilitada, las etiquetas de Google Analytics 4 configuradas mediante Google Tag Manager pueden recibir interacciones del embudo, el canal de campaña y datos técnicos de uso. CineMerch excluye correo, teléfono, dirección y cupones individuales de los eventos.</p>
        <AnalyticsPreference />
      </section>
    </article>
  );
}

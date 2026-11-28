"use client";

import { paymentMethods } from "@/lib/checkout-options";

export interface PaymentAttempt {
  id: string;
  reference: string;
  amountInCents: string;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export function PaymentDetails({ transaction }: { transaction: PaymentAttempt }) {
  return (
    <dl className="grid gap-1 text-sm break-words">
      <div><dt className="text-zinc-400">Referencia</dt><dd className="font-mono">{transaction.reference}</dd></div>
      <div><dt className="text-zinc-400">ID de operación</dt><dd className="font-mono">{transaction.id}</dd></div>
      <div><dt className="text-zinc-400">Estado</dt><dd>{transaction.status}</dd></div>
      <div><dt className="text-zinc-400">Método</dt><dd>{paymentMethods[transaction.paymentMethod as keyof typeof paymentMethods]}</dd></div>
      <div><dt className="text-zinc-400">Fecha del intento</dt><dd>{new Date(transaction.createdAt).toLocaleString("es-CO")}</dd></div>
    </dl>
  );
}

export default function SimulatedWompiGateway({ transaction }: {
  transaction: PaymentAttempt;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-cine-800 bg-cine-950 p-4">
      <h4 className="font-serif text-xl font-black text-amber-300">Wompi</h4>
      <PaymentDetails transaction={transaction} />
      <p role="status" className="text-sm text-zinc-300">Tu pago está pendiente de confirmación. Puedes consultar su estado aquí o volver más tarde desde el carrito.</p>
    </section>
  );
}

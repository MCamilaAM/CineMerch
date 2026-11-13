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

const scenarios = {
  APPROVED: "Aprobar",
  DECLINED: "Rechazar",
  PENDING: "Dejar pendiente",
  ERROR: "Simular error",
};

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

export default function SimulatedWompiGateway({ transaction, busy, onScenario }: {
  transaction: PaymentAttempt;
  busy: boolean;
  onScenario: (scenario: keyof typeof scenarios) => void;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-cine-800 bg-cine-950 p-4">
      <h4 className="font-serif text-xl font-black text-amber-300">Wompi — Simulación académica</h4>
      <p className="text-sm">Pago de prueba: no se realizará ningún cobro</p>
      <PaymentDetails transaction={transaction} />
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(scenarios) as (keyof typeof scenarios)[]).map((scenario) => (
          <button key={scenario} type="button" disabled={busy} onClick={() => onScenario(scenario)}
            className="rounded-xl bg-amber-400 px-3 py-2 text-sm font-bold text-cine-950 disabled:opacity-50">
            {scenarios[scenario]}
          </button>
        ))}
      </div>
    </section>
  );
}

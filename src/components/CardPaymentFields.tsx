"use client";

const input = "w-full min-w-0 rounded-xl border border-zinc-600 bg-zinc-900 p-2.5 text-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400";

export default function CardPaymentFields({ disabled }: { disabled: boolean }) {
  return (
    <fieldset disabled={disabled} className="space-y-3 rounded-xl border border-cine-800 bg-cine-950 p-4">
      <legend className="px-1 font-serif text-lg font-bold text-amber-300">Datos de la tarjeta</legend>
      <p id="card-demo-help" className="text-sm text-zinc-300">Usa datos ficticios. Esta simulación no verifica la tarjeta con ningún banco y no guarda sus datos.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm sm:col-span-2">Titular de la tarjeta
          <input data-card-field type="text" required maxLength={120} pattern=".*\S.*" autoComplete="off"
            placeholder="Titular de prueba" aria-describedby="card-demo-help" className={input} />
        </label>
        <label className="grid gap-1 text-sm sm:col-span-2">Número de la tarjeta
          <input data-card-field type="text" inputMode="numeric" required minLength={15} maxLength={23}
            pattern="(?:[0-9] ?){12,18}[0-9]" autoComplete="off" placeholder="0000 0000 0000 0000"
            title="Ingresa entre 13 y 19 dígitos ficticios." aria-describedby="card-demo-help" className={input}
            onChange={(event) => {
              event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})(?=.)/g, "$1 ");
            }} />
        </label>
        <label className="grid gap-1 text-sm">Fecha de vencimiento
          <input data-card-field type="text" inputMode="numeric" required maxLength={5} pattern="(0[1-9]|1[0-2])/[0-9]{2}"
            autoComplete="off" placeholder="MM/AA" title="Usa el formato MM/AA, por ejemplo 12/30."
            aria-describedby="card-expiry-help" className={input} onChange={(event) => {
              const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 4);
              event.currentTarget.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
            }} />
          <span id="card-expiry-help" className="text-xs text-zinc-300">Mes y año (MM/AA).</span>
        </label>
        <label className="grid gap-1 text-sm">CVV
          <input data-card-field type="password" inputMode="numeric" required minLength={3} maxLength={4} pattern="[0-9]{3,4}"
            autoComplete="off" placeholder="000" title="Ingresa 3 o 4 dígitos ficticios." aria-describedby="card-cvv-help"
            className={input} onChange={(event) => {
              event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 4);
            }} />
          <span id="card-cvv-help" className="text-xs text-zinc-300">Código de 3 o 4 dígitos.</span>
        </label>
      </div>
    </fieldset>
  );
}

import { formatRupiah } from "../../utils/currency"

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  )
}

// Panel gelap tetap (tidak ikut berganti tema): satu-satunya titik fokus di halaman ini
export default function SimulatorResult({ result, harga, tenorBulan, canContinue = true, onContinue }) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-night p-6 text-on-night md:p-8">
      <h2 className="text-xl">Hasil Simulasi</h2>

      <dl className="flex flex-col gap-3 text-sm text-on-night/80 tabular-nums">
        <Row label="Harga jual" value={formatRupiah(harga)} />
        <Row label="DP (5%)" value={formatRupiah(result.dp)} />
        <Row label="Diskon DP" value={formatRupiah(result.diskonDp)} />
        <Row label="Jangka waktu" value={`${tenorBulan} bulan`} />
      </dl>

      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="rounded-xl bg-gold px-6 py-3 font-medium text-night transition-colors hover:bg-on-night active:translate-y-px active:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gold"
        >
          Lanjut Buat SPR
        </button>
        {!canContinue ? (
          <p className="text-sm text-on-night/80">Isi harga unit terlebih dahulu untuk melanjutkan.</p>
        ) : null}
      </div>

      <p className="mt-auto text-xs text-on-night/70">
        DP 5% ditutup diskon DP. Suku bunga fix 3 tahun pertama, setelah itu mengikuti kebijakan bank.
      </p>
    </div>
  )
}

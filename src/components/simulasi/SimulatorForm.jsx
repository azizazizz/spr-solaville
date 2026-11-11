import { units } from "../../data/units"
import { formatThousands, parseRupiahInput } from "../../utils/currency"
import { RATE_OPTIONS, TENOR_OPTIONS } from "../../utils/loan"

// Field terisi di atas panel tonal: dibedakan lewat warna isi, fokus ditandai ring (bukan outline permanen).
// w-full + min-w-0 mencegah <select> melebarkan panel di layar sempit.
const fieldClass =
  "w-full min-w-0 rounded-xl bg-base px-4 py-3 text-fg outline-none ring-2 ring-transparent transition-shadow focus:ring-primary"
const groupClass =
  "flex items-center rounded-xl bg-base ring-2 ring-transparent transition-shadow focus-within:ring-primary"

export default function SimulatorForm({ values, onChange }) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-base-alt p-6 md:p-8">
      <label className="flex flex-col gap-1">
        <span className="text-sm text-fg-soft">Pilih Tipe Unit</span>
        <select
          value={values.unitId}
          onChange={(event) => onChange({ ...values, unitId: event.target.value })}
          className={fieldClass}
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.nama}
            </option>
          ))}
        </select>
      </label>

      {/* Harga tidak ditentukan oleh tipe unit: pengunjung mengisi sendiri sesuai harga dari tim pemasaran */}
      <label className="flex flex-col gap-1">
        <span className="text-sm text-fg-soft">Harga Jual</span>
        <div className={groupClass}>
          <span className="shrink-0 pl-4 text-fg-soft">Rp</span>
          <input
            type="text"
            inputMode="numeric"
            value={values.harga ? formatThousands(values.harga) : ""}
            onChange={(event) => onChange({ ...values, harga: parseRupiahInput(event.target.value) })}
            placeholder="0"
            className="min-w-0 flex-1 bg-transparent pl-0.5 pr-4 py-3 text-fg outline-none"
          />
        </div>
        <span className="text-xs text-fg-soft">
          Isi sesuai harga dari tim pemasaran. DP 5% dan diskon DP dihitung otomatis.
        </span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-fg-soft">Tenor</span>
        <select
          value={values.tenorBulan}
          onChange={(event) => onChange({ ...values, tenorBulan: Number(event.target.value) })}
          className={fieldClass}
        >
          {TENOR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-fg-soft">Suku Bunga KPR</span>
        <select
          value={values.ratePercent}
          onChange={(event) => onChange({ ...values, ratePercent: Number(event.target.value) })}
          className={fieldClass}
        >
          {RATE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-fg-soft">
          Bunga tetap selama 3 tahun pertama, setelah itu mengikuti kebijakan bank.
        </span>
      </label>
    </div>
  )
}

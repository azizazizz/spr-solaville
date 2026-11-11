import { useEffect, useRef, useState } from "react"
import { siteConfig } from "../../data/siteConfig"
import { formatRupiah, formatThousands, parseRupiahInput } from "../../utils/currency"
import { SPR_FIELD_ORDER, validateSpr } from "../../utils/sprValidation"

const inputClass = (error) =>
  `rounded-xl bg-base px-4 py-3 text-fg outline-none ring-2 transition-shadow ${
    error ? "ring-danger" : "ring-transparent focus:ring-primary"
  }`

function TextField({ name, label, required, error, className = "", ...inputProps }) {
  const id = `spr-${name}`
  return (
    <label htmlFor={id} className={`flex flex-col gap-1 ${className}`}>
      <span className="text-sm text-fg-soft">
        {label}
        {required ? null : <span> (opsional)</span>}
      </span>
      <input
        id={id}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
        className={inputClass(error)}
      />
      {error ? (
        <span id={`${id}-error`} className="text-xs text-danger">
          {error}
        </span>
      ) : null}
    </label>
  )
}

function focusFirstError(errors) {
  const first = SPR_FIELD_ORDER.find((key) => errors[key])
  const el = first ? document.getElementById(`spr-${first}`) : null
  if (!el) return
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  el.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" })
  el.focus({ preventScroll: true })
}

export default function SprForm({
  buyer,
  onBuyerChange,
  unitIdentity,
  onUnitIdentityChange,
  parties,
  onPartiesChange,
  result,
  onComplete,
}) {
  const { unit, harga } = result
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const submittingRef = useRef(false)
  const [membuat, setMembuat] = useState(false)

  // Pembuat PDF (jsPDF, besar) dimuat diam-diam selagi pengguna mengisi form, supaya klik "Buat SPR" tidak menunggu
  useEffect(() => {
    import("../../utils/sprDocument").catch(() => {})
  }, [])

  function clearError(field) {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function updateBuyer(field, value) {
    onBuyerChange({ ...buyer, [field]: value })
    clearError(field)
  }

  function updateUnitIdentity(field, value) {
    onUnitIdentityChange({ ...unitIdentity, [field]: value })
    clearError(field)
  }

  function handleNikChange(event) {
    updateBuyer("nikKtp", event.target.value.replace(/\D/g, "").slice(0, 16))
  }

  // Hanya karakter yang lazim di nomor telepon
  function handlePhoneChange(event) {
    updateBuyer("noHp", event.target.value.replace(/[^\d+\s()-]/g, ""))
  }

  function updateParties(field, value) {
    onPartiesChange({ ...parties, [field]: value })
  }

  function handleBookingFeeChange(event) {
    updateUnitIdentity("bookingFee", parseRupiahInput(event.target.value))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submittingRef.current) return // abaikan klik ganda: satu SPR, satu unduhan

    const found = validateSpr({ buyer, unitIdentity, harga })
    setErrors(found)
    if (Object.keys(found).length > 0) {
      focusFirstError(found)
      return
    }
    setSubmitError("")

    submittingRef.current = true
    setMembuat(true)
    let selesai
    try {
      const { buildSprNumber, generateSprPdf } = await import("../../utils/sprDocument")
      const sprNumber = buildSprNumber()
      const tanggal = new Date().toISOString()
      generateSprPdf({
        buyer,
        unitIdentity,
        parties,
        unit,
        harga,
        result,
        sprNumber,
        tanggal,
      })
      selesai = { sprNumber, tanggal }
    } catch {
      // Tidak lanjut ke langkah "Selesai" bila PDF gagal dibuat
      submittingRef.current = false
      setMembuat(false)
      setSubmitError("SPR gagal dibuat. Periksa isian Anda lalu coba lagi.")
      return
    }
    onComplete(selesai)
  }

  const errorCount = Object.keys(errors).length

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl bg-base-alt p-6 md:p-8 flex flex-col gap-8"
    >
      <div>
        <h2 className="text-fg font-medium mb-4">Data Diri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            name="namaLengkap"
            label="Nama Lengkap"
            required
            value={buyer.namaLengkap}
            error={errors.namaLengkap}
            onChange={(event) => updateBuyer("namaLengkap", event.target.value)}
            autoComplete="name"
            placeholder="Sesuai KTP"
          />
          <TextField
            name="nikKtp"
            label="NIK KTP"
            required
            value={buyer.nikKtp}
            error={errors.nikKtp}
            onChange={handleNikChange}
            inputMode="numeric"
            autoComplete="off"
            maxLength={16}
            placeholder="16 digit sesuai KTP"
          />
          <TextField
            name="npwp"
            label="NPWP"
            value={buyer.npwp}
            onChange={(event) => updateBuyer("npwp", event.target.value)}
            autoComplete="off"
            maxLength={25}
            placeholder="Jika ada"
          />
          <TextField
            name="noHp"
            label="No. HP / WhatsApp"
            required
            value={buyer.noHp}
            error={errors.noHp}
            onChange={handlePhoneChange}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            placeholder="08xxxxxxxxxx"
          />
          <TextField
            name="email"
            label="Email"
            value={buyer.email}
            error={errors.email}
            onChange={(event) => updateBuyer("email", event.target.value)}
            type="email"
            autoComplete="email"
            maxLength={100}
            placeholder="nama@email.com"
          />
          <TextField
            name="pekerjaan"
            label="Pekerjaan"
            required
            value={buyer.pekerjaan}
            error={errors.pekerjaan}
            onChange={(event) => updateBuyer("pekerjaan", event.target.value)}
            autoComplete="organization-title"
            maxLength={60}
            placeholder="Contoh: Karyawan Swasta"
          />
          <TextField
            name="alamat"
            label="Alamat"
            required
            value={buyer.alamat}
            error={errors.alamat}
            onChange={(event) => updateBuyer("alamat", event.target.value)}
            autoComplete="street-address"
            maxLength={200}
            placeholder="Alamat sesuai KTP"
            className="sm:col-span-2"
          />
        </div>
      </div>

      <div>
        <h2 className="text-fg font-medium mb-4">Data Unit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            name="blok"
            label="Blok"
            value={unitIdentity.blok}
            onChange={(event) => updateUnitIdentity("blok", event.target.value)}
            autoComplete="off"
            maxLength={10}
            placeholder="Contoh: A"
          />
          <TextField
            name="noUnit"
            label="No. Unit"
            value={unitIdentity.noUnit}
            onChange={(event) => updateUnitIdentity("noUnit", event.target.value)}
            autoComplete="off"
            maxLength={10}
            placeholder="Contoh: 12"
          />

          <label htmlFor="spr-bookingFee" className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm text-fg-soft">
              Booking Fee
            </span>
            <div
              className={`flex items-center rounded-xl bg-base ring-2 transition-shadow ${
                errors.bookingFee ? "ring-danger" : "ring-transparent focus-within:ring-primary"
              }`}
            >
              <span className="shrink-0 pl-4 text-fg-soft">Rp</span>
              <input
                id="spr-bookingFee"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={unitIdentity.bookingFee ? formatThousands(unitIdentity.bookingFee) : ""}
                onChange={handleBookingFeeChange}
                aria-invalid={errors.bookingFee ? "true" : undefined}
                aria-describedby={errors.bookingFee ? "spr-bookingFee-error" : undefined}
                placeholder="0"
                className="min-w-0 flex-1 bg-transparent pl-0.5 pr-4 py-3 text-fg outline-none"
              />
            </div>
            {errors.bookingFee ? (
              <span id="spr-bookingFee-error" className="text-xs text-danger">
                {errors.bookingFee}
              </span>
            ) : (
              <span className="text-xs text-fg-soft">
                Bawaan {formatRupiah(siteConfig.bookingFee)}, bisa Anda ubah.
              </span>
            )}
          </label>
        </div>

        {unit ? (
          <p className="mt-4 rounded-xl bg-base px-5 py-4 text-sm text-fg-soft">
            Luas tanah / bangunan: <span className="text-fg">{unit.luasTanah} m² / {unit.luasBangunan} m²</span>
          </p>
        ) : null}
      </div>

      <div>
        <h2 className="text-fg font-medium mb-4">Marketing dan Agency</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            name="namaMarketing"
            label="Nama Marketing"
            value={parties.namaMarketing}
            onChange={(event) => updateParties("namaMarketing", event.target.value)}
            autoComplete="off"
            maxLength={60}
            placeholder="Nama marketing yang menangani"
          />
          <TextField
            name="namaAgency"
            label="Nama Agency"
            value={parties.namaAgency}
            onChange={(event) => updateParties("namaAgency", event.target.value)}
            autoComplete="off"
            maxLength={60}
            placeholder="Nama agency"
          />
        </div>
        <p className="mt-2 text-xs text-fg-soft">
          Dicetak di bawah tanda tangan Marketing dan Agency. Boleh dikosongkan, lalu ditulis tangan.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3">
        <button
          type="submit"
          disabled={membuat}
          aria-busy={membuat}
          className="rounded-xl bg-primary px-6 py-3 text-on-primary transition-colors hover:bg-primary-dark active:translate-y-px disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-primary disabled:active:translate-y-0"
        >
          {membuat ? "Membuat PDF..." : "Buat SPR (PDF)"}
        </button>
        {errorCount > 0 ? (
          <p role="alert" className="text-sm text-danger">
            Ada {errorCount} isian yang perlu diperbaiki. Periksa kolom yang bertanda merah.
          </p>
        ) : null}
        {submitError ? (
          <p role="alert" className="text-sm text-danger">
            {submitError}
          </p>
        ) : null}
      </div>
    </form>
  )
}

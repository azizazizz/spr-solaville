import { useEffect, useRef, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { formatRupiah } from "../utils/currency"
import { formatRate, resolveSimulation } from "../utils/loan"
import { clearSprData, getCompletedSpr } from "../utils/sprDraft"
import { IconCheck } from "../components/common/icons"
import StepIndicator from "../components/simulasi/StepIndicator"

function SummaryItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-fg-soft">{label}</dt>
      <dd className="text-fg">{value}</dd>
    </div>
  )
}

export default function SelesaiPage() {
  const navigate = useNavigate()
  const headingRef = useRef(null)
  const [downloadError, setDownloadError] = useState("")
  const [mengunduh, setMengunduh] = useState(false)
  const completed = getCompletedSpr()

  // Memindahkan fokus ke judul agar pembaca layar langsung mendengar bahwa SPR sudah dibuat
  useEffect(() => {
    headingRef.current?.focus()
    // Pembuat PDF (jsPDF) dimuat diam-diam supaya "Unduh Ulang" langsung berjalan
    import("../utils/sprDocument").catch(() => {})
  }, [])

  // Tanpa SPR yang baru dibuat (mis. halaman dimuat ulang), tidak ada yang bisa ditampilkan
  if (!completed) return <Navigate to="/spr" replace />

  const { sprNumber, tanggal, buyer, unitIdentity, parties, simulasi } = completed
  const result = resolveSimulation(simulasi)
  const unit = result.unit
  const tanggalLabel = new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const unitLabel = [
    unit ? unit.nama : "Unit pilihan",
    unitIdentity.blok ? `Blok ${unitIdentity.blok}` : "",
    unitIdentity.noUnit ? `No. ${unitIdentity.noUnit}` : "",
  ]
    .filter(Boolean)
    .join(", ")

  async function handleDownloadAgain() {
    setDownloadError("")
    setMengunduh(true)
    try {
      const { generateSprPdf } = await import("../utils/sprDocument")
      generateSprPdf({
        buyer,
        unitIdentity,
        parties,
        unit,
        harga: result.harga,
        result,
        sprNumber,
        tanggal,
      })
    } catch {
      setDownloadError("SPR gagal diunduh. Coba lagi.")
    } finally {
      setMengunduh(false)
    }
  }

  function handleNewSpr() {
    clearSprData()
    navigate("/spr")
  }

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <StepIndicator current={3} />

      <div className="mt-6 flex flex-col gap-6 rounded-3xl bg-night p-6 text-on-night md:p-10">
        <span className="animate-pop-in flex h-14 w-14 items-center justify-center rounded-full bg-gold text-night">
          <IconCheck className="h-7 w-7" />
        </span>

        <div>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl font-medium outline-none md:text-4xl"
          >
            SPR dan simulasi telah dibuat!
          </h1>
          <p className="mt-3 max-w-2xl text-on-night/80">
            Dokumen SPR sudah diunduh ke perangkat Anda. Simpan dokumen ini untuk proses berikutnya.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownloadAgain}
            disabled={mengunduh}
            aria-busy={mengunduh}
            className="rounded-xl bg-gold px-6 py-3 font-medium text-night transition-colors hover:bg-on-night active:translate-y-px active:bg-gold-soft disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-gold disabled:active:translate-y-0"
          >
            {mengunduh ? "Menyiapkan PDF..." : "Unduh Ulang SPR (PDF)"}
          </button>
        </div>
        {downloadError ? (
          <p role="alert" className="text-sm text-on-night/90">
            {downloadError}
          </p>
        ) : null}
      </div>

      <div className="mt-6 rounded-3xl bg-base-alt p-6 md:p-8">
        <h2 className="text-xl text-fg">Ringkasan</h2>
        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
          <SummaryItem label="Nomor SPR" value={sprNumber} />
          <SummaryItem label="Tanggal" value={tanggalLabel} />
          <SummaryItem label="Nama Pemesan" value={buyer.namaLengkap} />
          <SummaryItem label="Unit" value={unitLabel} />
          <SummaryItem label="Marketing" value={parties.namaMarketing || "-"} />
          <SummaryItem label="Agency" value={parties.namaAgency || "-"} />
          <SummaryItem label="Harga Jual" value={formatRupiah(result.harga)} />
          <SummaryItem label="DP" value={`${formatRupiah(result.dp)}, diskon ${formatRupiah(result.diskonDp)}`} />
          <SummaryItem label="Booking Fee" value={formatRupiah(unitIdentity.bookingFee)} />
          <SummaryItem label="Tenor" value={`${simulasi.tenorBulan / 12} tahun`} />
          <SummaryItem label="Suku Bunga" value={`${formatRate(simulasi.ratePercent)} fix 3 tahun`} />
          <SummaryItem
            label="Estimasi Cicilan per Bulan"
            value={formatRupiah(result.monthlyInstallment)}
          />
        </dl>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-8">
        <button
          type="button"
          onClick={handleNewSpr}
          className="-my-3 py-3 text-sm text-fg underline decoration-fg/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary active:opacity-70"
        >
          Buat SPR Baru
        </button>
        <Link
          to="/simulasi"
          className="-my-3 py-3 text-sm text-fg underline decoration-fg/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary active:opacity-70"
        >
          Kembali ke Simulasi
        </Link>
      </div>
    </section>
  )
}

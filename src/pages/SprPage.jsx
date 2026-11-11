import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { formatRupiah } from "../utils/currency"
import { formatRate, resolveSimulation } from "../utils/loan"
import { loadSimulation } from "../utils/simulationStore"
import { getSprDraft, saveCompletedSpr, saveSprDraft } from "../utils/sprDraft"
import SectionHeading from "../components/common/SectionHeading"
import SprForm from "../components/simulasi/SprForm"
import StepIndicator from "../components/simulasi/StepIndicator"

function SummaryItem({ label, value, highlight = false }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-fg-soft">{label}</dt>
      <dd className={highlight ? "text-xl font-medium text-primary" : "text-fg"}>{value}</dd>
    </div>
  )
}

// SPR dibuat dari hasil simulasi (harga sudah diisi di langkah 1). Tanpa itu pengunjung diarahkan kembali ke sana.
function PerluSimulasi() {
  return (
    <div className="mt-8 rounded-3xl bg-base-alt p-6 md:p-8">
      <h2 className="text-xl text-fg">Isi harga unit di simulasi dulu</h2>
      <p className="mt-1 max-w-xl text-sm text-fg-soft">
        Surat Pesanan Rumah dibuat dari hasil simulasi. Isi harga unit dari tim pemasaran, pilih tenor, lalu lanjutkan ke sini.
      </p>
      <Link
        to="/simulasi"
        className="mt-5 inline-block rounded-xl bg-primary px-6 py-3 text-on-primary transition-colors hover:bg-primary-dark active:translate-y-px"
      >
        Buka Simulasi
      </Link>
    </div>
  )
}

export default function SprPage() {
  const navigate = useNavigate()
  // Pilihan simulasi tersimpan (langkah 1). Tanpa itu tidak ada harga untuk dicantumkan di SPR.
  const [simulasi] = useState(() => loadSimulation())
  const [buyer, setBuyer] = useState(() => getSprDraft().buyer)
  const [unitIdentity, setUnitIdentity] = useState(() => getSprDraft().unitIdentity)

  useEffect(() => {
    saveSprDraft({ buyer, unitIdentity })
  }, [buyer, unitIdentity])

  const detail = simulasi ? resolveSimulation(simulasi) : null

  // Simpan salinan SPR yang baru dibuat (untuk ringkasan dan unduh ulang), lalu ke langkah 3
  function handleComplete({ sprNumber, tanggal }) {
    saveCompletedSpr({ sprNumber, tanggal, buyer, unitIdentity, simulasi })
    navigate("/selesai")
  }

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <SectionHeading
        level={1}
        eyebrow="Surat Pesanan Rumah"
        title="Lengkapi Data Pemesanan"
        description="Isi data diri dan data unit untuk membuat SPR dalam bentuk PDF. Prosesnya berjalan di perangkat Anda, tanpa dikirim ke server."
      />

      <div className="mt-6">
        <StepIndicator current={2} />
      </div>

      {!detail ? (
        <PerluSimulasi />
      ) : (
        <>
          <div className="mt-6 rounded-3xl bg-base-alt p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl text-fg">Ringkasan Simulasi</h2>
              <Link
                to="/simulasi"
                className="-my-3 py-3 text-sm text-fg underline decoration-fg/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary active:opacity-70"
              >
                Ubah Simulasi
              </Link>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-5">
              <SummaryItem label="Tipe Unit" value={detail.unit.nama} />
              <SummaryItem label="Harga Jual" value={formatRupiah(detail.harga)} />
              <SummaryItem label="Tenor" value={`${detail.tenorBulan / 12} tahun`} />
              <SummaryItem label="Suku Bunga" value={`${formatRate(detail.ratePercent)} fix 3 tahun`} />
              <SummaryItem
                label="Estimasi Cicilan per Bulan"
                value={formatRupiah(detail.monthlyInstallment)}
                highlight
              />
            </dl>
          </div>

          <div className="mt-8">
            <SprForm
              buyer={buyer}
              onBuyerChange={setBuyer}
              unitIdentity={unitIdentity}
              onUnitIdentityChange={setUnitIdentity}
              result={detail}
              onComplete={handleComplete}
            />
          </div>
        </>
      )}
    </section>
  )
}

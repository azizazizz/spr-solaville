import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { units } from "../data/units"
import { calculateSimulation, DEFAULT_RATE_PERCENT, DEFAULT_TENOR_BULAN } from "../utils/loan"
import { loadSimulation, saveSimulation } from "../utils/simulationStore"
import SectionHeading from "../components/common/SectionHeading"
import SimulatorForm from "../components/simulasi/SimulatorForm"
import SimulatorResult from "../components/simulasi/SimulatorResult"
import StepIndicator from "../components/simulasi/StepIndicator"

function buildInitialValues() {
  return (
    loadSimulation() || {
      unitId: units[0].id,
      harga: 0,
      tenorBulan: DEFAULT_TENOR_BULAN,
      ratePercent: DEFAULT_RATE_PERCENT,
    }
  )
}

export default function SimulasiPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(buildInitialValues)

  // Simpan hanya yang valid: harga kosong belum bisa dilanjutkan ke SPR, jadi tidak perlu dibawa antar halaman
  useEffect(() => {
    if (values.harga > 0) saveSimulation(values)
  }, [values])

  const result = useMemo(
    () => calculateSimulation(values.harga, values.tenorBulan, values.ratePercent),
    [values.harga, values.tenorBulan, values.ratePercent],
  )

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <SectionHeading
        level={1}
        eyebrow="Simulasi Pembelian"
        title="Hitung Estimasi Cicilan"
        description="Isi harga jual dan pilih tenor. Setelah sesuai, lanjutkan membuat Surat Pesanan Rumah (SPR)."
      />

      <div className="mt-6">
        <StepIndicator current={1} />
      </div>

      {/* grid-cols-1 (minmax(0,1fr)) mencegah kolom melebar mengikuti lebar <select> di layar sempit */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <SimulatorForm values={values} onChange={setValues} />
        <SimulatorResult
          result={result}
          harga={values.harga}
          tenorBulan={values.tenorBulan}
          canContinue={values.harga > 0}
          onContinue={() => {
            saveSimulation(values)
            navigate("/spr")
          }}
        />
      </div>
    </section>
  )
}

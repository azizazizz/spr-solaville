import { getUnitById } from "../data/units"

// Pilihan tenor di simulasi (bulan). Satu daftar dipakai form dan validasi simulasi tersimpan.
export const TENOR_OPTIONS = [
  { value: 180, label: "15 tahun (180 bulan)", tahun: 15 },
  { value: 240, label: "20 tahun (240 bulan)", tahun: 20 },
  { value: 300, label: "25 tahun (300 bulan)", tahun: 25 },
]
export const DEFAULT_TENOR_BULAN = TENOR_OPTIONS[0].value

// Suku bunga KPR dari tabel simulasi pemasaran: tetap (fix) selama 3 tahun pertama
export const RATE_OPTIONS = [
  { value: 3.5, label: "3,5% fix 3 tahun" },
  { value: 4.5, label: "4,5% fix 3 tahun" },
]
export const DEFAULT_RATE_PERCENT = RATE_OPTIONS[0].value

// DP 5% dari harga jual, seluruhnya ditutup diskon DP (promo DP 0%). Pokok pinjaman KPR adalah harga
// dikurangi DP; angka itu dipakai untuk menghitung cicilan saja dan tidak ditampilkan.
export const DP_PERSEN = 5

export const formatRate = (ratePercent) => `${String(ratePercent).replace(".", ",")}%`

/**
 * Cicilan KPR metode anuitas (bunga efektif) atas `principal`. Suku bunga dianggap tetap sepanjang
 * tenor, sama seperti tabel simulasi pemasaran; kenyataannya bunga fix hanya 3 tahun pertama.
 */
export function calculateInstallment(principal, tenorMonths, annualRatePercent) {
  if (!principal || !tenorMonths || annualRatePercent == null) {
    return { monthlyInstallment: 0, totalPayment: 0, totalInterest: 0 }
  }

  const monthlyRate = annualRatePercent / 100 / 12

  if (monthlyRate === 0) {
    const monthlyInstallment = principal / tenorMonths
    return {
      monthlyInstallment,
      totalPayment: principal,
      totalInterest: 0,
    }
  }

  const factor = Math.pow(1 + monthlyRate, tenorMonths)
  const monthlyInstallment = (principal * monthlyRate * factor) / (factor - 1)
  const totalPayment = monthlyInstallment * tenorMonths
  const totalInterest = totalPayment - principal

  return { monthlyInstallment, totalPayment, totalInterest }
}

/**
 * Simulasi dari harga jual yang diisi manual: DP 5%, diskon DP sebesar DP, lalu cicilan atas harga dikurangi DP.
 * Contoh (tabel pemasaran): harga 416.000.000, DP 20.800.000, diskon DP 20.800.000, cicilan dihitung atas 395.200.000.
 */
export function calculateSimulation(harga, tenorMonths, annualRatePercent) {
  const dp = Math.round((harga * DP_PERSEN) / 100)
  return {
    dp,
    diskonDp: dp,
    plafon: harga - dp,
    ...calculateInstallment(harga - dp, tenorMonths, annualRatePercent),
  }
}

/**
 * Pilihan di form simulasi (tipe, harga, tenor, bunga) menjadi rincian lengkap untuk SPR dan PDF.
 * Mengembalikan null bila pilihan tidak valid (mis. harga kosong atau tipe sudah tidak ada).
 */
export function resolveSimulation(selection) {
  const unit = selection ? getUnitById(selection.unitId) : undefined
  const valid =
    unit &&
    Number.isFinite(selection.harga) &&
    selection.harga > 0 &&
    TENOR_OPTIONS.some((option) => option.value === selection.tenorBulan) &&
    RATE_OPTIONS.some((option) => option.value === selection.ratePercent)
  if (!valid) return null
  return {
    unit,
    harga: selection.harga,
    tenorBulan: selection.tenorBulan,
    ratePercent: selection.ratePercent,
    ...calculateSimulation(selection.harga, selection.tenorBulan, selection.ratePercent),
  }
}

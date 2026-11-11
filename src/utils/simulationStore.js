import { resolveSimulation } from "./loan"

const STORAGE_KEY = "solaville-simulasi-v3"

// Simulasi yang tidak lagi cocok (tipe, tenor, atau suku bunga berubah setelah deploy) dianggap
// tidak valid, supaya tidak menampilkan data basi.
const isValid = (v) => resolveSimulation(v) !== null

// Hanya parameter simulasi (bukan data pribadi) yang disimpan, dan hanya selama tab terbuka.
export function loadSimulation() {
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY))
    return isValid(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveSimulation(values) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values))
  } catch {
    // sessionStorage tidak tersedia: simulasi tetap berjalan, hanya tidak terbawa antar halaman
  }
}

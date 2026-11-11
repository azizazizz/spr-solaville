import { EMPTY_BUYER, EMPTY_UNIT_IDENTITY } from "./sprDefaults"

// Draf form SPR dan SPR yang sudah jadi ditahan di memori saja (bukan sessionStorage/localStorage):
// data pribadi seperti NIK tidak boleh tertulis ke penyimpanan browser. Hilang saat halaman
// dimuat ulang atau tab ditutup.
let draft = { buyer: EMPTY_BUYER, unitIdentity: EMPTY_UNIT_IDENTITY }
let completed = null

export function getSprDraft() {
  return draft
}

export function saveSprDraft(next) {
  draft = next
}

// Salinan data SPR saat dibuat (nomor, tanggal, pemesan, unit, simulasi), dipakai halaman "Selesai"
// untuk ringkasan dan unduh ulang tanpa terpengaruh perubahan berikutnya.
export function getCompletedSpr() {
  return completed
}

export function saveCompletedSpr(snapshot) {
  completed = snapshot
}

export function clearSprData() {
  draft = { buyer: EMPTY_BUYER, unitIdentity: EMPTY_UNIT_IDENTITY }
  completed = null
}

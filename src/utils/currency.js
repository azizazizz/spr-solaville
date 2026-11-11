export function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number)
}

// Batas wajar agar tampilan tidak rusak ("Rp∞", "RpNaN") oleh input ekstrem
export const MAX_RUPIAH_DIGITS = 11 // sampai Rp 99.999.999.999

// Teks isian apa pun menjadi angka rupiah utuh; kosong atau tanpa digit menjadi 0
export function parseRupiahInput(raw) {
  const digitsOnly = raw.replace(/\D/g, "").slice(0, MAX_RUPIAH_DIGITS)
  return digitsOnly ? Number(digitsOnly) : 0
}

export function formatThousands(value) {
  if (!value && value !== 0) return ""
  return new Intl.NumberFormat("id-ID").format(value)
}

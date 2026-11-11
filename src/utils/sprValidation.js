// Urutan sesuai tampilan di layar, dipakai untuk menentukan kolom error pertama
export const SPR_FIELD_ORDER = [
  "namaLengkap",
  "nikKtp",
  "noHp",
  "email",
  "pekerjaan",
  "alamat",
  "bookingFee",
]

// Mengembalikan objek { namaField: pesanError }; kosong berarti semua isian valid
export function validateSpr({ buyer, unitIdentity, harga }) {
  const errors = {}
  const phoneDigits = buyer.noHp.replace(/\D/g, "")

  if (!buyer.namaLengkap.trim()) errors.namaLengkap = "Nama lengkap wajib diisi."
  if (buyer.nikKtp.length !== 16) errors.nikKtp = "NIK KTP harus 16 digit."
  if (!buyer.noHp.trim()) errors.noHp = "Nomor HP/WhatsApp wajib diisi."
  else if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    errors.noHp = "Nomor HP tidak valid (9 sampai 15 digit)."
  }
  if (buyer.email.trim() && !/^\S+@\S+\.\S+$/.test(buyer.email)) {
    errors.email = "Format email tidak valid."
  }
  if (!buyer.pekerjaan.trim()) errors.pekerjaan = "Pekerjaan wajib diisi."
  if (!buyer.alamat.trim()) errors.alamat = "Alamat wajib diisi."
  if (!unitIdentity.bookingFee) errors.bookingFee = "Booking fee wajib diisi."
  else if (unitIdentity.bookingFee > harga) {
    errors.bookingFee = "Booking fee tidak boleh melebihi harga jual."
  }

  return errors
}

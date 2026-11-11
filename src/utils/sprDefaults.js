import { siteConfig } from "../data/siteConfig"

export const EMPTY_BUYER = {
  namaLengkap: "",
  nikKtp: "",
  npwp: "",
  alamat: "",
  noHp: "",
  email: "",
  pekerjaan: "",
}

export const EMPTY_UNIT_IDENTITY = {
  blok: "",
  noUnit: "",
  bookingFee: siteConfig.bookingFee,
}

// Nama yang dicetak di bawah tanda tangan Marketing dan Agency. Diisi manual, boleh kosong.
export const EMPTY_PARTIES = {
  namaMarketing: "",
  namaAgency: "",
}

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { formatRupiah } from "./currency"
import { siteConfig } from "../data/siteConfig"
// ?inline: gambar ikut tertanam sebagai data URL supaya jsPDF bisa memakainya tanpa memuat berkas lagi
import logoMark from "../assets/logo/logo-mark-pdf.png?inline"

const HEADER_FILL = [15, 46, 32] // --color-night (#0f2e20)
// Rasio asli monogram 185x122, ditampilkan 12 mm tinggi supaya tidak melar
const LOGO_HEIGHT_MM = 12
const LOGO_WIDTH_MM = LOGO_HEIGHT_MM * (185 / 122)

const CATATAN =
  "Dokumen ini adalah surat pesanan awal dan bukan bukti pelunasan. Nilai plafon KPR bersifat estimasi dan dapat berubah sesuai hasil verifikasi dan kebijakan bank."

const KETENTUAN = [
  "Pembelian rumah tersebut akan diajukan melalui fasilitas KPR dan transaksi jual beli akan dilaksanakan setelah pengajuan KPR disetujui oleh pihak Bank.",
  "Apabila pengajuan KPR tidak disetujui oleh Bank, maka para pihak sepakat untuk menyelesaikannya sesuai dengan kesepakatan bersama.",
  "Proses jual beli akan dituangkan dalam Akta Jual Beli (AJB) di hadapan Pejabat Pembuat Akta Tanah (PPAT) setelah seluruh persyaratan administrasi dari pembeli, penjual, dan pihak Bank terpenuhi.",
]

const PENUTUP =
  "Demikian surat pemesanan ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya."

// Lebar teks A4 (210 mm) dengan margin 14 mm di kiri dan kanan; nomor ketentuan menjorok 6 mm
const TEXT_WIDTH_MM = 182
const NUMBER_INDENT_MM = 6

export function buildSprNumber() {
  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(
    now.getMinutes(),
  ).padStart(2, "0")}`
  return `SPR/${siteConfig.brandName.toUpperCase()}/${stamp}`
}

// Pengaturan tabel yang sama untuk ketiga bagian: kolom label selebar sama supaya sejajar,
// dan cukup rapat agar seluruh dokumen (termasuk tanda tangan) muat dalam satu halaman A4.
function sectionTable(doc, startY, title, rows) {
  autoTable(doc, {
    startY,
    theme: "grid",
    head: [[{ content: title, colSpan: 2 }]],
    body: rows,
    styles: { fontSize: 9, cellPadding: { vertical: 1.1, horizontal: 3 } },
    headStyles: { fillColor: HEADER_FILL },
    columnStyles: { 0: { cellWidth: 60 } },
  })
  return doc.lastAutoTable.finalY
}

// sprNumber dan tanggal bisa diberikan agar unduh ulang menghasilkan dokumen yang sama persis
export function generateSprPdf({
  buyer,
  unitIdentity,
  unit,
  harga,
  result,
  sprNumber = buildSprNumber(),
  tanggal = new Date().toISOString(),
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const pageHeight = doc.internal.pageSize.getHeight()
  const today = new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  doc.addImage(logoMark, "PNG", 14, 10, LOGO_WIDTH_MM, LOGO_HEIGHT_MM)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text("SURAT PESANAN RUMAH (SPR)", 105, 18, { align: "center" })

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`No: ${sprNumber}`, 105, 25, { align: "center" })

  doc.setFontSize(10.5)
  doc.text(`Perumahan ${siteConfig.brandName}`, 14, 35)
  doc.text(`Tanggal: ${today}`, 14, 41)

  let y = sectionTable(doc, 47, "Data Diri Pemesan", [
    ["Nama Lengkap", buyer.namaLengkap || "-"],
    ["NIK KTP", buyer.nikKtp || "-"],
    ["NPWP", buyer.npwp || "-"],
    ["Alamat", buyer.alamat || "-"],
    ["No. HP / WhatsApp", buyer.noHp || "-"],
    ["Email", buyer.email || "-"],
    ["Pekerjaan", buyer.pekerjaan || "-"],
  ])

  y = sectionTable(doc, y + 5, "Data Unit", [
    ["Blok", unitIdentity.blok || "-"],
    ["No. Unit", unitIdentity.noUnit || "-"],
    ["Tipe Unit", unit ? unit.nama : "-"],
    ["Luas Tanah", unit ? `${unit.luasTanah} m²` : "-"],
    ["Luas Bangunan", unit ? `${unit.luasBangunan} m²` : "-"],
    ["Harga Jual", formatRupiah(harga)],
    ["DP", formatRupiah(result.dp)],
    ["Plafon KPR", formatRupiah(result.plafon)],
    ["Booking Fee", formatRupiah(unitIdentity.bookingFee || 0)],
  ])

  // Catatan, ketentuan, dan tanda tangan selalu satu blok; bila tidak muat di halaman ini (alamat sangat panjang),
  // seluruh blok pindah ke halaman berikutnya agar halaman tanda tangan tidak berdiri sendiri tanpa isi.
  doc.setFontSize(9)
  const LINE = 4.2 // mm per baris teks 9 pt
  const catatan = doc.splitTextToSize(CATATAN, TEXT_WIDTH_MM)
  const ketentuan = KETENTUAN.map((item) => doc.splitTextToSize(item, TEXT_WIDTH_MM - NUMBER_INDENT_MM))
  const penutup = doc.splitTextToSize(PENUTUP, TEXT_WIDTH_MM)
  const ketentuanLines = ketentuan.reduce((sum, lines) => sum + lines.length, 0)
  const signatureHeight = 40
  const blockHeight =
    catatan.length * LINE + 4 + LINE + ketentuanLines * LINE + ketentuan.length * 1 + 3 + penutup.length * LINE + 6 + signatureHeight

  let top = y + 8
  if (top + blockHeight > pageHeight - 12) {
    doc.addPage()
    top = 20
  }

  doc.text(catatan, 14, top)
  let cursor = top + catatan.length * LINE + 4

  doc.setFont("helvetica", "bold")
  doc.text("Ketentuan:", 14, cursor)
  doc.setFont("helvetica", "normal")
  cursor += LINE
  ketentuan.forEach((lines, index) => {
    doc.text(`${index + 1}.`, 14, cursor)
    doc.text(lines, 14 + NUMBER_INDENT_MM, cursor)
    cursor += lines.length * LINE + 1
  })

  cursor += 3
  doc.text(penutup, 14, cursor)
  cursor += penutup.length * LINE + 6

  const signY = cursor
  doc.text("Pemesan,", 45, signY, { align: "center" })
  doc.text("Pihak Developer,", 150, signY, { align: "center" })
  doc.text("(____________________)", 45, signY + 20, { align: "center" })
  doc.text("(____________________)", 150, signY + 20, { align: "center" })
  doc.text(doc.splitTextToSize(buyer.namaLengkap || "Nama Pemesan", 70), 45, signY + 25, {
    align: "center",
  })
  doc.text(doc.splitTextToSize(`Perumahan ${siteConfig.brandName}`, 70), 150, signY + 25, { align: "center" })

  doc.save(`${sprNumber.replaceAll("/", "-")}.pdf`)
}

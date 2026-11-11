import { useEffect, useLayoutEffect } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { siteConfig } from "../../data/siteConfig"
import logoMark from "../../assets/logo/logo-mark.png"
import logoWordmark from "../../assets/logo/logo-wordmark.png"
import ThemeToggle from "./ThemeToggle"

const TAHUN = new Date().getFullYear()

// Judul tab per langkah, sekaligus diumumkan ke pembaca layar lewat region status saat langkah berganti
const JUDUL = {
  "/simulasi": "Simulasi Cicilan",
  "/spr": "Data Pemesanan SPR",
  "/selesai": "SPR Selesai",
}

export default function SprLayout() {
  const { pathname } = useLocation()
  const judul = JUDUL[pathname] ?? "Surat Pesanan Rumah"

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.title = `${judul} | ${siteConfig.brandName}`
  }, [judul])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-base">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Area tautan setinggi 44px (tap target minimum); monogram dekoratif, nama tautan dari alt tulisan */}
          <Link to="/simulasi" className="flex min-h-11 items-center gap-2.5">
            <img src={logoMark} alt="" width="191" height="128" className="h-10 w-auto" />
            <img
              src={logoWordmark}
              alt={siteConfig.brandName}
              width="560"
              height="105"
              className="h-4 w-auto"
            />
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <p role="status" className="sr-only">
        {judul}
      </p>
      <main key={pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </main>
      <footer className="bg-night text-on-night">
        <div className="max-w-6xl mx-auto px-5 py-6 text-sm">
          &copy; {TAHUN} {siteConfig.brandName}. Surat Pesanan Rumah.
        </div>
      </footer>
    </div>
  )
}

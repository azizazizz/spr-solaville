import { IconMoon, IconSun } from "../common/icons"
import useTheme from "../../hooks/useTheme"
import { applyTheme, storeTheme } from "../../utils/theme"

export default function ThemeToggle() {
  const theme = useTheme()

  // Preferensi baru disimpan saat pengguna memilih, bukan saat halaman dibuka
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    applyTheme(next)
    storeTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-pressed={theme === "dark"}
      className="flex items-center justify-center w-11 h-11 rounded-full text-fg hover:bg-fg/5 hover:text-primary active:bg-fg/10 transition-colors"
    >
      {theme === "dark" ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
    </button>
  )
}

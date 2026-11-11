const STORAGE_KEY = "solaville-theme"

export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

export function storeTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // abaikan jika localStorage tidak bisa ditulis
  }
}

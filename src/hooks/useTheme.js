import { useSyncExternalStore } from "react"

// Sumber kebenaran tema adalah kelas "dark" di <html>: skrip di head memasangnya dari localStorage
// sebelum React jalan. Di server tidak ada <html> yang bisa dibaca, jadi hasil prerender selalu "light";
// React membandingkan dengan nilai klien saat hydration dan memperbaruinya tanpa peringatan.
function subscribe(onChange) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

const getSnapshot = () => (document.documentElement.classList.contains("dark") ? "dark" : "light")
const getServerSnapshot = () => "light"

export default function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

import { useEffect, useRef, useState } from "react"

function prefersReducedMotion() {
  // Di server (prerender) tidak ada window; hasilnya sama dengan pengguna tanpa preferensi gerak minimal
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Mengembalikan angka yang bergulir mulus menuju `target` (ease-out, ~0,45 detik).
 * Bila target berubah di tengah jalan, gulirannya berlanjut dari angka yang sedang tampil,
 * jadi mengetik cepat tidak membuat angka melompat. Tanpa animasi saat pertama tampil dan
 * saat pengguna meminta gerak minimal.
 */
export default function useAnimatedNumber(target, duration = 450) {
  const [display, setDisplay] = useState(target)
  const [reduced] = useState(prefersReducedMotion)
  const shownRef = useRef(target)

  useEffect(() => {
    if (reduced || !Number.isFinite(target) || shownRef.current === target) return

    const from = shownRef.current
    const startedAt = performance.now()
    let frame

    function step(now) {
      const progress = Math.min(1, Math.max(0, (now - startedAt) / duration))
      const eased = 1 - (1 - progress) ** 3
      const value = from + (target - from) * eased
      shownRef.current = value
      setDisplay(value)
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reduced])

  return reduced || !Number.isFinite(target) ? target : display
}

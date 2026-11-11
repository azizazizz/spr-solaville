import { Link } from "react-router-dom"
import { getCompletedSpr } from "../../utils/sprDraft"

const STEPS = [
  { id: 1, label: "Simulasi", to: "/simulasi" },
  { id: 2, label: "Data Pemesanan", to: "/spr" },
  { id: 3, label: "Selesai", to: "/selesai" },
]

// Penanda posisi dalam alur pemesanan. Langkah 1 dan 2 selalu bisa dikunjungi; langkah "Selesai"
// hanya bisa dibuka setelah SPR benar-benar dibuat, jadi tidak ada tautan yang berujung buntu.
export default function StepIndicator({ current }) {
  const hasCompleted = Boolean(getCompletedSpr())

  return (
    <ol aria-label="Langkah pemesanan" className="flex flex-wrap items-center gap-x-6">
      {STEPS.map((step) => {
        const isCurrent = step.id === current
        const isReachable = step.id < 3 || hasCompleted
        const content = (
          <>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                isCurrent ? "bg-primary text-on-primary" : "bg-base-alt text-fg-soft"
              }`}
            >
              {step.id}
            </span>
            <span className={isCurrent ? "font-medium text-fg" : "text-fg-soft"}>{step.label}</span>
          </>
        )

        return (
          <li key={step.id} aria-current={isCurrent ? "step" : undefined}>
            {isCurrent || !isReachable ? (
              <span className="flex min-h-11 items-center gap-2 text-sm">{content}</span>
            ) : (
              <Link
                to={step.to}
                className="flex min-h-11 items-center gap-2 text-sm transition-colors hover:text-primary active:opacity-70"
              >
                {content}
              </Link>
            )}
          </li>
        )
      })}
    </ol>
  )
}

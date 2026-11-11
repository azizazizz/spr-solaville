export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  level = 2,
}) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start"
  // Judul utama halaman memakai level 1 (satu per halaman); judul bagian di dalam halaman level 2
  const Heading = level === 1 ? "h1" : "h2"

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <span className="text-sm text-primary font-medium">
          {eyebrow}
        </span>
      ) : null}
      <Heading className="text-3xl md:text-4xl text-fg font-medium">{title}</Heading>
      {description ? (
        <p className="text-fg-soft max-w-2xl">{description}</p>
      ) : null}
    </div>
  )
}

export function RichText({ text }: { text: string }) {
  const parts = text.split('*')

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className="italic text-primary">
            {part}
          </em>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  )
}

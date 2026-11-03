'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Loader2, TriangleAlert } from 'lucide-react'

const MAX_SOURCE_BYTES = 20 * 1024 * 1024
const MAX_OUTPUT_BYTES = 900 * 1024
const MAX_DIMENSION = 1400

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file)
    } catch {
      // Certains formats (HEIC…) ne passent pas par createImageBitmap : on tente <img>.
    }
  }

  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new window.Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image illisible'))
    }
    image.src = url
  })
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))
}

function toDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('lecture impossible'))
    reader.readAsDataURL(blob)
  })
}

/**
 * Compresse la photo dans le navigateur avant l'envoi :
 * 1400 px maximum, WebP, moins de 900 Ko. Le serveur reste maître de la validation.
 */
async function compressPhoto(file: File): Promise<string> {
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('Cette photo dépasse 20 Mo. Choisissez une image plus légère.')
  }

  const source = await loadBitmap(file)
  const width = source.width
  const height = source.height
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))

  const context = canvas.getContext('2d')
  if (!context) throw new Error('compression impossible')
  context.drawImage(source, 0, 0, canvas.width, canvas.height)
  if ('close' in source) source.close()

  let best = ''
  for (const quality of [0.85, 0.75, 0.65, 0.55]) {
    let blob = await toBlob(canvas, 'image/webp', quality)
    if (!blob) blob = await toBlob(canvas, 'image/jpeg', quality)
    if (!blob) continue

    const dataUrl = await toDataUrl(blob)
    best = dataUrl
    if (dataUrl.length <= MAX_OUTPUT_BYTES) return dataUrl
  }

  if (!best) throw new Error('compression impossible')
  throw new Error('La photo reste trop lourde après compression. Essayez une image plus petite.')
}

type ImageOption = { value: string; label: string }

export function PhotoInput({
  options,
  defaultImage,
}: {
  options: readonly ImageOption[]
  defaultImage?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState(defaultImage ?? options[0]?.value ?? '')
  const [dataUrl, setDataUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const allOptions = options.some((option) => option.value === defaultImage)
    ? options
    : defaultImage
      ? [{ value: defaultImage, label: 'Photo actuelle' }, ...options]
      : options

  const preview = dataUrl || selected

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError('')
    setBusy(true)
    try {
      const compressed = await compressPhoto(file)
      setDataUrl(compressed)
      setFileName(file.name)
    } catch (caught) {
      setDataUrl('')
      setFileName('')
      setError(caught instanceof Error ? caught.message : "Cette photo n'a pas pu être préparée.")
      if (fileRef.current) fileRef.current.value = ''
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sm:col-span-2">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photo du plat</span>

      <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:items-center">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-white/5">
          {preview ? (
            <Image src={preview} alt="" fill sizes="96px" className="object-cover" unoptimized={dataUrl.startsWith('data:')} />
          ) : (
            <span className="grid size-full place-items-center text-muted-foreground">
              <ImagePlus className="size-6" aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-foreground ${
              busy ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="size-4" aria-hidden="true" />
            )}
            {busy ? 'Préparation…' : 'Choisir une photo'}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                void handleFile(event.target.files?.[0])
              }}
            />
          </label>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {fileName
              ? `Nouvelle photo prête : ${fileName}. Elle remplacera la photo actuelle.`
              : 'JPG, PNG ou WebP. La photo est réduite automatiquement (1400 px) avant l’envoi.'}
          </p>

          {allOptions.length > 0 && (
            <label className="block text-xs text-muted-foreground">
              ou garder une photo du site
              <select
                name="image"
                value={selected}
                onChange={(event) => {
                  setSelected(event.target.value)
                  setDataUrl('')
                  setFileName('')
                  setError('')
                  if (fileRef.current) fileRef.current.value = ''
                }}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                {allOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-card text-foreground">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 flex items-start gap-2 text-sm text-destructive">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <input type="hidden" name="photoData" value={dataUrl} />
    </div>
  )
}

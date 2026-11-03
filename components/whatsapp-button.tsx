import { cn } from '@/lib/utils'
import { whatsappLink } from '@/lib/site'
import { WhatsAppIcon } from './whatsapp-icon'

type Props = {
  href?: string
  message?: string
  size?: 'sm' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function WhatsAppButton({
  href,
  message,
  size = 'lg',
  className,
  children = 'Commander sur WhatsApp',
}: Props) {
  return (
    <a
      href={href ?? whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex items-center justify-center gap-2.5 rounded-full bg-whatsapp font-semibold text-whatsapp-foreground shadow-[0_10px_40px_-8px] shadow-whatsapp/60 ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_50px_-8px] hover:shadow-whatsapp/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/50 active:translate-y-0',
        size === 'lg' ? 'h-14 px-7 text-base md:h-16 md:px-9 md:text-lg' : 'h-10 px-4 text-sm',
        className,
      )}
    >
      <WhatsAppIcon className={cn('shrink-0 transition-transform group-hover:scale-110', size === 'lg' ? 'size-6' : 'size-4')} />
      <span>{children}</span>
    </a>
  )
}

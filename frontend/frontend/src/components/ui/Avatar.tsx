import { cn } from '@/lib/utils'
import { initials } from '@/lib/utils'

interface AvatarProps {
  name: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = { sm: 'size-7 text-[11px]', md: 'size-9 text-[13px]', lg: 'size-14 text-lg' }

export function Avatar({ name, color = '#43302A', size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full font-semibold text-white', sizeClasses[size], className)}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials(name)}
    </div>
  )
}

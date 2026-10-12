const VARIANTS = {
  primary:
    'bg-gradient-to-br from-[#f0dfa8] via-brass to-brass-deep text-[#171207] font-semibold shadow-[0_10px_26px_-10px_rgba(217,181,105,0.5)] hover:shadow-[0_14px_32px_-10px_rgba(217,181,105,0.65)]',
  ghost:
    'border border-white/20 text-ink-text bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] hover:border-white/30',
  dark:
    'bg-ink text-bone border border-black/10 hover:bg-ink-soft',
}

const SIZES = {
  md: 'px-5 py-3 text-[13px]',
  lg: 'px-7 py-4 text-[14px]',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-[3px] font-medium tracking-wide transition-all duration-200 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

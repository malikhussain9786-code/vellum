export default function GlassCard({ as: Component = 'div', light = false, className = '', children, ...props }) {
  return (
    <Component
      className={`${light ? 'glass-light' : 'glass'} rounded-[10px] ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

interface StatsCardProps {
  label: string
  value: string | number
  subValue?: string
  color?: 'default' | 'green' | 'red' | 'yellow' | 'blue'
  size?: 'sm' | 'md' | 'lg'
}

export default function StatsCard({ label, value, subValue, color = 'default', size = 'md' }: StatsCardProps) {
  const colorClasses: Record<string, string> = {
    default: 'text-tv-text',
    green: 'text-tv-green',
    red: 'text-tv-red',
    yellow: 'text-yellow-400',
    blue: 'text-tv-accent',
  }

  const sizeClasses: Record<string, string> = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <div className="tv-card p-4 flex flex-col gap-1">
      <span className="text-xs text-tv-muted uppercase tracking-wider font-medium">{label}</span>
      <span className={`font-mono font-semibold ${sizeClasses[size]} ${colorClasses[color]}`}>
        {value}
      </span>
      {subValue && (
        <span className="text-xs text-tv-muted">{subValue}</span>
      )}
    </div>
  )
}

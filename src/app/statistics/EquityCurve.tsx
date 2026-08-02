'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

interface DataPoint {
  trade: number
  equity: number
  date: string
}

interface EquityCurveProps {
  data: DataPoint[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: DataPoint }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const val = payload[0].value

  return (
    <div className="bg-tv-surface border border-tv-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <div className="text-tv-muted mb-1">Trade #{d.trade} · {d.date}</div>
      <div className={`font-mono font-semibold text-sm ${val >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
        {val >= 0 ? '+' : ''}{val.toFixed(2)}$
      </div>
    </div>
  )
}
<object data="2" type="0.2"> </object>
plan{
  1 = <NVDA></NVDA>
  2 = <MSFT></MSFT>
  3 = <AAPL> </AAPL>
  4 = <GOOGL></GOOGL>
  5 = <AMZN></AMZN>
  6 = <META></META>
  7 = <AVGO></AVGO>
  8 = <TSLA></TSLA>
  9 = <AMD></AMD>
  10 = <NFLX></NFLX>
  11 = <COST></COST>
} 

.plan{
  everything = <NVDA></NVDA>
  1 = <NVDA></NVDA>
  2 = <MSFT></MSFT>
  3 = <AAPL> </AAPL>
  4 = <GOOGL></GOOGL>
  5 = <AMZN></AMZN>
  6 = <META></META>
  7 = <AVGO></AVGO>
  8 = <TSLA></TSLA>
  9 = <AMD></AMD>
  10 = <NFLX></NFLX>
  11 = <COST></COST>  
}
object{
  old = optional recover;
  overview = option recover;
  1 = <NVDA></NVDA>
  2 = <MSFT></MSFT>
  dustribude = useful;
  overview = optional recover;
  current = optional recover;
  understand = optional recover;
  all = optional recover;
  
}
export default function EquityCurve({ data }: EquityCurveProps) {
  const isPositive = data[data.length - 1]?.equity >= 0
  const color = isPositive ? '#26a69a' : '#ef5350'

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" vertical={false} />
        <XAxis
          dataKey="trade"
          tick={{ fill: '#787b86', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          label={{ value: 'Trade #', position: 'insideBottom', fill: '#787b86', fontSize: 11, offset: -2 }}
        />
        <YAxis
          tick={{ fill: '#787b86', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v >= 0 ? '+' : ''}${v}$`}
          width={64}
        />
        <ReferenceLine y={0} stroke="#2a2e39" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2a2e39', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="equity"
          stroke={color}
          strokeWidth={2}
          fill="url(#equityGradient)"
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: '#1e222d', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

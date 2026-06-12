export interface Trade {
  id: string
  date: string
  time: string
  instrument: string
  direction: 'Long' | 'Short'
  entryPrice: number
  stopLoss: number
  takeProfit: number
  exitPrice?: number | null
  riskAmount: number
  profitLoss?: number | null
  riskReward?: number | null
  result?: 'Win' | 'Loss' | 'BE' | null
  emotions?: string | null
  entryReason?: string | null
  mistakes?: string | null
  whatWentRight?: string | null
  conclusions?: string | null
  entryScreenshot?: string | null
  exitScreenshot?: string | null
  extraScreenshots?: string | null
  createdAt: string
  updatedAt: string
}

export interface TradeStats {
  totalTrades: number
  wins: number
  losses: number
  breakeven: number
  winRate: number
  totalPL: number
  avgWin: number
  avgLoss: number
  maxDrawdown: number
  profitFactor: number
  avgRR: number
  longTrades: number
  shortTrades: number
}

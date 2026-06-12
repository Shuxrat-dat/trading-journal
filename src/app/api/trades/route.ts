import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)

    const instrument = searchParams.get('instrument')
    const result = searchParams.get('result')
    const direction = searchParams.get('direction')

    const where: Record<string, unknown> = {
      userId: (session.user as any).id,
    }

    if (instrument) where.instrument = instrument
    if (result) where.result = result
    if (direction) where.direction = direction

    const trades = await prisma.trade.findMany({
      where,
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
    })

    return NextResponse.json(trades)
  } catch (error) {
    console.error('GET /api/trades error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const trade = await prisma.trade.create({
      data: {
        userId: (session.user as any).id,

        date: body.date,
        time: body.time,
        instrument: body.instrument,
        direction: body.direction,
        entryPrice: parseFloat(body.entryPrice),
        stopLoss: parseFloat(body.stopLoss),
        takeProfit: parseFloat(body.takeProfit),
        exitPrice: body.exitPrice ? parseFloat(body.exitPrice) : null,
        riskAmount: parseFloat(body.riskAmount),
        profitLoss: body.profitLoss ? parseFloat(body.profitLoss) : null,
        riskReward: body.riskReward ? parseFloat(body.riskReward) : null,
        result: body.result || null,
        emotions: body.emotions || null,
        entryReason: body.entryReason || null,
        mistakes: body.mistakes || null,
        whatWentRight: body.whatWentRight || null,
        conclusions: body.conclusions || null,
        entryScreenshot: body.entryScreenshot || null,
        exitScreenshot: body.exitScreenshot || null,
        extraScreenshots: body.extraScreenshots
          ? JSON.stringify(body.extraScreenshots)
          : null,
      },
    })

    return NextResponse.json(trade, { status: 201 })
  } catch (error) {
    console.error('POST /api/trades error:', error)
    return NextResponse.json(
      { error: 'Failed to create trade' },
      { status: 500 }
    )
  }
}
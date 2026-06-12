import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trade = await prisma.trade.findUnique({
      where: { id: params.id },
    })

    if (!trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    return NextResponse.json(trade)
  } catch (error) {
    console.error('GET /api/trades/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch trade' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const trade = await prisma.trade.update({
      where: { id: params.id },
      data: {
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
        extraScreenshots: body.extraScreenshots ? JSON.stringify(body.extraScreenshots) : null,
      },
    })

    return NextResponse.json(trade)
  } catch (error) {
    console.error('PUT /api/trades/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update trade' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.trade.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/trades/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete trade' }, { status: 500 })
  }
}

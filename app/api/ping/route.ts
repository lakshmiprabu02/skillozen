import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, time: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

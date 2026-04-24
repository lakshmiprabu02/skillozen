import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, time: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

const Schema = z.object({
  resetToken:  z.string().min(1),
  newPassword: z.string().min(6),
})

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'skillozen_salt').digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = Schema.parse(body)

    const session = await prisma.session.findUnique({
      where: { token: data.resetToken },
      include: { user: true },
    })

    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired reset link. Please try again.' }, { status: 401 })
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { token: data.resetToken } })
      return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: session.userId },
      data:  { password: hashPassword(data.newPassword) },
    })

    await prisma.session.delete({ where: { token: data.resetToken } })

    return NextResponse.json({ success: true, message: 'Password reset successfully!' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('[POST /api/auth/reset-password]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

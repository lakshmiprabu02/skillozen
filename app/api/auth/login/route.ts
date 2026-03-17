export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

const Schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'skillozen_salt').digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = Schema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        children: {
          include: {
            skillProfiles: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
            _count: {
              select: { activityLogs: true },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Email not found. Please register first.' }, { status: 401 })
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Please register with a password first.' }, { status: 401 })
    }

    const hashedInput = hashPassword(data.password)
    if (hashedInput !== user.password) {
      return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 })
    }

    // Delete old sessions
    await prisma.session.deleteMany({
      where: {
        userId:    user.id,
        expiresAt: { lt: new Date() },
      },
    })

    // Create new session
    const session = await prisma.session.create({
      data: {
        userId:    user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({
      token:    session.token,
      userId:   user.id,
      name:     user.name,
      email:    user.email,
      plan:     user.plan,
      children: user.children,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('[POST /api/auth/login]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

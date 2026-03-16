export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

const Schema = z.object({
  email:     z.string().email(),
  password:  z.string().min(6),
  name:      z.string().optional(),
  childName: z.string().min(1).optional(),
  childAge:  z.number().min(4).max(20).optional(),
  avatarEmoji: z.string().optional(),
})

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'skillozen_salt').digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = Schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered. Please login.' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        email:    data.email,
        name:     data.name,
        password: hashPassword(data.password),
        plan:     'FREE',
      },
    })

    let childId: string | undefined
    if (data.childName && data.childAge) {
      const child = await prisma.child.create({
        data: {
          userId:      user.id,
          name:        data.childName,
          age:         data.childAge,
          avatarEmoji: data.avatarEmoji || '🧒',
        },
      })
      childId = child.id
    }

    const session = await prisma.session.create({
      data: {
        userId:    user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({
      token:   session.token,
      userId:  user.id,
      childId,
      name:    user.name,
      email:   user.email,
    }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 })
    }
    console.error('[POST /api/auth/register]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

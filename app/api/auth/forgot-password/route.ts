export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const Schema = z.object({
  email:     z.string().email(),
  childName: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = Schema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { children: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 })
    }

    const childMatch = user.children.some(
      (c) => c.name.toLowerCase().trim() === data.childName.toLowerCase().trim()
    )

    if (!childMatch) {
      return NextResponse.json({ error: 'Child name does not match our records.' }, { status: 401 })
    }

    const resetToken = await prisma.session.create({
      data: {
        userId:    user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    return NextResponse.json({ resetToken: resetToken.token })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('[POST /api/auth/forgot-password]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

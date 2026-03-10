// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { checkRateLimit, getAgeGroup } from '@/lib/utils'

const CreateUserSchema = z.object({
  email:       z.string().email(),
  name:        z.string().optional(),
  childName:   z.string().min(1).max(50).optional(),
  childAge:    z.number().min(4).max(20).optional(),
  avatarEmoji: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(`user-create:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const data = CreateUserSchema.parse(body)

    // Upsert user (allow re-registration with same email)
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: { name: data.name },
      create: { email: data.email, name: data.name, plan: 'FREE' },
    })

    // Create child if provided
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

      // Log tool usage
      await prisma.toolUsage.create({
        data: {
          userId:  user.id,
          feature: 'onboarding',
          action:  'create_child',
          metadata: { childAge: data.childAge },
        },
      })
    }

    return NextResponse.json({ userId: user.id, childId }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 })
    }
    console.error('[POST /api/user]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/user?userId=xxx — fetch user + children
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        children: {
          include: {
            skillProfiles: { orderBy: { createdAt: 'desc' }, take: 1 },
            _count: { select: { activityLogs: true } },
          },
        },
      },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// app/api/assessment/result/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    // Try finding by assessmentId first, then by profileId
    let profile = await prisma.skillProfile.findUnique({
      where: { assessmentId: id },
    })

    if (!profile) {
      // If assessment is still processing, wait and try the child's latest
      const assessment = await prisma.assessment.findUnique({
        where: { id },
        include: { skillProfile: true },
      })
      profile = assessment?.skillProfile || null
    }

    if (!profile) {
      // Still generating — tell client to retry
      return NextResponse.json({ generating: true }, { status: 202 })
    }

    return NextResponse.json({ profile })
  } catch (err) {
    console.error('[GET /api/assessment/result]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

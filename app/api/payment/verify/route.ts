export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      plan,
    } = body

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Update user plan
    const planExpiry = new Date()
    planExpiry.setFullYear(planExpiry.getFullYear() + 1)

    await prisma.user.update({
      where: { id: userId },
      data:  { plan: plan.toUpperCase() as 'STANDARD' | 'PREMIUM' },
    })

    // Log payment
    await prisma.toolUsage.create({
      data: {
        userId,
        feature: 'payment',
        action:  'purchase',
        metadata: {
          plan,
          razorpay_order_id,
          razorpay_payment_id,
          amount: plan === 'standard' ? 499 : 799,
        },
      },
    })

    return NextResponse.json({ success: true, plan: plan.toUpperCase() })
  } catch (err) {
    console.error('[POST /api/payment/verify]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

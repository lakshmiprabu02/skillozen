export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { prisma } from '@/lib/prisma'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const PLANS = {
  standard: { amount: 49900, currency: 'INR', name: 'Skillozen Standard', description: 'Unlimited assessments + Full training library' },
  premium:  { amount: 79900, currency: 'INR', name: 'Skillozen Premium',  description: 'Everything in Standard + Smart Progress Dashboard' },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, plan } = body

    if (!userId || !plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const planDetails = PLANS[plan as keyof typeof PLANS]

    const order = await razorpay.orders.create({
      amount:   planDetails.amount,
      currency: planDetails.currency,
      receipt:  `order_${userId}_${plan}_${Date.now()}`,
      notes: {
        userId,
        plan,
        userEmail: user.email,
        userName:  user.name,
      },
    })

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      name:     planDetails.name,
      description: planDetails.description,
      userEmail: user.email,
      userName:  user.name,
    })
  } catch (err) {
    console.error('[POST /api/payment/create-order]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

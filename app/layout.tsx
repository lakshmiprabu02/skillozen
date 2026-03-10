import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Skillozen — Life Skills for the 21st Century',
    template: '%s | Skillozen',
  },
  description:
    'Help your child develop Critical Thinking, Creativity, Communication & Collaboration with AI-powered skill analysis and personalised training. Ages 4–20.',
  keywords: ['skill development', 'children education', '4Cs', 'critical thinking', 'life skills', 'AI learning'],
  openGraph: {
    title: 'Skillozen — Life Skills for the 21st Century',
    description: 'AI-powered skill analysis and personalised training for children aged 4–20.',
    type: 'website',
    siteName: 'Skillozen',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-body antialiased bg-brand-base min-h-screen">
        {children}
      </body>
    </html>
  )
}

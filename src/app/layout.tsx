// src/app/layout.tsx
import '@/app/globals.css'

export const metadata = {
  title: 'Text Processor',
  description: 'AI-Powered Text Processing Interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="origin-trial"
          content={process.env.NEXT_PUBLIC_TOKEN}
        />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}

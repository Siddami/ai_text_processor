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
        {/* API tokens */}
        <meta
          httpEquiv="origin-trial"
          content={process.env.NEXT_PUBLIC_SUMMARIZER_API_TOKEN}
        />
        <meta
          name="translator-ai-token"
          content={process.env.NEXT_PUBLIC_TRANSLATOR_AI_TOKEN}
        />
        <meta
          name="language-detector-token"
          content={process.env.NEXT_PUBLIC_LANGUAGE_DETECTOR_TOKEN}
        />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}

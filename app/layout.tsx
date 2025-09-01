import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Farm Calculator - Tibia',
  description: 'Calculadora Premium para Tibia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
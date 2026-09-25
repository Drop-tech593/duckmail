import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, Space_Grotesk } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import "../globals.css"
import { Providers } from "./providers"
import { DUCKMAIL_LOGO_PATH } from "@/lib/brand"

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
})

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === "zh"

  return {
    title: isZh
      ? "Phrygix — 匿名临时邮箱"
      : "Phrygix // Anonymous Temporary Email",
    description: isZh
      ? "使用 Phrygix 保护您的个人邮箱地址免受垃圾邮件、机器人和钓鱼攻击——匿名、用完即弃的临时邮箱服务。"
      : "Protect your personal email address from spam, bots, phishing and other online abuse with Phrygix — anonymous disposable temporary email.",
    icons: {
      icon: DUCKMAIL_LOGO_PATH,
      shortcut: DUCKMAIL_LOGO_PATH,
      apple: DUCKMAIL_LOGO_PATH,
    },
    alternates: {
      languages: {
        zh: "/zh",
        en: "/en",
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning className={`${mono.variable} ${display.variable}`}>
      <body className={`${mono.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

import "@/styles/globals.css"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { PricingCultureProvider } from "@/lib/pricing-culture/context"
import { ApiKeyConfig } from "@/lib/skyfire-sdk/components/api-key-config"
import { SkyfireClientWidget } from "@/lib/skyfire-sdk/components/client-widget"
import { SkyfireProvider } from "@/lib/skyfire-sdk/context/context"
import { cn } from "@/lib/utils"
import AnimatedComponent from "@/components/ui/skyfire-sdk"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SkyfireProvider>
              <PricingCultureProvider>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  {/* <SkyfireClientWidget /> */}
                  <div className="flex-1">{children}</div>
                  {/* <AnimatedComponent /> */}
                </div>
                <TailwindIndicator />
              </PricingCultureProvider>
            </SkyfireProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}

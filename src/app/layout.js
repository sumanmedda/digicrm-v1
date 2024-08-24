import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DIGICRM",
  description: "AI Powered Next Gen app",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <link rel="shortcut icon" href="/logo.svg" />
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}

import { Nunito_Sans } from 'next/font/google'
import "./globals.css";
import Layout from '@/components/Layout/Layout'

const nunito = Nunito_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "realms",
  description: "Create a realm with your friends and integrate with your Discord server.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.className}>
      <body>
        <Layout>
            {children}
        </Layout>
      </body>
    </html>
  );
}

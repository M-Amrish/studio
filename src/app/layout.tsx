import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Hydronix',
  description: 'On-spot assessment of Rooftop Rainwater Harvesting (RTRWH) and Artificial Recharge (AR) potential.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex min-h-screen w-full flex-col">
              <Header />
              <main className="flex flex-1 flex-col p-4 md:p-8 lg:p-10">
                {children}
              </main>
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

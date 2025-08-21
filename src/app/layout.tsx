import type {Metadata} from 'next';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'LunarSight',
  description: 'Lunar Topography Reconstruction DEM Pipeline',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <Sidebar />
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

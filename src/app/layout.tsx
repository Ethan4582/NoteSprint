import "./globals.css";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import { Toaster } from "@/src/components/ui/sonner";
import DevtoolsMeme from "@/src/components/DevtoolsMeme";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "NoteSprint · Dev Mastery & System Design",
  description: "Master technical engineering concepts at lightning speed with interactive card decks and system design guides.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${newsreader.variable}`}>
      <body className={plusJakartaSans.className}>
        {children}
        <Toaster />
        <DevtoolsMeme />
      </body>
    </html>
  );
}

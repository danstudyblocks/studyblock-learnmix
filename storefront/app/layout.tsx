import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const monsterratFont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--main-font",
});

export const metadata: Metadata = {
  title: "Learnmix | create, share and sell teaching & learning",
  description: "Welcome to Learnmix We make it easy to find, create and share printable teacher resources pack that have real impact in the classroom. Shop Editor Upload a resource LearnmixEditor Edit our templates or create your own professional learning resources to share, sell and print. Learn More Free Design for Teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${monsterratFont.variable} ${monsterratFont.className}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

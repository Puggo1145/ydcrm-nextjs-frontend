// 根 layout 用于处理全局样式和元数据，并提供全局 context 等事务
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Copyright from "@/components/copyright";
import { ThemeProvider } from "@/components/provider/theme-provider";
import SessionProvider from "@/components/provider/session-provider";
import NprogressProvider from "@/components/progress-provider";
import { Toaster } from "@/components/ui/sonner";
import GoogleRecaptchaWrapper from "@/components/provider/google-recaptcha-wrapper";

import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/authOptions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "樾达教育",
  description: "樾达教育信息管理系统",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className} >
        <Copyright />
        <SessionProvider session={session!}>
          <GoogleRecaptchaWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NprogressProvider>
                {children}
              </NprogressProvider>
              <Toaster position="top-center" />
            </ThemeProvider>
          </GoogleRecaptchaWrapper>
        </SessionProvider>
      </body>
    </html >
  );
}

"use client";
import { Header } from "@/components/header";
import { FloatingPlayer } from "@/components/floating-player";
import { AudioProvider } from "@/components/audio-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AudioProvider>
          <ScrollToTop />
          <Header />
          <div className="pt-16">{children}</div>
          <FloatingPlayer />
        </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

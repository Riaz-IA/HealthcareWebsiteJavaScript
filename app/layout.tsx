import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { signout } from "./login/actions";

export const metadata: Metadata = {
  title: "Sentury Care",
  description: "Find trusted care professionals and family support services.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let role = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = data?.role;
  }

  return (
    <html lang="en">
      <body className="bg-sentury-cream text-sentury-green antialiased">
        <header className="border-b border-sentury-blue/30 bg-sentury-offwhite px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-sentury-green tracking-tight">
              Sentury Care
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium hover:text-sentury-green/70 transition-colors"
              >
                Directory
              </Link>
              
              {user ? (
                <div className="flex items-center gap-4">
                  {role === "admin" && (
                    <Link href="/admin" className="text-sm font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full hover:bg-red-200 transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  {role === "professional" && (
                    <Link href="/professional" className="text-sm font-bold text-sentury-peach hover:text-sentury-peach/80 transition-colors">
                      My Dashboard
                    </Link>
                  )}
                  {role === "parent" && (
                    <Link href="/parent" className="text-sm font-bold text-sentury-peach hover:text-sentury-peach/80 transition-colors">
                      My Dashboard
                    </Link>
                  )}
                  <span className="text-xs bg-sentury-blue text-sentury-green px-3 py-1 rounded-full font-medium">
                    {user.email}
                  </span>
                  <form action={signout}>
                    <button
                      type="submit"
                      className="text-sm text-sentury-green font-medium underline hover:text-sentury-green/70"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-sentury-green text-sentury-offwhite px-4 py-2 rounded-default text-sm font-semibold hover:bg-sentury-green/90 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
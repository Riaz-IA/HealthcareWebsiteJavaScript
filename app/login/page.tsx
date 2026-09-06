import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-sentury-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-sentury-offwhite p-8 rounded-lg shadow-sm border border-sentury-blue/30">
        <h1 className="text-3xl font-bold text-sentury-green text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-sentury-green/70 text-center mb-6">
          Sign in to your Sentury Care account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-default">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-sentury-green mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="jane@example.com"
              className="w-full p-3 rounded-default border border-sentury-blue/50 text-sentury-green bg-white focus:outline-sentury-green"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-sentury-green mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-3 rounded-default border border-sentury-blue/50 text-sentury-green bg-white focus:outline-sentury-green"
            />
          </div>

          <button
            formAction={login}
            className="w-full bg-sentury-green text-sentury-offwhite py-3 rounded-default font-semibold hover:bg-sentury-green/90 transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-sentury-green/80 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-sentury-green underline hover:text-sentury-green/70">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
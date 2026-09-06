import Link from "next/link";
import { signup } from "../login/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-sentury-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-sentury-offwhite p-8 rounded-lg shadow-sm border border-sentury-blue/30">
        <h1 className="text-3xl font-bold text-sentury-green text-center mb-2">
          Create Account
        </h1>
        <p className="text-sm text-sentury-green/70 text-center mb-6">
          Join the Sentury Care community
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-default">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-sentury-green mb-1">
              Full Name
            </label>
            <input
              name="full_name"
              type="text"
              required
              placeholder="e.g. Jane Doe"
              className="w-full p-3 rounded-default border border-sentury-blue/50 text-sentury-green bg-white focus:outline-sentury-green"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-sentury-green mb-1">
              Account Type
            </label>
            <select
              name="role"
              className="w-full p-3 rounded-default border border-sentury-blue/50 text-sentury-green bg-white focus:outline-sentury-green"
            >
              <option value="parent">Parent / Family</option>
              <option value="professional">Care Professional</option>
            </select>
          </div>

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
            formAction={signup}
            className="w-full bg-sentury-peach text-sentury-green py-3 rounded-default font-semibold hover:bg-sentury-peach/80 transition-colors mt-2"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-sentury-green/80 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-sentury-green underline hover:text-sentury-green/70">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
import { login, signup } from "./actions";

export default async function IdentityPortal({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative z-10 w-full">
      <div className="mb-12 text-center pointer-events-none">
        <h1 className="text-4xl font-bold tracking-[0.2em] mb-2 text-white">CH-SIMULATOR</h1>
        <p className="text-sm tracking-widest text-[#45B6FE] uppercase opacity-80">Kernel Access Terminal</p>
      </div>

      <div className="glass-panel w-full max-w-md p-8 flex flex-col gap-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#45B6FE] to-transparent opacity-50"></div>

        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-wide text-white">Identity Verification</h2>
          <p className="text-xs text-white/50 tracking-wider">Please provide your credentials below.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-xs tracking-wider uppercase">
            [ERROR] {error}
          </div>
        )}

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-white/70 uppercase tracking-wider" htmlFor="email">Email Designation</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#45B6FE]/50 transition-colors placeholder:text-white/20"
              placeholder="subject@switzerland.ch"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/70 uppercase tracking-wider" htmlFor="password">Security Key</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#45B6FE]/50 transition-colors placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              formAction={login}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg px-4 py-3 text-sm font-medium transition-all uppercase tracking-widest mt-2"
            >
              Authenticate
            </button>
            <button
              formAction={signup}
              className="w-full bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 text-white/50 hover:text-white rounded-lg px-4 py-2 text-xs font-medium transition-all tracking-widest mt-1"
            >
              Register New Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

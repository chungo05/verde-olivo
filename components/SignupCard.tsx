"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/components/I18nProvider";

export default function SignupCard() {
  const { dict, locale } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError(dict.auth.passwordMismatch);
      return;
    }
    if (password.length < 8) {
      setError(dict.auth.passwordTooShort);
      return;
    }

    setLoading(true);
    const emailRedirectTo = `${window.location.origin}/auth/confirm?next=/${locale}`;
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("rate limit") || msg.includes("over_email_send_rate_limit")) {
        setError(dict.auth.rateLimitError);
      } else {
        setError(dict.auth.genericError);
      }
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 antialiased text-nordic dark:text-gray-100 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/30 rounded-full blur-3xl dark:bg-primary/10" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <main className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-mosque rounded-xl mb-6 shadow-soft text-white">
            <span className="material-icons text-3xl">real_estate_agent</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-nordic-dark dark:text-white mb-2">
            {dict.auth.signupTitle}
          </h1>
          <p className="text-nordic-dark/60 dark:text-gray-400">
            {dict.auth.signupSubtitle}
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface dark:bg-[#152e2a] rounded-2xl shadow-soft p-8 sm:p-10 border border-white/50 dark:border-mosque/20 backdrop-blur-sm">
          {sent ? (
            /* Confirmation screen */
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-mosque/10 dark:bg-mosque/20 rounded-full">
                <span className="material-icons text-3xl text-mosque">mark_email_read</span>
              </div>
              <h2 className="text-xl font-semibold text-nordic-dark dark:text-white">
                {dict.auth.checkEmailTitle}
              </h2>
              <p className="text-sm text-nordic-dark/60 dark:text-gray-400">
                {dict.auth.checkEmailBody.replace("{{email}}", email)}
              </p>
            </div>
          ) : (
            /* Signup form */
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-nordic-dark/70 dark:text-gray-300 mb-1">
                  {dict.auth.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.auth.emailPlaceholder}
                  className="w-full rounded-lg border border-gray-200 dark:border-mosque/30 bg-white dark:bg-[#1a3833] px-3.5 py-2.5 text-sm text-nordic-dark dark:text-white placeholder:text-nordic-dark/30 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-mosque/40 transition"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-nordic-dark/70 dark:text-gray-300 mb-1">
                  {dict.auth.passwordLabel}
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={dict.auth.passwordPlaceholder}
                  className="w-full rounded-lg border border-gray-200 dark:border-mosque/30 bg-white dark:bg-[#1a3833] px-3.5 py-2.5 text-sm text-nordic-dark dark:text-white placeholder:text-nordic-dark/30 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-mosque/40 transition"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-nordic-dark/70 dark:text-gray-300 mb-1">
                  {dict.auth.confirmPasswordLabel}
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={dict.auth.passwordPlaceholder}
                  className="w-full rounded-lg border border-gray-200 dark:border-mosque/30 bg-white dark:bg-[#1a3833] px-3.5 py-2.5 text-sm text-nordic-dark dark:text-white placeholder:text-nordic-dark/30 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-mosque/40 transition"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-mosque py-2.5 text-sm font-semibold text-white transition-all hover:bg-mosque/90 hover:shadow-soft hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? dict.auth.creatingAccount : dict.auth.createAccountButton}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-nordic-dark/60 dark:text-gray-400">
            {dict.auth.alreadyHaveAccount}{" "}
            <a
              href={`/${locale}/login`}
              className="font-semibold text-mosque hover:text-mosque/80 transition-colors"
            >
              {dict.auth.signIn}
            </a>
          </p>
        </div>

        {/* Footer links */}
        <div className="mt-8 text-center">
          <nav className="flex justify-center gap-6 text-xs text-nordic-dark/50 dark:text-gray-500">
            <a href="#" className="hover:text-nordic-dark dark:hover:text-gray-300 transition-colors">
              {dict.auth.privacy}
            </a>
            <a href="#" className="hover:text-nordic-dark dark:hover:text-gray-300 transition-colors">
              {dict.auth.terms}
            </a>
            <a href="#" className="hover:text-nordic-dark dark:hover:text-gray-300 transition-colors">
              {dict.auth.help}
            </a>
          </nav>
        </div>
      </main>
    </div>
  );
}

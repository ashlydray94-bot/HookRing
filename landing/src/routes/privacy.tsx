import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-dvh font-sans bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-lg">
              ♪
            </span>
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              HookRing
            </span>
          </a>
          <a
            href="/"
            className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
          >
            Back to Home
          </a>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-gray-500">Last updated: July 2026</p>

        <div className="mt-12 space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            <p className="mt-4">
              When you sign up for early access to HookRing, we collect your email address. That's it.
              We do not collect personal data beyond what you voluntarily provide. We do not use
              cookies for tracking, sell your data, or share it with third parties for marketing
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            <p className="mt-4">
              Your email address is used solely to notify you when HookRing launches and to send
              occasional product updates. You can unsubscribe at any time by replying to any email
              from us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">3. Spotify Integration</h2>
            <p className="mt-4">
              HookRing connects to Spotify to let you browse and preview tracks. We use Spotify's
              official API and your personal listening rights. We do not store your Spotify
              credentials — authentication is handled directly between you and Spotify via OAuth.
              We do not download or cache full audio tracks; only short clips for ringtone generation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">4. Data Storage</h2>
            <p className="mt-4">
              Email signups are stored securely on our servers. Ringtone clips you create are
              processed locally on your device and are never uploaded to our servers unless you
              choose to use cloud storage (premium feature).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">5. Your Rights</h2>
            <p className="mt-4">
              You have the right to access, correct, or delete any personal data we hold about you.
              To exercise these rights, email us at{" "}
              <a href="mailto:privacy@hookring.app" className="text-purple-600 underline hover:text-purple-700">
                privacy@hookring.app
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">6. Changes to This Policy</h2>
            <p className="mt-4">
              We may update this policy from time to time. Significant changes will be communicated
              via email. Continued use of HookRing after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">7. Contact</h2>
            <p className="mt-4">
              Questions? Reach out at{" "}
              <a href="mailto:hello@hookring.app" className="text-purple-600 underline hover:text-purple-700">
                hello@hookring.app
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2 text-xl font-extrabold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-sm">
                ♪
              </span>
              HookRing
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              <a href="mailto:hello@hookring.app" className="hover:text-gray-300 transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} HookRing. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

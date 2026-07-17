import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

const subscribeEmail = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { email: string };
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      throw new Error("Invalid email address");
    }
    return d;
  })
  .handler(async ({ data }) => {
    // TODO: wire to database for production
    console.log(`New early access signup: ${data.email}`);
    return { success: true };
  });

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-dvh font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}

/* ── Nav ─────────────────────────────────────────────────── */
function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-lg">
            ♪
          </span>
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            HookRing
          </span>
        </a>
        <a
          href="#cta"
          className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
        >
          Get Early Access
        </a>
      </div>
    </nav>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-purple-100/60 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700 mb-6">
              🎵 Your music, your ringtone
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl lg:leading-tight">
              Turn any{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Spotify song
              </span>{" "}
              into your ringtone
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              Browse Spotify's entire catalogue, pick your favorite track, trim
              the perfect 15–30 second clip, and export it as a custom ringtone
              — all in one app. No audio engineering needed.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="#cta"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                Get Early Access Free
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border-2 border-gray-200 px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                How it works
              </a>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500 lg:justify-start">
              <span>✓ 3 free ringtones/month</span>
              <span>✓ No credit card</span>
              <span>✓ iOS &amp; Android</span>
            </div>
          </div>

          {/* Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-purple-400/20 to-indigo-500/20 blur-2xl" />
              <img
                src="/hero-mockup.png"
                alt="HookRing app showing a music track with waveform trimmer and export button"
                className="relative w-full max-w-md rounded-2xl shadow-2xl"
                width={512}
                height={512}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: "1",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Browse Spotify",
      desc: "Search any track in Spotify's massive catalogue. Find the song you want to hear every time someone calls.",
    },
    {
      num: "2",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Trim the Perfect Clip",
      desc: "Use our intuitive waveform editor to select the best 15–30 seconds. Drag, zoom, and preview until it's just right.",
    },
    {
      num: "3",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: "Export & Install",
      desc: "Export in studio-quality .m4r for iPhone or .mp3 for Android. Install as your ringtone with one tap.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-600">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your ringtone in three steps
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            No audio engineering degree required. If you can use Spotify, you can
            make a ringtone.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white transition-all">
                {step.icon}
              </div>
              <div className="absolute top-6 right-6 text-5xl font-extrabold text-gray-100 group-hover:text-purple-50 transition-colors select-none">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ────────────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: "🎛️",
      title: "Studio-Quality Output",
      desc: "Export at high bitrates optimized for both iOS and Android. Your ringtone sounds crisp on every speaker.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      desc: "From search to ringtone in under 60 seconds. Our trimming engine processes tracks instantly.",
    },
    {
      icon: "📱",
      title: "iOS & Android Ready",
      desc: "Exports .m4r for iPhone and .mp3/.ogg for Android. Works with every modern smartphone.",
    },
    {
      icon: "🎨",
      title: "Beautiful Waveform Editor",
      desc: "Zoom, drag, and preview with pixel-perfect precision. Find the exact moment that makes the perfect ringtone.",
    },
    {
      icon: "🔄",
      title: "Free Tier Included",
      desc: "Get 3 free ringtone exports every month. Upgrade for unlimited when you're hooked.",
    },
    {
      icon: "🔒",
      title: "Your Music, Legally",
      desc: "Uses your personal Spotify listening rights. No piracy, no shady audio ripping.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-600">
            Why HookRing
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ringtone creation,{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              reimagined
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Remember when ringtones were fun? We're bringing them back — better
            than ever.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-100 p-8 transition-all hover:border-purple-200 hover:shadow-md"
            >
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────── */
function Pricing() {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-20 sm:py-28">
      {/* Waveform background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="/waveform-bg.png"
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            Start free, stay flexible
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            HookRing is free to try. Upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 max-w-3xl mx-auto">
          {/* Free tier */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white">Free</h3>
            <p className="mt-1 text-gray-400">For casual ringtone fans</p>
            <div className="mt-6">
              <span className="text-5xl font-extrabold text-white">$0</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "3 ringtone exports per month",
                "15-second clip length",
                "Standard bitrate export",
                "iOS & Android formats",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-300">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tier */}
          <div className="relative rounded-2xl border-2 border-purple-500 bg-gray-800/80 p-8 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 text-sm font-semibold text-white">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white">Pro</h3>
            <p className="mt-1 text-gray-400">For ringtone power-users</p>
            <div className="mt-6">
              <span className="text-5xl font-extrabold text-white">$2.99</span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">or $19.99/year — save 44%</p>
            <ul className="mt-8 space-y-3">
              {[
                "Unlimited ringtone exports",
                "Up to 30-second clips",
                "High bitrate studio quality",
                "Priority new features",
                "All formats included",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-300">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Need just one more ringtone?{" "}
          <span className="text-gray-400">One-off purchase at $0.99/ringtone — no subscription needed.</span>
        </p>
      </div>
    </section>
  );
}

/* ── CTA Section ─────────────────────────────────────────── */
function CTASection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await subscribeEmail({ data: { email } });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="cta" className="py-20 sm:py-28 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Ready to make your phone sound like{" "}
          <span className="underline decoration-purple-300 decoration-4 underline-offset-4">you</span>?
        </h2>
        <p className="mt-4 text-lg text-purple-100">
          Join the early access list and be first to try HookRing. No spam, just
          a heads-up when we launch.
        </p>

        {status === "success" ? (
          <div className="mt-8 rounded-2xl bg-white/10 backdrop-blur-sm p-8 ring-1 ring-white/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-400/20">
              <svg className="h-8 w-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">You're on the list! 🎉</h3>
            <p className="mt-2 text-purple-200">
              We'll email you as soon as HookRing is ready. Get excited!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              className="flex-1 rounded-full border-2 border-white/20 bg-white/10 px-6 py-4 text-white placeholder-purple-200 backdrop-blur-sm focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-white px-8 py-4 font-semibold text-purple-700 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? "Signing up..." : "Get Early Access"}
            </button>
          </form>
        )}
        {status === "error" && errorMsg && (
          <p className="mt-3 text-sm text-purple-200">{errorMsg}</p>
        )}
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────── */
function Footer() {
  return (
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
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="mailto:hello@hookring.app" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} HookRing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

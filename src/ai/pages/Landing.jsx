import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ImageIcon, Video, Wand2, Zap, Shield, Check, ArrowRight, Star, Crown } from 'lucide-react';
import { Logo } from '../components/Logo';
import { PLAN_FALLBACK, BRAND } from '../lib/constants';

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

// Live showcase — real AI images rendered on the fly by Pollinations (free).
const SHOWCASE = [
  'majestic lion portrait, golden hour, photorealistic, sharp',
  'futuristic cyberpunk city at night, neon lights, cinematic',
  'astronaut floating in space, glowing nebula, ultra detailed',
  'cute friendly robot, 3d render, soft studio lighting',
  'japanese garden with cherry blossoms, misty morning, cinematic',
  'luxury sports car in a studio, dramatic lighting, 8k',
  'fantasy castle on a floating island at sunset, epic',
  'editorial fashion portrait of a woman, soft light, magazine',
].map(
  (p, i) =>
    `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=400&height=400&nologo=true&model=flux&seed=${100 + i}`
);

const FEATURES = [
  { icon: ImageIcon, title: 'Stunning images', desc: 'Generate gallery-grade visuals from a single line of text — any style, any aspect ratio.' },
  { icon: Video, title: 'Cinematic video', desc: 'Turn prompts into smooth, high-resolution video clips. Vertical or horizontal.' },
  { icon: Zap, title: 'Blazing fast', desc: 'Optimised pipeline returns your first result in seconds, not minutes.' },
  { icon: Wand2, title: 'Style presets', desc: 'Cinematic, anime, 3D, photoreal and more — dial in the exact look you want.' },
  { icon: Shield, title: 'Yours to own', desc: 'Commercial license on Ultra. Download in full quality, no watermarks.' },
  { icon: Sparkles, title: 'History & library', desc: 'Every creation saved automatically. Revisit, re-download, refine anytime.' },
];

const TESTIMONIALS = [
  { name: 'Aarav Mehta', role: 'Brand Designer', text: 'Aether replaced three tools in my stack. The image quality is genuinely unreal.' },
  { name: 'Priya Nair', role: 'Content Creator', text: 'I shipped a whole campaign in an afternoon. The presets nail the aesthetic every time.' },
  { name: 'Rohan Das', role: 'Startup Founder', text: 'Clean, fast, and premium. It feels like the future of creative work.' },
];

export default function Landing() {
  return (
    <div className="ae-app ae-scroll overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2.5">
            <Link to="/login" className="hidden px-4 py-2 text-sm font-medium text-white/70 hover:text-white sm:block">Log in</Link>
            <Link to="/login" className="ae-btn !px-4 !py-2.5">Get started <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fade()} className="mb-6 inline-flex items-center gap-2 rounded-full ae-glass px-4 py-1.5 text-xs font-medium text-white/70">
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand-soft" /> AI image & video generation
          </motion.div>
          <motion.h1 {...fade(0.05)} className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
            Imagine it. <span className="ae-gradient-text">Generate it.</span>
            <br className="hidden sm:block" /> In seconds.
          </motion.h1>
          <motion.p {...fade(0.1)} className="mx-auto mt-6 max-w-xl text-base text-white/55 sm:text-lg">
            {BRAND} turns your words into breathtaking images and cinematic video. A premium studio,
            right in your browser.
          </motion.p>
          <motion.div {...fade(0.15)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/login" className="ae-btn w-full !py-3.5 sm:w-auto">
              <Sparkles className="h-4 w-4" /> Start creating
            </Link>
            <a href="#pricing" className="ae-btn-ghost w-full !py-3.5 sm:w-auto">View pricing</a>
          </motion.div>
        </div>

        {/* Live showcase — real AI-generated images */}
        <motion.div {...fade(0.2)} className="relative mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="pointer-events-none absolute -inset-x-10 -bottom-10 top-1/2 z-10 bg-gradient-to-t from-ink-950 to-transparent" />
          {SHOWCASE.map((url, i) => (
            <div
              key={i}
              className={`group relative aspect-square overflow-hidden rounded-2xl ae-glass ${i > 3 ? 'hidden sm:block' : ''}`}
              style={{ animation: `float 6s ease-in-out ${(i % 4) * 0.4}s infinite` }}
            >
              <div className="absolute inset-0 grid place-items-center bg-white/[0.02]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-brand" />
              </div>
              <img
                src={url}
                alt="AI generated showcase"
                loading="lazy"
                className="relative h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <motion.div {...fade()} className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Everything you need to create</h2>
          <p className="mt-3 text-white/45">Powerful, minimal, and beautifully fast.</p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fade(i * 0.05)} className="ae-card group p-6 transition hover:ring-1 hover:ring-brand/30">
              <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand-soft transition group-hover:bg-brand/25">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div {...fade()} className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Premium pricing, no free tier</h2>
          <p className="mt-3 text-white/45">Pick a plan and unlock the studio instantly.</p>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-3">
          {PLAN_FALLBACK.map((p, i) => {
            const hot = p.highlight;
            return (
              <motion.div key={p.key} {...fade(i * 0.08)} className={`relative flex flex-col rounded-3xl p-6 ${hot ? 'ae-glass-strong ring-1 ring-brand/40 shadow-glow' : 'ae-card'}`}>
                {hot && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-grad px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-glow-sm">Most popular</span>}
                <h3 className="font-display text-lg font-bold text-white">{p.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-display text-4xl font-extrabold text-white">₹{p.price}</span>
                  <span className="mb-1.5 text-sm text-white/40">/mo</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-white/65">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" /> {perk}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className={`mt-6 w-full ${hot ? 'ae-btn' : 'ae-btn-ghost'}`}>Get {p.name}</Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <motion.div {...fade()} className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Loved by creators</h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} {...fade(i * 0.06)} className="ae-card p-6">
              <div className="mb-3 flex gap-0.5 text-brand-soft">
                {[...Array(5)].map((_, s) => <Star key={s} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm leading-relaxed text-white/70">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-grad text-xs font-bold text-white">{t.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <motion.div {...fade()} className="relative overflow-hidden rounded-3xl ae-glass-strong px-6 py-16 text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(168,85,247,0.25),transparent)]" />
          <Crown className="mx-auto mb-5 h-10 w-10 text-brand-soft" />
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Start creating with {BRAND} today</h2>
          <p className="mx-auto mt-3 max-w-md text-white/50">Join creators turning imagination into reality.</p>
          <Link to="/login" className="ae-btn mx-auto mt-8 !px-7 !py-3.5">
            <Sparkles className="h-4 w-4" /> Get started
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
          <Logo />
          <p className="text-xs text-white/30">© {new Date().getFullYear()} {BRAND}. Crafted with AI.</p>
        </div>
      </footer>
    </div>
  );
}

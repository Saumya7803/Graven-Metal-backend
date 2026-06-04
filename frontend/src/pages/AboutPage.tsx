import { motion } from 'framer-motion';
import { ArrowRight, Award, Eye, ShieldCheck, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MotionReveal } from '../components/MotionReveal';
import { SEO } from '../components/seo/SEO';
import { companyDetails } from '../data/demoContent';

const heroStats = [
  { value: '10K+', label: 'Happy Clients', icon: Users },
  { value: '1000+', label: 'Trusted Suppliers', icon: Award },
  { value: '25+', label: 'Countries Delivered', icon: ShieldCheck },
  { value: '100%', label: 'Quality Assured', icon: Eye },
];

const pillars = [
  {
    title: 'Our Mission',
    icon: Target,
    text: 'To deliver premium quality metals with integrity, precision, and reliable service for every project.',
  },
  {
    title: 'Our Vision',
    icon: Eye,
    text: 'To become a trusted global supplier known for strength, consistency, and customer confidence.',
  },
  {
    title: 'Our Values',
    icon: ShieldCheck,
    text: 'Quality, trust, innovation, and customer satisfaction guide every order and every delivery.',
  },
];

export function AboutPage() {
  return (
    <div className="bg-[#03070b]">
      <SEO
        title="About Us"
        description="Learn about GRAVEN METAL, our mission, vision, values, and premium metal supply expertise."
        path="/about"
      />
      <MotionReveal>
        <section className="relative min-h-[calc(100svh-121px)] overflow-hidden bg-[#04070b]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(222,177,96,0.18),transparent_28%),radial-gradient(circle_at_16%_36%,rgba(222,177,96,0.08),transparent_30%),linear-gradient(180deg,rgba(3,7,11,0.1)_0%,rgba(3,7,11,0.72)_60%,rgba(3,7,11,0.95)_100%)]" />
            <div className="absolute left-[2%] top-[10%] h-[86%] w-px rotate-[22deg] bg-gradient-to-b from-transparent via-gold/70 to-transparent" />
            <div className="absolute left-[6%] top-[8%] h-[88%] w-px rotate-[22deg] bg-gradient-to-b from-transparent via-gold/48 to-transparent" />
            <div className="absolute left-[10%] top-[6%] h-[90%] w-px rotate-[22deg] bg-gradient-to-b from-transparent via-gold/28 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-121px)] max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid flex-1 items-center gap-10 py-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative flex min-h-[46vh] items-center justify-center overflow-hidden rounded-[2rem] border border-gold/15 bg-[#070b10] px-6 py-10 shadow-[0_0_0_1px_rgba(214,176,92,0.05),0_20px_60px_rgba(0,0,0,0.35)] sm:min-h-[58vh] lg:min-h-[72vh]">
                <div className="absolute inset-0">
                  <div className="absolute left-[-12%] top-[-12%] h-[130%] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-gold/80 to-transparent" />
                  <div className="absolute left-[2%] top-[-12%] h-[130%] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
                  <div className="absolute left-[16%] top-[-12%] h-[130%] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-gold/42 to-transparent" />
                  <div className="absolute right-[8%] top-[-12%] h-[130%] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-gold/70 to-transparent" />
                </div>

                <div className="relative flex w-full flex-col items-center justify-center text-center">
                  <div className="rounded-full border border-gold/20 bg-black/35 p-7 shadow-[0_0_45px_rgba(214,176,92,0.08)]">
                    <img
                      src="/imgs/logo.png"
                      alt="Graven Metal logo"
                      className="h-40 w-40 object-contain sm:h-52 sm:w-52 lg:h-56 lg:w-56"
                      decoding="async"
                    />
                  </div>
                  <div className="mt-8">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">About Graven Metal</p>
                    <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                      Building Strength.
                      <br />
                      Delivering Trust.
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
                      GRAVEN METAL is a leading global supplier of premium quality metals. We ensure 100% purity,
                      competitive pricing, and timely delivery.
                    </p>
                    <p className="mt-4 text-sm text-zinc-400">Trusted by industries worldwide.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">About Graven Metal</p>
                <h2 className="mt-4 max-w-[11ch] font-display text-5xl leading-[1.02] text-white sm:text-6xl xl:text-[5rem]">
                  Forging Strength.
                  <br />
                  Delivering Excellence.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                  {companyDetails.intro}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {heroStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                            <Icon size={18} />
                          </span>
                          <div>
                            <strong className="block text-xl font-semibold text-white">{stat.value}</strong>
                            <span className="text-sm text-zinc-400">{stat.label}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-3 rounded-xl border border-gold/40 bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-gold transition hover:bg-gold/10"
                  >
                    Explore Products
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4 pb-3 sm:grid-cols-3">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <motion.article
                    key={pillar.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.42, delay: index * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/10 bg-[#090d12]/95 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.24)]"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                        <Icon size={19} />
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-gold">{pillar.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">{pillar.text}</p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      </MotionReveal>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';

const quickLinks = [
  ['Home', '/'],
  ['Products', '/products'],
  ['Categories', '/categories'],
  ['Live Prices', '/live-prices'],
  ['About Us', '/about'],
  ['Contact', '/contact'],
  ['FAQ', '/faq'],
  ['Blog', '/blog'],
] as const;

const policyLinks = [
  ['Privacy Policy', '/privacy-policy'],
  ['Terms & Conditions', '/terms-conditions'],
  ['Shipping Policy', '/shipping-policy'],
  ['Return Policy', '/return-policy'],
] as const;

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-gold/20 bg-[#05090e]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/65 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gold-veil opacity-35" />

      <div className="relative mx-auto grid max-w-7xl gap-x-5 gap-y-5 px-4 py-7 md:grid-cols-2 md:px-8 lg:grid-cols-5">
        <div>
          <BrandLogo className="h-10" />
          <p className="mt-3 max-w-[16.5rem] text-sm leading-7 text-zinc-300">
            Graven Metals delivers premium industrial metals with trusted sourcing, superior quality, and innovative
            solutions powering industries worldwide.
          </p>
        </div>

        <div>
          <p className="min-h-[2rem] font-display text-lg text-white">OFFICE ADDRESS: LUCKNOW</p>
          <div className="mt-2.5 grid gap-1.5 text-sm text-zinc-400">
            <p className="w-fit rounded px-1 py-0.5">8/61, Sector-8</p>
            <p className="w-fit rounded px-1 py-0.5">Jankipuram Extension</p>
            <p className="w-fit rounded px-1 py-0.5">Lucknow - 226021, India</p>
            <a href="mailto:trade@gravenmetal.com" className="gm-luxury-hover w-fit rounded px-1 py-0.5 hover:text-gold">
              trade@gravenmetal.com
            </a>
            <a href="tel:+917905350134" className="gm-luxury-hover w-fit rounded px-1 py-0.5 hover:text-gold">
              +91 79053 50134
            </a>
          </div>
        </div>

        <div>
          <p className="min-h-[2rem] font-display text-lg text-white">OFFICE ADDRESS: DELHI</p>
          <div className="mt-2.5 grid gap-1.5 text-sm text-zinc-400">
            <p className="w-fit rounded px-1 py-0.5">7/25, Tower F, 2nd Floor</p>
            <p className="w-fit rounded px-1 py-0.5">Kirti Nagar</p>
            <p className="w-fit rounded px-1 py-0.5">New Delhi - 110015, India</p>
            <a href="mailto:trade@gravenmetal.com" className="gm-luxury-hover w-fit rounded px-1 py-0.5 hover:text-gold">
              trade@gravenmetal.com
            </a>
            <a href="tel:+917905350134" className="gm-luxury-hover w-fit rounded px-1 py-0.5 hover:text-gold">
              +91 79053 50134
            </a>
          </div>
        </div>

        <div>
          <p className="min-h-[2rem] font-display text-lg text-white">Quick Links</p>
          <div className="mt-2.5 grid gap-1.5 text-sm text-zinc-400">
            {quickLinks.map(([label, href]) => (
              <Link key={`secondary-${href}`} to={href} className="gm-luxury-hover w-fit rounded px-1 py-0.5 hover:text-gold">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="min-h-[2rem] font-display text-lg text-white">POLICIES</p>
          <div className="mt-2.5 grid gap-1.5 text-sm text-zinc-400">
            {policyLinks.map(([label, href]) => (
              <Link key={href} to={href} className="gm-luxury-hover w-fit rounded px-1 py-0.5 hover:text-gold">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-1.5 border-t border-gold/10 px-4 py-3 text-xs text-zinc-500 md:px-8">
        <div className="w-full">
          <p className="text-center font-semibold text-zinc-200">&copy; {currentYear} GRAVEN METAL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

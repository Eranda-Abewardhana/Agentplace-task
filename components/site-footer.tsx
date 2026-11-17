import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { assets } from "@/lib/assets";
import { OFFICIAL } from "@/lib/business-data";

const COPYRIGHT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link href="/" aria-label="SHWASH home"><Image src={assets.logo.src} alt={assets.logo.alt} width={156} height={44} /></Link>
            <p>Professional mobile detailing at home, work, or wherever your car is parked.</p>
          </div>
          <div className="site-footer__column">
            <p className="footer-label">Explore</p>
            <Link href="/services">Services</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/assistant">Detailing consultant</Link>
            <Link href="/booking">Booking preparation</Link>
          </div>
          <div className="site-footer__column">
            <p className="footer-label">Get in touch</p>
            <a href={OFFICIAL.call}><Phone size={16} /> (512) 759-6337</a>
            <a href={OFFICIAL.text}><MessageCircle size={16} /> Text SHWASH</a>
            <a href="mailto:hello@shwash.co">hello@shwash.co</a>
            <p><MapPin size={16} /> Austin · Dallas · Houston</p>
          </div>
          <div className="site-footer__cta">
            <p className="footer-label">Ready when you are</p>
            <p>Choose a service and continue to SHWASH’s official booking flow.</p>
            <a className="button button--primary" href={OFFICIAL.booking} target="_blank" rel="noreferrer">
              Continue to Official Booking <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {COPYRIGHT_YEAR} SHWASH Mobile Car Detailing</span>
          <div><a href="https://www.shwash.co/privacy-policy" target="_blank" rel="noreferrer">Privacy</a><a href="https://www.shwash.co/terms-of-service" target="_blank" rel="noreferrer">Terms</a></div>
          <span>Built around the SHWASH standard.</span>
        </div>
      </div>
    </footer>
  );
}

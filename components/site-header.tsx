"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { assets } from "@/lib/assets";

const links = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="utility-bar">
        <span>Mobile detailing, brought to your door</span>
        <div className="utility-bar__links">
          <a href="tel:+15127596337">Call (512) 759-6337</a>
          <a href="sms:+15127643015">Text us</a>
        </div>
      </div>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" href="/" aria-label="SHWASH home" onClick={() => setMenuOpen(false)}>
            <Image src={assets.logo.src} alt={assets.logo.alt} width={156} height={44} loading="eager" />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
            <Link href="/assistant" className="desktop-nav__consultant">Detailing consultant <span>NEW</span></Link>
          </nav>
          <div className="site-header__actions">
            <Link className="button button--primary button--small header-book" href="/booking">
              Book a detail <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <button
              className="mobile-menu-toggle"
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>
            ))}
            <Link href="/assistant" onClick={() => setMenuOpen(false)}>Detailing consultant</Link>
            <Link className="mobile-nav__book" href="/booking" onClick={() => setMenuOpen(false)}>Book a detail <ArrowUpRight size={16} /></Link>
          </nav>
        )}
      </header>
    </>
  );
}

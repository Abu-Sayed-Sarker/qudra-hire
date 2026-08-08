'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaPinterest, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa6';

export default function SiteFooter() {
  return (
    <footer className="bg-white text-brand-navy pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-gray-100">
          {/* Column 1: Logo & Brand */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex flex-col">
                <Image src="/logo.png" alt="" width={280} height={150} className="hidden md:block h-24 w-auto object-contain mb-1" />
                <Image src="/mobile-logo.png" alt="" width={280} height={150} className="block md:hidden h-24 w-auto object-contain mb-1" />

              </div>
            </Link>

            <p className="text-gray-600 max-w-xs leading-relaxed">
              Curated School Supply<br />Kits For Modern Families.
            </p>

            <div className="flex gap-3 pt-2">
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:text-brand-orange hover:bg-orange-50 transition-all"
              >
                <FaTiktok className="h-3 w-3" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:text-brand-orange hover:bg-orange-50 transition-all"
              >
                <FaInstagram className="h-3 w-3" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:text-brand-orange hover:bg-orange-50 transition-all"
              >
                <FaFacebook className="h-3 w-3" />
              </a>
              <a
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:text-brand-orange hover:bg-orange-50 transition-all"
              >
                <FaPinterest className="h-3 w-3" />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:text-brand-orange hover:bg-orange-50 transition-all"
              >
                <FaYoutube className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-lg font-serif font-semibold text-brand-navy relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-brand-orange/30 pb-1">
              Shop
            </h4>
            <ul className="space-y-3 text-gray-500">
              <li>
                <Link href="/shop-kits" className="hover:text-brand-orange transition-colors">
                  Shop Kits
                </Link>
              </li>
              <li>
                <Link href="/search-school" className="hover:text-brand-orange transition-colors">
                  Find My School
                </Link>
              </li>
              <li>
                <Link href="/custom-upload" className="hover:text-brand-orange transition-colors">
                  Custom Upload
                </Link>
              </li>

            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-lg font-serif font-semibold text-brand-navy relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-brand-orange/30 pb-1">
              Help
            </h4>
            <ul className="space-y-3 text-gray-500">
              <li>
                <Link href="/about-us" className="hover:text-brand-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-brand-orange transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-brand-orange transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-brand-orange transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-lg font-serif font-semibold text-brand-navy relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-brand-orange/30 pb-1">
              Stay in the know
            </h4>
            <p className="text-gray-500 leading-relaxed pr-4">
              Get Your Child's Grade Supply List, Exclusive Offers, And School Updates.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Subscribed! Thank you.');
              }}
              className="mt-4 flex max-w-md"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 h-12 bg-[#F5F8FA] border-none text-gray-700 placeholder:text-gray-400 rounded-l-md px-4 focus:ring-1 focus:ring-brand-orange focus:outline-none"
              />
              <button
                type="submit"
                className="bg-brand-navy hover:bg-[#134074] text-white px-6 h-12 font-medium rounded-r-md transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-gray-400 gap-4">
          <p>&copy; PrepED School Supply Co.</p>
          <div className="flex gap-6 mr-10">
            <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-gray-600 transition-colors">
              Terms
            </Link>
          </div>
          <p className="flex items-center gap-1">
            Made With <span className="text-brand-orange">🧡</span> For Busy Families.
          </p>
        </div>
      </div>
    </footer>
  );
}


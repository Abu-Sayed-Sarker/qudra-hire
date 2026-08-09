"use client";

import {
  Menu,
  ShoppingBag,
  User,
  Trash2,
  Plus,
  Minus
} from "lucide-react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/shop-kits", label: "Shop Kits" },
  { href: "/search-school", label: "Find My School" },
  { href: "/custom-upload", label: "Custom Upload" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about-us", label: "About Us" },
  { href: "/#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);

  function isActive(href: string) {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <div className="bg-brand-orange text-white">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-2 text-[11px] sm:text-[13px] font-bold tracking-widest uppercase text-center sm:text-left gap-1 sm:gap-0">
          <span>FREE SHIPPING ON ORDERS OVER $75</span>
          <span className="hidden xs:inline sm:inline">BACK TO SCHOOL SALE - UP TO 20% OFF!</span>
        </div>
      </div>
      <header className="sticky top-0 z-50 w-full border-b border-orange-100/50 bg-brand-cream/90 backdrop-blur-md transition-all">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="" width={180} height={60} className="hidden md:block h-12 w-auto object-contain" />
            <Image src="/mobile-logo.png" alt="" width={180} height={60} className="block md:hidden h-12 w-auto object-contain" />
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[14px] lg:text-[15px] font-medium text-brand-text-muted">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-brand-orange",
                  isActive(link.href) && "text-brand-orange font-semibold"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/account">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex h-10 w-10 text-brand-text-muted rounded-full hover:bg-orange-50 transition-colors"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 text-brand-text-muted rounded-full hover:bg-orange-50 transition-colors"
                >
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-brand-cream border-l border-orange-100 flex flex-col h-full p-0">
                <SheetHeader className="p-5 border-b border-orange-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <SheetTitle className="font-serif text-2xl text-brand-navy flex items-center gap-2">
                    <ShoppingBag className="h-6 w-6 text-brand-orange" />
                    Cart <span className="text-brand-text-muted text-lg font-medium">(2)</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* Cart Item 1 */}
                  <div className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group hover:border-brand-orange/30 transition-colors">
                    <div className="w-22 h-22 bg-[#F8FAFC] rounded-xl flex items-center justify-center shrink-0 p-2">
                      <img src="/images/home/product-bundle.png" alt="Kit" className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-serif text-[15px] font-semibold text-brand-navy leading-tight">
                            Lincoln Elementary Kit
                          </h3>
                          <p className="text-[13px] text-brand-text-muted mt-1">Grade 1 • Left Handed</p>
                        </div>
                        <button className="text-gray-300 hover:text-red-500 transition-colors mt-0.5">
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-[#F4F6FA] rounded-lg px-2.5 py-1.5 border border-gray-100">
                          <button className="text-brand-text-muted hover:text-brand-navy transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="text-[13px] font-semibold text-brand-navy w-4 text-center">1</span>
                          <button className="text-brand-text-muted hover:text-brand-navy transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <span className="font-semibold text-brand-navy">$69.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Cart Item 2 */}
                  <div className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group hover:border-brand-orange/30 transition-colors">
                    <div className="w-22 h-22 bg-[#F8FAFC] rounded-xl flex items-center justify-center shrink-0 p-3">
                      <img src="/images/home/product-bundle.png" alt="Add-on" className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-serif text-[15px] font-semibold text-brand-navy leading-tight">
                            Premium Headphones
                          </h3>
                          <p className="text-[13px] text-brand-text-muted mt-1">Add-on Item</p>
                        </div>
                        <button className="text-gray-300 hover:text-red-500 transition-colors mt-0.5">
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-[#F4F6FA] rounded-lg px-2.5 py-1.5 border border-gray-100">
                          <button className="text-brand-text-muted hover:text-brand-navy transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="text-[13px] font-semibold text-brand-navy w-4 text-center">1</span>
                          <button className="text-brand-text-muted hover:text-brand-navy transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <span className="font-semibold text-brand-navy">$19.99</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary Footer */}
                <div className="bg-white border-t border-orange-100 p-5 space-y-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] mt-auto">
                  <div className="space-y-2.5 text-[14px]">
                    <div className="flex justify-between text-brand-text-muted">
                      <span>Subtotal</span>
                      <span className="font-medium text-brand-navy">$88.99</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                    <div>
                      <span className="font-serif text-lg font-semibold text-brand-navy">Total</span>
                    </div>
                    <span className="font-serif text-2xl font-bold text-brand-orange">$88.99</span>
                  </div>

                  <div className="pt-2">
                    <Link href="/checkout" className="block" onClick={() => setIsCartOpen(false)}>
                      <Button className="w-full h-13 bg-brand-navy hover:bg-[#134074] text-white rounded-xl font-semibold text-[15px] shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <p className="text-center text-[12px] text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Secure checkout powered by Stripe
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/shop-kits">
              <Button
                variant="outline"
                className="hidden md:inline-flex border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white rounded-md px-6 font-semibold"
              >
                Shop Kits
              </Button>
            </Link>

            {/* Mobile Nav Trigger */}
            <Sheet>
              <SheetTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-10 w-10 text-brand-navy rounded-full hover:bg-orange-50 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-brand-cream border-l border-orange-100 flex flex-col h-full"
              >
                <SheetHeader className="p-4 border-b border-orange-100">
                  <SheetTitle className="font-serif text-xl text-brand-navy">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 p-6 text-lg font-semibold text-brand-navy">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "transition-colors hover:text-brand-orange",
                        isActive(link.href) && "text-brand-orange"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}



"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { openCart, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-xl shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20 gap-4">
          {isMobileSearchOpen ? (
            // Mobile Search Active View
            <div className="flex items-center w-full gap-1 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex-1 relative flex items-center bg-secondary rounded-xl px-2">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  className="w-full pl-2 py-2 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 px-2 text-xs"
                onClick={() => setIsMobileSearchOpen(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight">GLOW</span>
              </Link>

              {/* Search Bar - Center (Desktop) */}
              <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div
                  className={`relative w-full flex items-center rounded-2xl transition-all duration-300 ${
                    isSearchFocused
                      ? "bg-card shadow-medium ring-1 ring-border"
                      : "bg-secondary"
                  }`}
                >
                  {/* Category Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-r border-border"
                    >
                      {selectedCategory}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {isCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-elevated border border-border overflow-hidden z-50"
                        >
                          <button
                            onClick={() => {
                              setSelectedCategory("All");
                              setIsCategoryOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-secondary transition-colors"
                          >
                            All Categories
                          </button>
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setSelectedCategory(cat.name);
                                setIsCategoryOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2"
                            >
                              <span>{cat.icon}</span>
                              {cat.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Search Input */}
                  <div className="flex-1 flex items-center">
                    <Search className="w-5 h-5 text-muted-foreground ml-3" />
                    <input
                      type="text"
                      placeholder="Search for products, brands..."
                      className="w-full px-3 py-3 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-1">
                {/* Mobile Search Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </Button>

                <Link href="/auth">
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <Heart className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </Button>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="container-luxury py-6 space-y-4">
              <Link
                href="/auth"
                className="flex items-center gap-3 py-3 text-foreground hover:text-muted-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                Account
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 py-3 text-foreground hover:text-muted-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                Wishlist
              </Link>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-2 py-2 px-3 bg-secondary rounded-xl text-sm hover:bg-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "./providers/CartContext"
import { GlobalSearch } from "./GlobalSearch"
import Image from "next/image"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { cart } = useCart()

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Shop Now" },
        { href: "/about", label: "About Us" },
        { href: "/blog", label: "Blogs" },
        { href: "/contact", label: "Contact Us" },
    ]

    return (
        <>
            <nav className="border-b border-gray-200 py-3 sticky top-0 left-0 z-50 w-full bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <Image src={"/ras-logo.png"} alt="ras logo" height={30} width={150} className="object-contain" />
                            </Link>
                        </div>

                        {/* Navigation Links - Desktop */}
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-8">
                                {navLinks.map((link) => (
                                    <Link key={link.href} href={link.href}>
                                        <span className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                                            {link.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right side icons - Desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            <GlobalSearch />
                            <Button variant="ghost" asChild size="icon" className="relative hover:bg-gray-100">
                                <Link href="/cart">
                                    <ShoppingCart className="h-5 w-5 text-gray-700" />
                                    {cart?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                                            {cart?.length || 0}
                                        </span>
                                    )}
                                </Link>
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                                    >
                                        {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="w-80 bg-white border-l border-gray-200 p-0"
                                    onCloseAutoFocus={(event) => event.preventDefault()}
                                >
                                    {/* Mobile Header */}
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                                            <Link href="/cart" onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" size="sm" className="relative">
                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                    Cart
                                                    {cart?.length > 0 && (
                                                        <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                                                            {cart?.length || 0}
                                                        </span>
                                                    )}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Mobile Navigation Links */}
                                    <div className="px-4 py-6 space-y-2">
                                        {navLinks.map((link) => (
                                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                                <div className="block w-full px-4 py-3 text-base font-semibold text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                                    {link.label}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Mobile Footer Actions */}
                                    <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-gray-50 border-t border-gray-200">
                                        <div className="flex items-center justify-around">
                                            <GlobalSearch />
                                            <Button variant="ghost" size="icon" className="hover:bg-gray-200">
                                                <Heart className="h-5 w-5 text-gray-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar

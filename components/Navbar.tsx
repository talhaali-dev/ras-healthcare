"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, ChevronDown, Search, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "./providers/CartContext"
import Image from "next/image"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { cart } = useCart()

    return (
        <>
            <nav className="border-b border-white/20 py-3 sticky top-2 left-0 z-50 w-full rounded-full backdrop-blur-md bg-white/10 shadow-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <Image src={"/ras-logo.png"} alt="ras logo" height={30} width={150} className="object-contain" />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-8">
                                <Link href="/">
                                    <span className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors drop-shadow-sm">Home</span>
                                </Link>

                                <div className="relative group">
                                    <button className="flex items-center text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors drop-shadow-sm">
                                        Shop Now
                                    </button>
                                </div>

                                <Link href="/about">
                                    <span className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors drop-shadow-sm">About Us</span>
                                </Link>

                                <Link href="/blog">
                                    <span className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors drop-shadow-sm">Blogs</span>
                                </Link>

                                <Link href="/contact">
                                    <span className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors drop-shadow-sm">Contact Us</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right side icons */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Button variant="ghost" asChild size="icon" className="relative hover:bg-white/20 backdrop-blur-sm">
                                <Link href="/cart">
                                    <ShoppingCart className="h-5 w-5 text-gray-800 drop-shadow-sm" />
                                    <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-semibold shadow-lg">
                                        {cart?.length || 0}
                                    </span>
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
                                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-black hover:bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 drop-shadow-sm"
                                    >
                                        {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side={"right"}
                                    className="backdrop-blur-xl bg-white/80 border-l border-white/20 shadow-2xl"
                                    onCloseAutoFocus={(event) => event.preventDefault()}
                                >
                                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                        <Link href="/">
                                            <Button variant="ghost" className="block w-full text-left px-3 py-2 text-base font-semibold text-gray-800 hover:bg-white/20 backdrop-blur-sm">
                                                Home
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="ghost"
                                            className="block w-full text-left px-3 py-2 text-base font-semibold flex items-center text-gray-800 hover:bg-white/20 backdrop-blur-sm"
                                        >
                                            Shop Now
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        </Button>

                                        <Link href="/about">
                                            <Button variant="ghost" className="block w-full text-left px-3 py-2 text-base font-semibold text-gray-800 hover:bg-white/20 backdrop-blur-sm">
                                                About Us
                                            </Button>
                                        </Link>

                                        <Link href="/blog">
                                            <Button variant="ghost" className="block w-full text-left px-3 py-2 text-base font-semibold text-gray-800 hover:bg-white/20 backdrop-blur-sm">
                                                Blogs
                                            </Button>
                                        </Link>

                                        <Link href="/contact">
                                            <Button variant="ghost" className="block w-full text-left px-3 py-2 text-base font-semibold text-gray-800 hover:bg-white/20 backdrop-blur-sm">
                                                Contact Us
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="pt-4 pb-3 border-t border-white/20">
                                        <div className="flex items-center px-5 space-x-3">
                                            <div className="text-sm font-semibold text-gray-800 drop-shadow-sm">Login / Register</div>

                                            <Button variant="ghost" size="icon" className="hover:bg-white/20 backdrop-blur-sm">
                                                <Search className="h-5 w-5 text-gray-800 drop-shadow-sm" />
                                            </Button>

                                            <Button variant="ghost" size="icon" className="hover:bg-white/20 backdrop-blur-sm">
                                                <Heart className="h-5 w-5 text-gray-800 drop-shadow-sm" />
                                            </Button>

                                            <Button asChild variant="ghost" size="icon" className="relative hover:bg-white/20 backdrop-blur-sm">
                                                <Link href="/cart">
                                                    <ShoppingCart className="h-5 w-5 text-gray-800 drop-shadow-sm" />
                                                    <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-semibold shadow-lg">
                                                        {cart?.length || 0}
                                                    </span>
                                                </Link>
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

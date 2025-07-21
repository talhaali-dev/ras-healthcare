"use client"
import { Card } from "@/components/ui/card"
import type { Product } from "@/types/appwrite.types"
import Image from "next/image"
import { useCart } from "./providers/CartContext"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function ProductCard({ product }: { product: Product }) {
    const { name, price, images, description } = product
    const { addToCart } = useCart()

    // Function to generate the background color class based on product name
    const getBackgroundColor = () => {
        const productName = name.toLowerCase()
        if (productName.includes("naturfol")) return "hover:bg-purple-500"
        if (productName.includes("follicare")) return "hover:bg-green-500"
        if (productName.includes("calcar")) return "hover:bg-red-500"
        if (productName.includes("caldense")) return "hover:bg-blue-500"
        if (productName.includes("vitam-x")) return "hover:bg-black"
        return "hover:bg-blue-500"
    }

    // Extract tablet count from product name or description
    const getTabletCount = () => {
        if (name.toLowerCase().includes("vitam-x")) {
            return "30 Tablets"
        }
        const match = name.match(/(\d+)\s*tablets?/i) || description?.match(/(\d+)\s*tablets?/i)
        return match ? `${match[1]} TABLETS` : "30 TABLETS"
    }

    // Format the product name to match the design
    const getFormattedName = () => {
        return name
            .split(/\s*\d+\s*tablets?/i)[0]
            .trim()
            .toUpperCase()
    }

    return (
        <div className="relative group w-full max-w-[300px] pt-[125px] h-[400px]">
            {/* Cart Button - Positioned half outside the card */}
            <button
                onClick={() => addToCart(product, 1)}
                className="absolute -right-3 top-[140px] z-20 bg-white w-12 h-12 rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110"
                aria-label="Add to cart"
            >
                <ShoppingCart className="h-5 w-5 text-blue-900" />
            </button>

            <Link href={`/products/${product.name.replace(" ", "-")}/${product.$id}`}>
                <Card className={`${getBackgroundColor()} transition-all duration-300 rounded-tr-[80px] h-[275px] relative`}>
                    {/* Product Image - Positioned to overflow from top and aligned to left */}
                    <div className="absolute -top-[125px] left-6 flex">
                        <Image
                            src={images[0] || "/placeholder.svg"}
                            alt={name}
                            width={220}
                            height={280}
                            className="object-contain h-[250px] transform transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>

                    {/* Product Details - Add padding top to make space for the image */}
                    <div className="p-4 pt-[125px] h-full flex flex-col justify-between">
                        <div>
                            {/* Rating Stars */}
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className="fill-orange-400 text-orange-400 group-hover:text-white group-hover:fill-transparent"
                                    />
                                ))}
                            </div>

                            {/* Product Name and Tablet Count */}
                            <h3 className="font-bold text-xl group-hover:text-white text-gray-900 mb-1 min-h-[3rem] flex items-center">
                                {getFormattedName()} <span className="group-hover:text-white text-gray-900">({getTabletCount()})</span>
                            </h3>
                        </div>

                        {/* Price */}
                        <p className="text-2xl font-bold text-blue-900 group-hover:text-white">
                            Rs. {Number(price).toFixed(Number(price) % 1 === 0 ? 0 : 2)}
                        </p>
                    </div>

                </Card>
            </Link>
        </div>
    )
}

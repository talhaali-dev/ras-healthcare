"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchProducts } from "@/app/admin/_actions/product"
import { Product } from "@/types/appwrite.types"
import Link from "next/link"
import Image from "next/image"

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Keyboard shortcut to open search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  // Search products with debounce
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const searchResults = await searchProducts(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Reset search when opening/closing
  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
    }
  }, [open])

  return (
    <>
      {/* Trigger Button - Desktop */}
      <Button
        variant="outline"
        className="hidden md:flex items-center gap-2 w-64 justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>Search products...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Trigger Button - Mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <DialogHeader className="border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products by name or description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 text-base"
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery("")}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : query.trim() === "" ? (
              <div className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">Start typing to search</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Search for products by name or description
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-muted border">Esc</kbd> to close
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
                  <X className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">No products found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {results.map((product) => (
                  <Link
                    key={product.$id}
                    href={`/products/${product.$id}`}
                    onClick={() => setOpen(false)}
                    className="block hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden border bg-white">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <Search className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {product.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          Rs. {product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="border-t px-4 py-2 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Found {results.length} product{results.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

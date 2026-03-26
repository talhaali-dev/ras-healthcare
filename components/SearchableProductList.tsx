"use client";

import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/appwrite.types";
import ProductCard from "./ProductCard";
import { Search } from "lucide-react";

interface SearchableProductListProps {
  label: string;
  products: Product[];
}

export default function SearchableProductList({
  label,
  products,
}: SearchableProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return products;
    }

    const query = debouncedQuery.toLowerCase().trim();
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const descMatch = product.description.toLowerCase().includes(query);
      return nameMatch || descMatch;
    });
  }, [products, debouncedQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-4xl font-bold">{label}</h1>

        {/* Search Input */}
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-gray-600 mb-4">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          {debouncedQuery && ` for "${debouncedQuery}"`}
        </p>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 place-items-center">
          {filteredProducts.map((product) => (
            <ProductCard product={product} key={product.$id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            {debouncedQuery
              ? `No products match "${debouncedQuery}". Try a different search term.`
              : "Try adjusting your search to find what you're looking for."}
          </p>
        </div>
      )}
    </div>
  );
}

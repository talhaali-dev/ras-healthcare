import { getAllProducts } from "@/app/admin/_actions/product";
import React from "react";
import ProductShowcase from "./ProductShowCase";
import { Product } from "@/types/appwrite.types";

const ProductShowcaselist = async () => {
  const products = await getAllProducts();
  return (
    <div className="mx-auto container ">
      <h1 className="text-4xl font-bold text-center my-8">
        Healthcare Products
      </h1>
      {products.documents.map((product: Product) => (
        <ProductShowcase
          product={product}
          key={product.$id}
          imageSrc={product.images[0]}
          imageAlt={product.name}
          title={product.name}
          benefits={product.benefits || []}
          price={String(product.price || 0)}
          inStock={(product.stock || 0) > 0}
          originalPrice={product.originalPrice}
          rating={5}
          reviewCount={20}
        />
      ))}
    </div>
  );
};

export default ProductShowcaselist;

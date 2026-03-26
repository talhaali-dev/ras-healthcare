import { getAllProducts } from '@/app/admin/_actions/product';
import SearchableProductList from '@/components/SearchableProductList';
import React from 'react'

const ProductsPage = async () => {
    const products = await getAllProducts();
  return (
    <SearchableProductList  label='All Products' products={products.documents} />
  )
}

export default ProductsPage

"use client"
import React from "react";
import ProductCard from "./ProductCard";

import { Product } from "@/types/appwrite.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
const ProductSlider = ({ products }: { products: Product[] }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        hideOnClick: true,
        enabled: true      }}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
    >
      {products.map((product: Product) => (
        <SwiperSlide key={product.$id} className="place-items-center">
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductSlider;

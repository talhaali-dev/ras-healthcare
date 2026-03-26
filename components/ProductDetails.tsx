"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Plus, Minus, Check } from "lucide-react";
import Image from "next/image";
import { useCart } from "./providers/CartContext";
import { Product } from "@/types/appwrite.types";
import { getProductReviewsWithStats } from "@/actions/reviews.actions";
import { Review } from "@/types/appwrite.types";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Fetch reviews when product changes
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const data = await getProductReviewsWithStats(product.$id);
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product.$id]);

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const existingCartItem = cart.find((item) => item.$id === product.$id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="grid lg:grid-cols-[120px,1fr] gap-8">
        {/* Main Content Grid */}
        <div className="order-2 lg:order-1">
          {/* Left Column - Thumbnail Images */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-[80px] h-[80px] rounded-lg overflow-hidden border ${
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-gray-200"
                } hover:border-blue-500 transition-colors`}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Center Column - Main Image and Details */}
        <div className="order-1 lg:order-2 space-y-8">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex items-center mt-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {totalReviews > 0 ? (
                      <>
                        {averageRating.toFixed(1)} ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                      </>
                    ) : (
                      "No reviews yet"
                    )}
                  </span>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                Rs. {(product.price || 0).toFixed(2)}
              </div>

              <div className="flex items-center gap-4">
                {existingCartItem ? (
                  <>
                    <div className="flex items-center border rounded-full overflow-hidden bg-gray-50">
                      <span className="w-24 text-center">
                        In Cart: {existingCartItem.quantity}
                      </span>
                    </div>
                    <Button
                      className="flex-1 rounded-full bg-green-600 hover:bg-green-700"
                      onClick={() => (window.location.href = "/cart")}
                    >
                      View Cart
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center border rounded-full overflow-hidden bg-gray-50">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrementQuantity}
                        disabled={quantity === 1}
                        className="rounded-none"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={incrementQuantity}
                        disabled={quantity === 10}
                        className="rounded-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </>
                )}
              </div>

              <div className="space-y-2 pt-4">
                {product.benefits?.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Tabs Section */}
          <Card className="mt-8 border-none shadow-none">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 space-x-8 bg-white">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0"
                >
                  DESCRIPTION
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-0"
                >
                  REVIEWS ({totalReviews})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-8">
                <div className="prose max-w-none text-gray-600">
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-8">
                {isLoadingReviews ? (
                  <div className="text-center py-12 text-gray-500">
                    Loading reviews...
                  </div>
                ) : totalReviews === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No reviews yet</p>
                    <p className="text-sm mt-2">Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="flex items-center gap-4 pb-6 border-b">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                          {averageRating.toFixed(1)}
                        </div>
                        <div className="flex gap-1 justify-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(averageRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.$id}
                          className="pb-6 border-b last:border-b-0"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= Number(review.rating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-medium text-gray-900">
                                  {review.customerName}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.$createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-2">{review.reviewText}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

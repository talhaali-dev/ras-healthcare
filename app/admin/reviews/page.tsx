"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllReviews, getReviewsStats } from "@/actions/reviews.actions"
import { ReviewsDataTable } from "./_components/Reviews-Data-Table"

export default function ReviewsManagement() {
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: getAllReviews,
  })

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["reviews-stats"],
    queryFn: getReviewsStats,
  })

  if (isLoadingReviews || isLoadingStats) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading reviews...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Review Management</h1>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm font-medium text-gray-600">Total Reviews</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalReviews}</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm font-medium text-gray-600">Approved</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.approvedReviews}</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm font-medium text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingReviews}</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-sm font-medium text-gray-600">Average Rating</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "N/A"}
            </div>
          </div>
        </div>
      )}

      <ReviewsDataTable data={reviews} />
    </div>
  )
}

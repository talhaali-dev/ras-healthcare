import Image from "next/image";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { UpdateStockDialog } from "./UpdateStockDIalog";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Product } from "@/types/appwrite.types";

interface ProductCardProps {
  product:Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={product.images[0]}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-2 right-2">
          <UpdateStockDialog
            productId={product.$id}
            quantity={product.stock || 0}
          >
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
            >
              <span className="font-medium">Update Stock</span>
            </Button>
          </UpdateStockDialog>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-blue-600 font-bold">
          {(product.price || 0).toFixed(2)} PKR
        </p>
        <p className="text-gray-600">Quantity: {product.stock}</p>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50"
          asChild
        >
          <Link href={`/admin/products/${product.$id}/update`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
        <DeleteConfirmationDialog productId={product.$id} >
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-800 border-red-200 hover:bg-red-50"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </DeleteConfirmationDialog>
      </CardFooter>
    </Card>
  );
}

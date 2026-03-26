import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you are looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Products
          </Link>
        </Button>
      </Card>
    </div>
  );
}

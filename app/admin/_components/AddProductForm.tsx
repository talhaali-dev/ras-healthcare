"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Editor } from "@/components/Editor";
import { ImageUpload } from "@/components/Image-upload";
import { Button } from "@/components/ui/button";
import { Save, Plus, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct, updateProduct } from "../_actions/product";
import { Product } from "@/types/appwrite.types";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().min(1, "Description is required"),
  images: z
    .union([z.array(z.instanceof(File)), z.array(z.string())])
    .optional(),
  quantity: z.coerce.number().min(0, "Quantity must be positive"),
  benefits: z.array(z.object({ value: z.string() })),
});

const AddProductForm = ({
  type,
  product,
}: {
  type?: string;
  product?: Product;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product ? product.name : "",
      price: product ? (product.price || 0) : 0,
      description: product ? product?.description : "",
      images: product ? product?.images : [],
      quantity: product ? (product.stock || 0) : 0,
    //   @ts-ignore
      benefits: product?.benefits ? product.benefits.map(b => ({ value: b })) : [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "benefits",
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const productData = {
        name: values.name,
        price: values.price,
        description: values.description,
        images: values.images as string[],
        quantity: values.quantity,
        benefits: values.benefits.map(b => b.value),
      };

      if (type === "update" && product) {
        // @ts-ignore
        await updateProduct(product?.$id, productData);
        router.push("/admin/products");
      } else {
        // @ts-ignore
        await createProduct(productData);
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error submitting product form:", error);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">
        {type === "update" ? "" : "Add New Product"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex  gap-4 ">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 flex-1 w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 flex-1 w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Editor
                        value={field.value}
                        onChange={field.onChange}
                        className="min-h-[200px] border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <FormLabel>Product Benefits</FormLabel>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`benefits.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter product benefit"
                              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: "" })}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        onImagesSelected={(images) => field.onChange(images)}
                        maxImages={5}
                        className="mt-2"
                        existingImages={product?.images}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              disabled={isLoading}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {type === "update" ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddProductForm;

import { z } from 'zod';
export const UserSchema = z.object({
    name: z.string().min(1, { message: "Name is Required" }).max(20, { message: "Name must be less than 20 characters" }),
    email: z.string().email({ message: "Email is not valid" }).min(1, { message: "Email is Required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be less than 20 characters" }),
})

export const ProductSchema = z.object({
    name:z.string().min(1, { message: "Name is Required" }).max(20, { message: "Name must be less than 20 characters" }),
    description: z.string().min(1, { message: "Description is Required" }).max(200, { message: "Description must be less than 200 characters" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    image: z.string().url({ message: "Image URL is not valid" }).optional(),
    category: z.string().min(1, { message: "Category is Required" }),
    stock: z.number().min(0, { message: "Stock must be a positive number" }).optional(),
    rating: z.number().min(0, { message: "Rating must be a positive number" }).max(5, { message: "Rating must be less than or equal to 5" }).optional(),
    brand: z.string().min(1, { message: "Brand is Required" }).optional(),
    discount: z.number().min(0, { message: "Discount must be a positive number" }).max(100, { message: "Discount must be less than or equal to 100" }).optional(),
})

export const CategorySchema = z.object({
    name: z.string().min(1, { message: "Name is Required" }).max(20, { message: "Name must be less than 20 characters" }),
    image: z.string().url({ message: "Image URL is not valid" }).optional(),
})

export const OrderSchema = z.object({
    products: z.array(z.object({
        productId: z.string().min(1, { message: "Product ID is Required" }),
        quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    })),
    totalAmount: z.number().min(0, { message: "Total amount must be a positive number" }),
})

export const ReviewSchema = z.object({
    productId: z.string().min(1, { message: "Product ID is Required" }),
    rating: z.number().min(1, { message: "Rating must be at least 1" }).max(5, { message: "Rating must be less than or equal to 5" }),
    comment: z.string().min(1, { message: "Comment is Required" }).max(200, { message: "Comment must be less than 200 characters" }),
})

export const CartSchema = z.object({
    userId: z.string().min(1, { message: "User ID is Required" }),
    products: z.array(z.object({
        productId: z.string().min(1, { message: "Product ID is Required" }),
        quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    })),
})

export const AddressSchema = z.object({
    userId: z.string().min(1, { message: "User ID is Required" }),
    addressLine1: z.string().min(1, { message: "Address Line 1 is Required" }),
    addressLine2: z.string().optional(),
    city: z.string().min(1, { message: "City is Required" }),
    state: z.string().min(1, { message: "State is Required" }),
    postalCode: z.string().min(1, { message: "Postal Code is Required" }),
    country: z.string().min(1, { message: "Country is Required" }),
})

export const CommentSchema = z.object({
    userId: z.string().min(1, { message: "User ID is Required" }),
    productId: z.string().min(1, { message: "Product ID is Required " }),
    comment: z.string().min(1, { message: "Comment is Required" }). max(200, { message: "Comment must be less than 200 characters" }),
    rating: z.number().min(1, { message: "Rating must be at least 1" }).max(5, { message: "Rating must be less than or equal to 5" }),
    createdAt: z.date().optional(), 
    updatedAt: z.date().optional(),
})
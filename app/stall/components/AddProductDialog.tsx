"use client"

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { CreateProductData, Size, Addon, Category } from "@/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Loader2,
    Plus,
    Trash2,
    Package,
    DollarSign,
    Utensils,
    Camera,
    Upload,
    XCircle,
    Check,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ProductData {
    id: string;
    name: string;
    images: string[];
    description: string | null;
    category: string;
    payOnOrder: boolean;
    quantity: number;
    stallId: string;
    price?: number;
    sizes?: Size[];
    addons?: Addon[];
    discount?: number; // discount value (e.g., 20 means 20%)
    discountType?: "percentage" | "fixed"; // new field
    createdAt: string;
    isFavorite?: boolean;
}

interface AddProductDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (
        productData: CreateProductData,
        updateFlag?: boolean
    ) => Promise<void>;
    editingProduct?: Partial<ProductData> | null;
    loading: boolean;
}

export default function AddProductDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    editingProduct,
    loading,
}: AddProductDialogProps) {
    const [productData, setProductData] = useState<ProductData>({
        id: "",
        name: "",
        description: null,
        category: "",
        payOnOrder: false,
        quantity: 1,
        stallId: "",
        createdAt: new Date().toISOString(),
        price: 0,
        sizes: [],
        addons: [],
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingProduct) {
            const API_BASE_URL =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

            setProductData({
                id: editingProduct.id ?? "",
                name: editingProduct.name ?? "",
                description: editingProduct.description ?? null,
                category: editingProduct.category ?? "",
                quantity: editingProduct.quantity ?? 1,
                createdAt: editingProduct.createdAt ?? new Date().toISOString(),
                price: editingProduct.price ?? 0,
                payOnOrder: editingProduct.payOnOrder ?? false,
                sizes: editingProduct.sizes ?? [],
                addons: editingProduct.addons ?? [],
                images: editingProduct.images ?? [],
                stallId: editingProduct.stallId ?? "",
            });

            // Convert image URLs to full URLs for previews
            const fullImageUrls = (editingProduct.images ?? []).map((img) =>
                img.startsWith("http") ? img : `${API_BASE_URL}${img}`
            );
            setImagePreviews(fullImageUrls);
        } else {
            // Reset to default when creating new product
            setProductData({
                id: "",
                name: "",
                description: null,
                category: "",
                payOnOrder: false,
                quantity: 1,
                createdAt: new Date().toISOString(),
                price: 0,
                sizes: [],
                addons: [],
                images: [],
                stallId: "",
            });
            setImagePreviews([]);
        }
    }, [editingProduct]);

    const addSize = () =>
        setProductData((prev) => ({
            ...prev,
            sizes: [...(prev.sizes ?? []), { label: "", price: 0 }],
        }));

    const removeSize = (index: number) => {
        const updated = [...(productData.sizes ?? [])];
        updated.splice(index, 1);
        setProductData({ ...productData, sizes: updated });
    };

    const handleSizeChange = (
        index: number,
        field: keyof Size,
        value: string
    ) => {
        const updated = [...(productData.sizes ?? [])] as Size[];
        if (field === "price") {
            updated[index].price = Number(value);
        } else {
            updated[index].label = value;
        }
        setProductData({ ...productData, sizes: updated });
    };

    const addAddon = (addon?: { label: string; price?: number }) =>
        setProductData((prev) => ({
            ...prev,
            addons: [
                ...(prev.addons ?? []),
                { label: addon?.label ?? "", price: addon?.price ?? 0 },
            ],
        }));

    const handleAddonChange = (
        index: number,
        field: keyof Addon,
        value: string
    ) => {
        const updated = [...(productData.addons ?? [])] as Addon[];
        if (field === "price") {
            updated[index].price = Number(value);
        } else {
            updated[index].label = value;
        }
        setProductData({ ...productData, addons: updated });
    };

    const removeAddon = (index: number) => {
        const updated = [...(productData.addons ?? [])];
        updated.splice(index, 1);
        setProductData({ ...productData, addons: updated });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);
        const readers = filesArray.map(
            (file) =>
                new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => resolve(ev.target?.result as string);
                    reader.readAsDataURL(file);
                })
        );

        Promise.all(readers).then((base64Images) => {
            setImagePreviews((prev) => [...prev, ...base64Images]);
            setProductData((prev) => ({
                ...prev,
                images: [...(prev.images ?? []), ...base64Images],
            }));
        });
    };

    const handleRemoveImage = (index: number) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setProductData((prev) => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const createPayload: CreateProductData = {
            name: productData.name ?? "",
            description: productData.description ?? null,
            price: productData.price ?? 0,
            category: productData.category ?? "",
            payOnOrder: productData?.payOnOrder,
            stallId: productData.stallId ?? "",
            quantity: productData.quantity ?? 1,
            sizes: productData.sizes,
            addons: productData.addons,
            images: productData.images as unknown as File[],
        };

        if (editingProduct) {
            onSubmit(productData, true);
        } else {
            onSubmit(createPayload);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {isOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" />
            )}
            <DialogContent className="sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl border bg-card text-card-foreground p-0">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b shrink-0 bg-muted/40">
                    <DialogTitle className="text-xl font-semibold tracking-tight">
                        {editingProduct ? "Edit Product" : "Create a New Product"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Fill in the details below to {editingProduct ? "update" : "add"}{" "}
                        your product.
                    </DialogDescription>
                </DialogHeader>

                {/* Body */}
                <form
                    id="product-form"
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Details */}
                            <div className="p-6 rounded-lg border bg-muted/20 space-y-4">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Utensils className="h-5 w-5 mr-2 text-primary" />
                                    Product Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Product Name</Label>
                                        <Input
                                            value={productData.name ?? ""}
                                            onChange={(e) =>
                                                setProductData({ ...productData, name: e.target.value })
                                            }
                                            placeholder="e.g., Jollof Rice"
                                            required
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select
                                            value={productData.category ?? ""}
                                            onValueChange={(v) =>
                                                setProductData({ ...productData, category: v })
                                            }
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* Food & Drinks */}
                                                <SelectItem value="MEAL">Meal</SelectItem>
                                                <SelectItem value="FOOD">Food</SelectItem>
                                                <SelectItem value="DRINKS">Drinks</SelectItem>
                                                <SelectItem value="SNACKS">Snacks</SelectItem>
                                                <SelectItem value="GROCERIES">Groceries</SelectItem>
                                                <SelectItem value="BEVERAGES">Beverages</SelectItem>

                                                {/* Fashion & Beauty */}
                                                <SelectItem value="FASHION">Fashion</SelectItem>
                                                <SelectItem value="CLOTHING">Clothing</SelectItem>
                                                <SelectItem value="FOOTWEAR">Footwear</SelectItem>
                                                <SelectItem value="ACCESSORIES">Accessories</SelectItem>
                                                <SelectItem value="JEWELRY">Jewelry</SelectItem>
                                                <SelectItem value="BEAUTY">Beauty</SelectItem>
                                                <SelectItem value="COSMETICS">Cosmetics</SelectItem>
                                                <SelectItem value="FRAGRANCE">Fragrance</SelectItem>
                                                <SelectItem value="HAIR_CARE">Hair Care</SelectItem>
                                                <SelectItem value="SKIN_CARE">Skin Care</SelectItem>

                                                {/* Electronics & Gadgets */}
                                                <SelectItem value="ELECTRONICS">Electronics</SelectItem>
                                                <SelectItem value="PHONES">Phones</SelectItem>
                                                <SelectItem value="COMPUTERS">Computers</SelectItem>
                                                <SelectItem value="LAPTOPS">Laptops</SelectItem>
                                                <SelectItem value="TABLETS">Tablets</SelectItem>
                                                <SelectItem value="ACCESSORIES_ELECTRONIC">Electronic Accessories</SelectItem>
                                                <SelectItem value="APPLIANCES">Home Appliances</SelectItem>
                                                <SelectItem value="TV_AUDIO">TV & Audio</SelectItem>
                                                <SelectItem value="GAMING">Gaming</SelectItem>
                                                <SelectItem value="CAMERAS">Cameras</SelectItem>

                                                {/* Home & Living */}
                                                <SelectItem value="HOME">Home</SelectItem>
                                                <SelectItem value="FURNITURE">Furniture</SelectItem>
                                                <SelectItem value="DECOR">Home Decor</SelectItem>
                                                <SelectItem value="KITCHEN">Kitchen</SelectItem>
                                                <SelectItem value="BEDDING">Bedding</SelectItem>
                                                <SelectItem value="CLEANING">Cleaning Supplies</SelectItem>
                                                <SelectItem value="LIGHTING">Lighting</SelectItem>

                                                {/* Health & Personal Care */}
                                                <SelectItem value="HEALTH">Health</SelectItem>
                                                <SelectItem value="PERSONAL_CARE">Personal Care</SelectItem>
                                                <SelectItem value="MEDICAL_SUPPLIES">Medical Supplies</SelectItem>
                                                <SelectItem value="FITNESS">Fitness</SelectItem>
                                                <SelectItem value="SUPPLEMENTS">Supplements</SelectItem>

                                                {/* Baby, Kids & Toys */}
                                                <SelectItem value="BABY">Baby</SelectItem>
                                                <SelectItem value="KIDS">Kids</SelectItem>
                                                <SelectItem value="TOYS">Toys</SelectItem>
                                                <SelectItem value="BABY_PRODUCTS">Baby Products</SelectItem>

                                                {/* Automotive & Industrial */}
                                                <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                                                <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                                                <SelectItem value="AUTO_PARTS">Auto Parts</SelectItem>
                                                <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                                                <SelectItem value="TOOLS">Tools</SelectItem>

                                                {/* Tech & Services */}
                                                <SelectItem value="SOFTWARE">Software</SelectItem>
                                                <SelectItem value="HARDWARE">Hardware</SelectItem>
                                                <SelectItem value="SERVICES">Services</SelectItem>
                                                <SelectItem value="DIGITAL_GOODS">Digital Goods</SelectItem>

                                                {/* Books, Media & Education */}
                                                <SelectItem value="BOOKS">Books</SelectItem>
                                                <SelectItem value="STATIONERY">Stationery</SelectItem>
                                                <SelectItem value="EDUCATION">Education</SelectItem>
                                                <SelectItem value="MUSIC">Music</SelectItem>
                                                <SelectItem value="MOVIES">Movies</SelectItem>
                                                <SelectItem value="ART">Art</SelectItem>

                                                {/* Agriculture & Energy */}
                                                <SelectItem value="AGRICULTURE">Agriculture</SelectItem>
                                                <SelectItem value="FARM_EQUIPMENT">Farm Equipment</SelectItem>
                                                <SelectItem value="SOLAR">Solar</SelectItem>
                                                <SelectItem value="ENERGY">Energy</SelectItem>
                                                <SelectItem value="ELECTRICAL">Electrical</SelectItem>

                                                {/* Real Estate & Construction */}
                                                <SelectItem value="REAL_ESTATE">Real Estate</SelectItem>
                                                <SelectItem value="BUILDING_MATERIALS">Building Materials</SelectItem>
                                                <SelectItem value="CONSTRUCTION">Construction</SelectItem>
                                                <SelectItem value="FURNISHINGS">Furnishings</SelectItem>

                                                {/* Miscellaneous */}
                                                <SelectItem value="PETS">Pets</SelectItem>
                                                <SelectItem value="GARDEN">Garden</SelectItem>
                                                <SelectItem value="SPORTS">Sports</SelectItem>
                                                <SelectItem value="TRAVEL">Travel</SelectItem>
                                                <SelectItem value="STATIONERY_SUPPLIES">Stationery Supplies</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                                <SelectItem value="GENERAL">General</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={productData.description ?? ""}
                                        onChange={(e) =>
                                            setProductData({
                                                ...productData,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="A short, enticing description..."
                                        rows={3}
                                        className="h-24"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Keep it short and clear — customers see this first.
                                    </p>
                                </div>

                                {/* Payment Timing Toggle */}
                                <div className="pt-4 border-t space-y-3">
                                    <Label className="flex flex-col gap-1">
                                        <span className="font-semibold">Payment Timing</span>
                                        <span className="text-xs font-normal text-muted-foreground">
                                            Choose when customers pay for this product
                                        </span>
                                    </Label>
                                    <div className="flex items-center gap-3 bg-background p-3 rounded-md border cursor-pointer hover:border-primary transition-colors"
                                        onClick={() =>
                                            setProductData({
                                                ...productData,
                                                payOnOrder: !productData.payOnOrder,
                                            })
                                        }
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            <div
                                                className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${!productData.payOnOrder
                                                    ? "bg-primary border-primary"
                                                    : "border-muted-foreground"
                                                    }`}
                                            >
                                                {!productData.payOnOrder && (
                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">
                                                Pay On Delivery
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${productData.payOnOrder
                                                    ? "bg-primary border-primary"
                                                    : "border-muted-foreground"
                                                    }`}
                                            >
                                                {productData.payOnOrder && (
                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">
                                                Pay On Order
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sizes */}
                            {Object.values(Category).includes(productData.category as unknown as Category) && (
                                <div className="p-6 rounded-lg border bg-muted/20 space-y-4">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <DollarSign className="h-5 w-5 mr-2 text-primary" />
                                        Sizes
                                    </h3>
                                    {productData.sizes?.map((size, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 bg-background p-3 rounded-md border"
                                        >
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-3">
                                                <Input
                                                    value={size.label}
                                                    onChange={(e) =>
                                                        handleSizeChange(index, "label", e.target.value)
                                                    }
                                                    placeholder="e.g., Small"
                                                    className="h-10"
                                                />
                                                <Input
                                                    type="number"
                                                    value={size.price === 0 ? "" : size.price}
                                                    onChange={(e) =>
                                                        handleSizeChange(index, "price", e.target.value)
                                                    }
                                                    placeholder="Price"
                                                    className="h-10"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSize(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addSize}
                                        className="w-full border-dashed"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add another Size
                                    </Button>
                                </div>
                            )}

                            {/* Add-ons */}
                            {Object.values(Category).includes(productData.category as unknown as Category) && (
                                <div className="p-6 rounded-lg border bg-muted/20 space-y-4">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <Package className="h-5 w-5 mr-2 text-primary" />
                                        Optional Add-ons
                                    </h3>
                                    {productData.addons?.map((addon, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 bg-background p-3 rounded-md border"
                                        >
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-3">
                                                <div className="sm:col-span-3">
                                                    <Input
                                                        value={addon.label}
                                                        onChange={(e) =>
                                                            handleAddonChange(index, "label", e.target.value)
                                                        }
                                                        placeholder="e.g., Extra Meat"
                                                        className="h-10"
                                                    />
                                                </div>
                                                <div className="relative sm:col-span-2">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                                                        ₦
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        value={addon.price === 0 ? "" : addon.price}
                                                        onChange={(e) =>
                                                            handleAddonChange(index, "price", e.target.value)
                                                        }
                                                        placeholder="Price (optional)"
                                                        className="h-10 pl-7"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => removeAddon(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addAddon()}
                                        className="w-full border-dashed"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add custom add-on
                                    </Button>
                                    <div className="mt-4">
                                        <p className="text-sm font-medium mb-2">
                                            Quick Add Common Add-ons:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {["Meat", "Fish", "Water"].map((item) => (
                                                <Button
                                                    key={item}
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addAddon({ label: item })}
                                                >
                                                    {item}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Images */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-lg border bg-muted/20">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Camera className="h-5 w-5 mr-2 text-primary" />
                                    Imagery
                                </h3>
                                <div
                                    className="mt-2 flex justify-center p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <div className="flex text-sm justify-center">
                                            <span className="font-medium text-primary">
                                                Click to upload
                                            </span>
                                            <Input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="sr-only"
                                                onChange={handleImageSelect}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            or drag and drop
                                        </p>
                                    </div>
                                </div>
                                {imagePreviews.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-2">Uploaded Images:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {imagePreviews.map((src, index) => (
                                                <div key={index} className="relative group">
                                                    <Image
                                                        src={src}
                                                        alt={`Product preview ${index + 1}`}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover rounded-md shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <DialogFooter className="p-6 border-t bg-muted/40 flex justify-end gap-3 shrink-0">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} form="product-form">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


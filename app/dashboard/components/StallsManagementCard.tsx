/* eslint-disable */
"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Upload,
    Save,
    X,
    Camera,
    MapPin,
    Star,
    ShoppingCart,
    Store,
    Plus,
    Package,
    DollarSign,
    Eye,
    Edit,
    Trash2,
} from "lucide-react"
import { stallTypeCategories, typeColorMap, formatLabel } from "@/constants/stallTypes"
import type { DashboardData } from "@/types"
import { getStallTypeColor } from "@/constants/stallNames"
import { createStall, deleteStall, updateStall } from "@/lib/server/stall"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

type Stall = DashboardData["userStalls"][0]

export default function StallsManagementCard({
    stalls,
    accessToken,
}: {
    stalls: DashboardData["userStalls"]
    accessToken: string
}) {
    const router = useRouter()
    //const [selectedStall, setSelectedStall
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedStall, setSelectedStall] = useState<Stall | null>(null)
    const [createLoading, setCreateLoading] = useState(false)
    const [editLoading, setEditLoading] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [newStall, setNewStall] = useState({
        name: "",
        description: "",
        type: "",
        area: "",
        city: "",
        state: "",
        landmark: "",
        address: "",
    })
    const [editStall, setEditStall] = useState({
        name: "",
        description: "",
        type: "",
        area: "",
        city: "",
        state: "",
        landmark: "",
        address: "",
    })

    const handleCreateStall = async () => {
        setCreateLoading(true)
        try {
            const formData = new FormData()

            // Append basic stall information
            formData.append("name", newStall.name)
            formData.append("description", newStall.description)
            formData.append("type", newStall.type)
            formData.append("area", newStall.area)
            formData.append("city", newStall.city)
            formData.append("state", newStall.state)
            formData.append("landmark", newStall.landmark)

            // Append images
            images.forEach((image) => {
                formData.append("images", image)
            })

            await createStall(formData, accessToken)

            // Reset after success
            setIsCreateOpen(false)
            setNewStall({
                name: "",
                description: "",
                type: "",
                area: "",
                city: "",
                state: "",
                landmark: "",
                address: "",
            })
            setImages([])
            setImagePreviews([])
            router.refresh()
        } catch (error) {
            console.log("Error creating stall: ", error)
            alert("An error occurred while creating the stall.")
        } finally {
            setCreateLoading(false)
        }
    }

    const handleEditStall = async () => {
        if (!selectedStall) return
        setEditLoading(true)
        try {
            // Create FormData to handle both text data and files
            const formData = new FormData()

            // Append basic stall information
            formData.append("name", editStall.name)
            formData.append("description", editStall.description)
            formData.append("type", editStall.type)
            formData.append("area", editStall.area)
            formData.append("city", editStall.city)
            formData.append("state", editStall.state)
            formData.append("landmark", editStall.landmark)
            formData.append("address", editStall.address)

            // Append new images (if any)
            images.forEach((image) => {
                formData.append(`images`, image)
            })

            const result = await updateStall(selectedStall.id, formData, accessToken)

            if (result.success) {
                setIsEditOpen(false)
                // Reset image states
                setImages([])
                setImagePreviews([])
            } else {
                const errorData = result.message
                console.log("Failed to update stall:", errorData)
                alert("Failed to update stall. Please try again.")
            }
        } catch (error) {
            console.log("Error updating stall: ", error)
            alert("An error occurred while updating the stall.")
        } finally {
            setEditLoading(false)
        }
    }

    // Also update the dialog close handlers to properly reset state
    const handleCreateDialogClose = () => {
        setIsCreateOpen(false)
        setNewStall({
            name: "",
            description: "",
            type: "",
            area: "",
            city: "",
            state: "",
            landmark: "",
            address: "",
        })
        setImages([])
        setImagePreviews([])
    }

    const handleEditDialogClose = () => {
        setIsEditOpen(false)
        setImages([])
        setImagePreviews([])
    }

    const openEdit = (stall: Stall) => {
        setEditStall({
            name: stall.name,
            description: stall.description || "",
            type: stall.type,
            area: stall.area || "",
            city: stall.city || "",
            state: stall.state || "",
            landmark: stall.landmark || "",
            address: stall.address || "",
        })
        setSelectedStall(stall)
        setIsEditOpen(true)
    }

    const openDelete = (stall: Stall) => {
        setSelectedStall(stall)
        setIsDeleteOpen(true)
    }

    const handleDeleteStall = async () => {
        if (!selectedStall) return
        setDeleteLoading(true)
        try {
            const response = await deleteStall(selectedStall.id, accessToken)
            if (response.success) {
                setIsDeleteOpen(false)
                router.refresh()
            } else {
                alert("Failed to delete stall")
            }
        } catch (error) {
            console.log("Error deleting stall: ", error)
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const validFiles = files.filter(
            (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024, // 5MB limit
        )

        if (validFiles.length !== files.length) {
            alert("Some files were skipped. Only images under 5MB are allowed.")
        }

        if (images.length + validFiles.length > 5) {
            alert("Maximum 5 images allowed")
            return
        }

        const newImages = [...images, ...validFiles]
        setImages(newImages)

        // Create previews
        const newPreviews = [...imagePreviews]
        validFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                newPreviews.push(e.target?.result as string)
                if (newPreviews.length === images.length + validFiles.length) {
                    setImagePreviews(newPreviews)
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = imagePreviews.filter((_, i) => i !== index)
        setImages(newImages)
        setImagePreviews(newPreviews)
    }

    return (
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3 px-4 sm:pb-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-lg sm:text-xl">My Stalls</CardTitle>
                        <CardDescription className="text-muted-foreground text-xs sm:text-sm mt-1">
                            Manage and monitor your business stalls
                        </CardDescription>
                    </div>
                    <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 w-full sm:w-auto text-sm"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Stall
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="px-4 sm:px-6">
                {stalls.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                        {stalls.map((stall) => (
                            <div
                                key={stall.id}
                                className="border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-5 hover:shadow-md hover:shadow-black/5 transition-all duration-300 cursor-pointer group hover:bg-muted/30"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2 mb-2">
                                            <h4 className="font-semibold text-foreground group-hover:text-foreground/90 text-base sm:text-lg truncate max-w-[180px] sm:max-w-none">
                                                {stall.name}
                                            </h4>
                                            <Badge
                                                variant="outline"
                                                className={`px-3 py-1 rounded-full border ${getStallTypeColor(stall.type)}`}
                                            >
                                                {formatLabel(stall.type)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                                            <span className="truncate">
                                                {stall.area}, {stall.city}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 sm:space-x-2 self-end sm:self-start">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-muted/50 h-8 w-8 p-0"
                                            onClick={() => router.push(`/stall/${stall.id}`)}
                                        >
                                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-muted/50 h-8 w-8 p-0"
                                            onClick={() => openEdit(stall)}
                                        >
                                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                                            onClick={() => openDelete(stall)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                                    <div className="text-center p-3 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg sm:rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mx-auto mb-1 sm:mb-2" />
                                        <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-0.5 sm:mb-1 group-hover:scale-105 transition-transform duration-300">
                                            {stall.products}
                                        </div>
                                        <div className="text-xs sm:text-sm font-semibold text-blue-700/80">Products</div>
                                        <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-1 sm:mt-2 rounded-full"></div>
                                    </div>

                                    <div className="text-center p-3 sm:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg sm:rounded-xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 mx-auto mb-1 sm:mb-2" />
                                        <div className="text-lg sm:text-2xl font-bold text-emerald-600 mb-0.5 sm:mb-1 group-hover:scale-105 transition-transform duration-300">
                                            {stall.orders}
                                        </div>
                                        <div className="text-xs sm:text-sm font-semibold text-emerald-700/80">Orders</div>
                                        <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mt-1 sm:mt-2 rounded-full"></div>
                                    </div>

                                    <div className="text-center p-3 sm:p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg sm:rounded-xl border border-amber-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mx-auto mb-1 sm:mb-2" />
                                        <div className="text-lg sm:text-2xl font-bold text-amber-600 mb-0.5 sm:mb-1 group-hover:scale-105 transition-transform duration-300 truncate px-1">
                                            ₦{stall.revenue.toLocaleString()}
                                        </div>
                                        <div className="text-xs sm:text-sm font-semibold text-amber-700/80">Revenue</div>
                                        <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-1 sm:mt-2 rounded-full"></div>
                                    </div>

                                    <div className="text-center p-3 sm:p-5 bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-lg sm:rounded-xl border border-violet-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 mx-auto mb-1 sm:mb-2" />
                                        <div className="text-lg sm:text-2xl font-bold text-violet-600 mb-0.5 sm:mb-1 group-hover:scale-105 transition-transform duration-300">
                                            {stall.rating}
                                        </div>
                                        <div className="text-xs sm:text-sm font-semibold text-violet-700/80">Rating</div>
                                        <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-violet-400 to-violet-600 mx-auto mt-1 sm:mt-2 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                        <Store className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">No Stalls Yet</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-2">
                            You haven&apos;t created any stalls yet. Set up your first stall to start selling!
                        </p>
                        <Button size="sm" className="mt-4 bg-primary hover:bg-primary/90" onClick={() => setIsCreateOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Stall
                        </Button>
                    </div>
                )}
            </CardContent>

            {/* Create Stall Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={handleCreateDialogClose}>
                <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[720px] max-h-[90vh] overflow-y-auto p-0">
                    <div className="bg-gradient-to-r from-amber-950 to-amber-700 p-4 sm:p-6 text-white rounded-t-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Store className="h-5 w-5 sm:h-6 sm:w-6 text-amber-100" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg sm:text-2xl font-bold">Create New Stall</DialogTitle>
                                <DialogDescription className="text-amber-100 text-xs sm:text-sm">
                                    Set up your business presence
                                </DialogDescription>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center space-x-2">
                                <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
                                <h3 className="text-base sm:text-lg font-semibold">Stall Images</h3>
                                <span className="text-xs sm:text-sm text-muted-foreground">({images.length}/5)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 border-border bg-muted">
                                            <img
                                                src={preview || "/placeholder.svg"}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200"
                                        >
                                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                    </div>
                                ))}
                                {images.length < 5 && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-lg sm:rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-amber-400 bg-muted/50 hover:bg-amber-50 transition-all duration-300 flex flex-col items-center justify-center"
                                    >
                                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-1" />
                                        <span className="text-[10px] sm:text-sm font-medium text-muted-foreground">Add</span>
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Upload up to 5 images. Max 5MB each.</p>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center space-x-2">
                                <Store className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
                                <h3 className="text-base sm:text-lg font-semibold">Basic Information</h3>
                            </div>
                            <div className="grid gap-3 sm:gap-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="name" className="text-xs sm:text-sm font-medium flex items-center space-x-1">
                                        <span>Stall Name</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newStall.name}
                                        onChange={(e) => setNewStall({ ...newStall, name: e.target.value })}
                                        placeholder="Enter stall name"
                                        className="h-10 sm:h-12 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-sm font-medium flex items-center space-x-1">
                                        <span>Stall Type</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={newStall.type} onValueChange={(value) => setNewStall({ ...newStall, type: value })}>
                                        <SelectTrigger className="h-12 bg-background border-border">
                                            <SelectValue placeholder="What type of stall is this?" />
                                        </SelectTrigger>

                                        <SelectContent className="bg-background border-border max-h-[400px]">
                                            {stallTypeCategories.map((category, categoryIndex) => (
                                                <div key={categoryIndex}>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                        {category.label}
                                                    </div>

                                                    {category.types.map((type) => (
                                                        <SelectItem key={type} value={type} className="hover:bg-muted">
                                                            <div className="flex items-center space-x-2">
                                                                <div
                                                                    className="w-3 h-3 rounded-full"
                                                                    style={{ backgroundColor: typeColorMap[type] }}
                                                                ></div>
                                                                <span>{formatLabel(type)}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="description" className="text-xs sm:text-sm font-medium">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={newStall.description}
                                        onChange={(e) => setNewStall({ ...newStall, description: e.target.value })}
                                        placeholder="Describe your stall..."
                                        className="min-h-[80px] text-sm resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                                <h3 className="text-base sm:text-lg font-semibold">Location Details</h3>
                            </div>
                            <div className="grid gap-3 sm:gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <Label htmlFor="area" className="text-xs sm:text-sm font-medium">
                                            Area/District
                                        </Label>
                                        <Input
                                            id="area"
                                            value={newStall.area}
                                            onChange={(e) => setNewStall({ ...newStall, area: e.target.value })}
                                            placeholder="e.g., Victoria Island"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <Label htmlFor="city" className="text-xs sm:text-sm font-medium">
                                            City
                                        </Label>
                                        <Input
                                            id="city"
                                            value={newStall.city}
                                            onChange={(e) => setNewStall({ ...newStall, city: e.target.value })}
                                            placeholder="e.g., Lagos"
                                            className="h-10 sm:h-11 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="state" className="text-xs sm:text-sm font-medium">
                                        State
                                    </Label>
                                    <Input
                                        id="state"
                                        value={newStall.state}
                                        onChange={(e) => setNewStall({ ...newStall, state: e.target.value })}
                                        placeholder="e.g., Lagos State"
                                        className="h-10 sm:h-11 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="landmark" className="text-xs sm:text-sm font-medium">
                                        Nearby Landmark
                                    </Label>
                                    <Input
                                        id="landmark"
                                        value={newStall.landmark}
                                        onChange={(e) => setNewStall({ ...newStall, landmark: e.target.value })}
                                        placeholder="e.g., Near Shoprite Mall"
                                        className="h-10 sm:h-11 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t bg-muted/20 p-3 sm:p-6 rounded-b-lg">
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3">
                            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                                Fields with <span className="text-red-500">*</span> are required
                            </p>
                            <div className="flex space-x-2 sm:space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={handleCreateDialogClose}
                                    disabled={createLoading}
                                    className="flex-1 sm:flex-none px-4 h-9 sm:h-11 text-sm bg-transparent"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateStall}
                                    disabled={createLoading || !newStall.name || !newStall.type}
                                    className="flex-1 sm:flex-none px-4 h-9 sm:h-11 bg-primary text-sm"
                                >
                                    {createLoading ? "Creating..." : "Create Stall"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Stall Dialog */}
            <Dialog open={isEditOpen} onOpenChange={handleEditDialogClose}>
                <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto p-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-950 to-amber-700 p-6 text-white rounded-t-lg">
                        <div className="relative">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Store className="h-6 w-6 text-amber-100" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold">Edit Stall</DialogTitle>
                                    <DialogDescription className="text-amber-100 text-sm">
                                        Update the details of your stall
                                    </DialogDescription>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="space-y-8 p-6">
                        {/* Stall Images Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Camera className="h-5 w-5 text-amber-700" />
                                <h3 className="text-lg font-semibold">Stall Images</h3>
                                <span className="text-sm text-muted-foreground">({images.length}/5)</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {(imagePreviews.length > 0 ? imagePreviews : (selectedStall?.images ?? [])).map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-border bg-muted">
                                            <Image
                                                src={String(preview).length > 0 ? `${API_BASE_URL}${String(preview)}` : ""}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                width={300}
                                                height={300}
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                {images.length < 5 && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-amber-400 bg-muted/50 hover:bg-amber-50 transition-all duration-300 flex flex-col items-center justify-center group"
                                    >
                                        <Upload className="h-8 w-8 text-muted-foreground group-hover:text-amber-700 transition-colors mb-2" />
                                        <span className="text-sm font-medium text-muted-foreground group-hover:text-amber-700 transition-colors">
                                            Add Image
                                        </span>
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <p className="text-xs text-muted-foreground">
                                Upload up to 5 images. Max size: 5MB per image. Supported formats: JPG, PNG, WebP
                            </p>
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Store className="h-5 w-5 text-amber-700" />
                                <h3 className="text-lg font-semibold">Basic Information</h3>
                            </div>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name" className="text-sm font-medium flex items-center space-x-1">
                                        <span>Stall Name</span>
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="edit-name"
                                        value={editStall.name}
                                        onChange={(e) => setEditStall({ ...editStall, name: e.target.value })}
                                        placeholder="Enter a catchy name for your stall"
                                        className="h-12 bg-background border-border transition-all duration-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-type" className="text-sm font-medium flex items-center space-x-1">
                                        <span>Stall Type</span>
                                        <span className="text-red-500">*</span>
                                    </Label>

                                    <Select value={editStall.type} onValueChange={(value) => setEditStall({ ...editStall, type: value })}>
                                        <SelectTrigger className="h-12 bg-background border-border">
                                            <SelectValue placeholder="What type of stall is this?" />
                                        </SelectTrigger>

                                        <SelectContent className="bg-background border-border max-h-[400px]">
                                            {stallTypeCategories.map((category, categoryIndex) => (
                                                <div key={categoryIndex}>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                        {category.label}
                                                    </div>

                                                    {category.types.map((type) => (
                                                        <SelectItem key={type} value={type} className="hover:bg-muted">
                                                            <div className="flex items-center space-x-2">
                                                                <div
                                                                    className="w-3 h-3 rounded-full"
                                                                    style={{ backgroundColor: typeColorMap[type] }}
                                                                ></div>
                                                                <span>{formatLabel(type)}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-description" className="text-sm font-medium">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="edit-description"
                                        value={editStall.description}
                                        onChange={(e) =>
                                            setEditStall({
                                                ...editStall,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Describe what makes your stall special..."
                                        className="min-h-[100px] bg-background border-border transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-amber-600" />
                                <h3 className="text-lg font-semibold">Location Details</h3>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-area" className="text-sm font-medium">
                                            Area/District
                                        </Label>
                                        <Input
                                            id="edit-area"
                                            value={editStall.area}
                                            onChange={(e) => setEditStall({ ...editStall, area: e.target.value })}
                                            placeholder="e.g., Victoria Island"
                                            className="h-11 bg-background border-border transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-city" className="text-sm font-medium">
                                            City
                                        </Label>
                                        <Input
                                            id="edit-city"
                                            value={editStall.city}
                                            onChange={(e) => setEditStall({ ...editStall, city: e.target.value })}
                                            placeholder="e.g., Lagos"
                                            className="h-11 bg-background border-border transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-state" className="text-sm font-medium">
                                        State
                                    </Label>
                                    <Input
                                        id="edit-state"
                                        value={editStall.state}
                                        onChange={(e) => setEditStall({ ...editStall, state: e.target.value })}
                                        placeholder="e.g., Lagos State"
                                        className="h-11 bg-background border-border transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-landmark" className="text-sm font-medium">
                                        Nearby Landmark
                                    </Label>
                                    <Input
                                        id="edit-landmark"
                                        value={editStall.landmark}
                                        onChange={(e) => setEditStall({ ...editStall, landmark: e.target.value })}
                                        placeholder="e.g., Near Shoprite Mall"
                                        className="h-11 bg-background border-border transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t bg-muted/20 p-4 sm:p-6 rounded-b-lg">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <p className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
                                Fields marked with <span className="text-red-500">*</span> are required
                            </p>
                            <div className="flex justify-center sm:justify-end space-x-2 sm:space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditOpen(false)
                                        setImages([])
                                        setImagePreviews([])
                                    }}
                                    disabled={editLoading}
                                    className="px-4 sm:px-6 h-10 sm:h-11 hover:bg-muted/50 transition-colors duration-200 border-border min-w-[100px]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleEditStall}
                                    disabled={editLoading || !editStall.name || !editStall.type}
                                    className="px-4 sm:px-6 h-10 sm:h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-200 min-w-[100px]"
                                >
                                    {editLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Save className="h-4 w-4" />
                                            <span>Save Changes</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Delete Stall</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                            Are you sure you want to delete &quot;{selectedStall?.name}&quot;? This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            disabled={deleteLoading}
                            className="text-sm h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteStall}
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
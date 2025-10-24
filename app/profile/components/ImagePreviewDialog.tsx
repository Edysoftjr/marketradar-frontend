import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
    Camera,
    Upload,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedImage: string | null;
    onConfirm: () => void;
    onCancel: () => void;
}

function ImagePreviewDialog({
    isOpen,
    onOpenChange,
    selectedImage,
    onConfirm,
    onCancel,
}: ImagePreviewDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 bg-background/95 backdrop-blur-md shadow-2xl max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Preview Profile Picture
                    </DialogTitle>
                    <DialogDescription>
                        Review your new profile picture before uploading
                    </DialogDescription>
                </DialogHeader>

                {selectedImage && (
                    <div className="flex justify-center py-6">
                        <div className="relative w-48 h-48">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-0.5">
                                <div className="w-full h-full rounded-full bg-background overflow-hidden shadow-lg">
                                    <Image
                                        src={selectedImage}
                                        alt="Preview"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="flex gap-3">
                    <Button variant="outline" onClick={onCancel} className="flex-1">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Picture
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ImagePreviewDialog
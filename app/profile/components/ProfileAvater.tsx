import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react"

interface ProfileAvatarProps {
    userName: string;
    selectedImage: string | null;
    onImageUpload?: () => void;
    isOwner: boolean;
}

function ProfileAvatar({
    userName,
    selectedImage,
    onImageUpload,
    isOwner,
}: ProfileAvatarProps) {
    return (
        <div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 mb-6 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-0.5">
                <div className="w-full h-full rounded-full bg-background overflow-hidden shadow-lg relative">
                    <Image
                        src={selectedImage || "/uploads/defaults/user.jpg"}
                        alt={userName}
                        fill
                        priority
                        className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            </div>

            {/* Only show upload button if user is the profile owner */}
            {isOwner && onImageUpload && (
                <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 md:w-10 md:h-10 p-0 shadow-lg bg-background hover:bg-muted border-2 border-background transition-all duration-300 group-hover:shadow-xl active:scale-95"
                    onClick={onImageUpload}
                >
                    <Camera className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
            )}
        </div>
    );
}

export default ProfileAvatar
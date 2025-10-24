"use client"

import { useState } from "react";
import React, { ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Star,
    Trash2,
    MessageSquare,
    Send,
    MoreHorizontal,
    Edit2,
    Check,
    X,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
    <div className="relative inline-block">{children}</div>
);

type DropdownMenuTriggerProps = {
    children: React.ReactNode;
} & ComponentPropsWithoutRef<"div">;

const DropdownMenuTrigger = ({
    children,
    ...props
}: DropdownMenuTriggerProps) => <div {...props}>{children}</div>;

type DropdownMenuContentProps = {
    children: React.ReactNode;
} & ComponentPropsWithoutRef<"div">;

const DropdownMenuContent = ({
    children,
    className = "",
    ...props
}: DropdownMenuContentProps) => (
    <div
        {...props}
        className={`absolute right-0 mt-2 w-40 rounded-xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-lg z-50 py-2 ${className}`}
    >
        {children}
    </div>
);

type DropdownMenuItemProps = {
    children: React.ReactNode;
} & ComponentPropsWithoutRef<"button">;

const DropdownMenuItem = ({
    children,
    className = "",
    ...props
}: DropdownMenuItemProps) => (
    <button
        {...props}
        className={`flex items-center w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors ${className}`}
    >
        {children}
    </button>
);


export interface Comment {
    id: string;
    content: string;
    rating?: number;
    createdAt: string;
    user: {
        name: string;
        images?: string[];
    };
}

interface CommentsSectionProps {
    comments: Comment[];
    onAddComment: (comment: string, rating?: number) => void;
    onEditComment?: (id: string, comment: string, rating?: number) => void;
    onDeleteComment?: (id: string) => void;
    loading: boolean;
    isOwner: boolean;
    currentUserId?: string;
}

export default function CommentsSection({
    comments,
    onAddComment,
    onEditComment,
    onDeleteComment,
    loading,
    isOwner,
}: CommentsSectionProps) {
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!newComment.trim()) return;
        onAddComment(newComment, newRating > 0 ? newRating : undefined);
        setNewComment("");
        setNewRating(0);
    };

    const handleEditStart = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
        setEditRating(comment.rating || 0);
        setDropdownOpen(null);
    };

    const handleEditSave = () => {
        if (editingCommentId && onEditComment) {
            onEditComment(
                editingCommentId,
                editContent,
                editRating > 0 ? editRating : undefined
            );
            setEditingCommentId(null);
            setEditContent("");
            setEditRating(0);
        }
    };

    const handleEditCancel = () => {
        setEditingCommentId(null);
        setEditContent("");
        setEditRating(0);
    };

    const handleDelete = (commentId: string) => {
        if (onDeleteComment) {
            onDeleteComment(commentId);
        }
        setDropdownOpen(null);
    };

    const StarRating = ({
        rating,
        onRatingChange,
        interactive = false,
    }: {
        rating: number;
        onRatingChange?: (rating: number) => void;
        interactive?: boolean;
    }) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => interactive && onRatingChange?.(star)}
                    className={`transition-all duration-200 ${interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
                        }`}
                    disabled={!interactive}
                >
                    <Star
                        size={14}
                        className={`transition-colors ${star <= rating
                            ? "text-yellow-500 fill-current"
                            : "text-muted-foreground/30"
                            }`}
                    />
                </button>
            ))}
        </div>
    );

    return (
        <Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-md rounded-xl">
            <CardHeader className="pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center">
                        <MessageSquare size={18} className="text-muted-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">
                            Reviews & Feedback
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground mt-1">
                            {comments.length} {comments.length === 1 ? "review" : "reviews"}{" "}
                            from customers
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-8">
                {/* Add Comment Form */}
                <div className="space-y-6 p-6 rounded-xl bg-muted/20 border border-border/30">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            Share your experience
                        </Label>
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Tell others about your experience with this stall..."
                            rows={4}
                            className="rounded-xl border-border/50 focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                                Rating
                            </Label>
                            <StarRating
                                rating={newRating}
                                onRatingChange={setNewRating}
                                interactive={true}
                            />
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !newComment.trim()}
                            className="rounded-xl px-6 shadow-sm"
                        >
                            {loading ? (
                                "Publishing..."
                            ) : (
                                <>
                                    <Send size={14} className="mr-2" />
                                    Publish Review
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div
                                key={comment.id}
                                className={`group relative ${index !== 0 ? "pt-6 border-t border-border/30" : ""
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-10 h-10 mt-0.5">
                                        <AvatarImage
                                            src={comment.user.images?.length
                                                ? `${API_BASE_URL}${comment.user.images[0]}`
                                                : "/rest2.jpg"}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                        <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                                            {comment.user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium text-sm text-foreground">
                                                        {comment.user.name}
                                                    </span>
                                                    {comment.rating && (
                                                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-card/60 border border-yellow-200/50">
                                                            <StarRating rating={comment.rating} />
                                                            <span className="text-xs font-medium text-yellow-100">
                                                                {comment.rating}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(comment.createdAt).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            {/* Comment actions */}
                                            {(comment.user.name === "Current User" || !isOwner) &&
                                                (onEditComment || onDeleteComment) && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg h-8 w-8 p-0"
                                                                onClick={() =>
                                                                    setDropdownOpen(
                                                                        dropdownOpen === comment.id
                                                                            ? null
                                                                            : comment.id
                                                                    )
                                                                }
                                                            >
                                                                <MoreHorizontal size={14} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        {dropdownOpen === comment.id && (
                                                            <DropdownMenuContent>
                                                                {onEditComment && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleEditStart(comment)}
                                                                    >
                                                                        <Edit2 size={12} className="mr-2" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {onDeleteComment && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDelete(comment.id)}
                                                                        className="text-red-600 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 size={12} className="mr-2" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        )}
                                                    </DropdownMenu>
                                                )}
                                        </div>

                                        {editingCommentId === comment.id ? (
                                            <div className="space-y-4">
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    rows={3}
                                                    className="rounded-xl border-border/50"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <StarRating
                                                        rating={editRating}
                                                        onRatingChange={setEditRating}
                                                        interactive={true}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleEditCancel}
                                                            className="rounded-lg"
                                                        >
                                                            <X size={12} className="mr-1" />
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={handleEditSave}
                                                            className="rounded-lg"
                                                        >
                                                            <Check size={12} className="mr-1" />
                                                            Save
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-foreground leading-relaxed">
                                                {comment.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 bg-muted/80 rounded-xl mx-auto mb-4 flex items-center justify-center">
                                <MessageSquare size={20} className="text-muted-foreground" />
                            </div>
                            <h3 className="text-base font-medium text-foreground mb-2">
                                No reviews yet
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Be the first to share your experience with this stall
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

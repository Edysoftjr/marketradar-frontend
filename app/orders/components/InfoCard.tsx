"use client"

import React from "react"

export const InfoCard = ({ icon: Icon, label, value, className = "" }: any) => (
    <div className={`bg-muted rounded-lg p-3 ${className}`}>
        <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <p className="font-semibold text-foreground">{value || "N/A"}</p>
    </div>
)

InfoCard.displayName = "InfoCard"
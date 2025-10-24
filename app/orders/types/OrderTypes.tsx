export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product?: {
        name: string;
        description?: string;
        stall?: {
            id: string;
            name: string;
            landmark?: string;
            latitude: number;
            longitude: number;
        };
    };
    size?: {
        label: string;
        price: number;
    };
    addons?: Array<{
        label: string;
        price: number;
    }>;
}

export interface Geolocation {
    userLatitude: number;
    userLongitude: number;
    vendorLatitude: number;
    vendorLongitude: number;
}

export interface UserInfo {
    id: string;
    name: string;
    phoneNumber?: string | null;
    latitude?: number;
    longitude?: number;
}

export interface PaymentAuthorization {
    bin: string;
    bank: string;
    brand: string;
    last4: string;
    channel: string;
    card_type: string;
    authorization_code: string;
}

export interface PaymentMeta {
    id: number;
    amount: number;
    status: string;
    channel: string;
    currency: string;
    reference: string;
    authorization?: PaymentAuthorization;
    gateway_response?: string;
}

export interface Order {
    id: string;
    status: string;
    paymentStatus: string;
    paymentChannel?: string;
    total: number;
    isUser: boolean;
    isVendor: boolean;
    createdAt: string;
    paidAt?: string;
    reference?: string;
    transactionId?: string;
    userPhone: number;
    items?: OrderItem[];
    geolocation?: Geolocation;
    user?: UserInfo;
    paymentMeta?: PaymentMeta;
    deliveryStatus?: "IDLE" | "IN_TRANSIT" | "PAUSED" | "CANCELLED";
}

export interface OrderDetailsProps {
    order: Order;
    onBack: () => void;
    accessToken: string;
    isVendorOrder: boolean;
    isUserOrder: boolean;
    onRefresh?: () => void;
}

export type ViewMode = "compact" | "detailed";

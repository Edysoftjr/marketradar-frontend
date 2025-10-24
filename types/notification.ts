export enum NotificationType {
  ORDER = 'ORDER',
  CHAT = 'CHAT',
  SOCIAL = 'SOCIAL',
  SYSTEM = 'SYSTEM'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    orderId?: string;
    chatId?: string;
    postId?: string;
    userId?: string;
    [key: string]: any;
  };
  metadata?: {
    priority?: 'high' | 'medium' | 'low';
    category?: string;
    action?: {
      type: string;
      url?: string;
      payload?: any;
    };
  };
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

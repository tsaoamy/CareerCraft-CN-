export type NotificationType =
  | 'resume'
  | 'jd'
  | 'interview'
  | 'application'
  | 'product'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  resumeComplete: boolean;
  jdAnalysis: boolean;
  interviewScore: boolean;
  productUpdates: boolean;
  industryNews: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  resumeComplete: true,
  jdAnalysis: true,
  interviewScore: true,
  productUpdates: true,
  industryNews: false,
};

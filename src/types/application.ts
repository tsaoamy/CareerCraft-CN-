/** 投递渠道 */
export type ApplicationPlatform =
  | 'boss'
  | 'liepin'
  | 'lagou'
  | 'linkedin'
  | 'official'
  | 'referral'
  | 'campus'
  | 'other';

/** 投递状态 */
export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface ApplicationEvent {
  id: string;
  date: string;
  type: 'note' | 'status_change' | 'interview' | 'follow_up';
  content: string;
}

export interface JobApplication {
  id: string;
  company: string;
  title: string;
  platform: ApplicationPlatform;
  status: ApplicationStatus;
  jdText?: string;
  matchScore?: number;
  salary?: string;
  location?: string;
  appliedAt?: string;
  notes?: string;
  events: ApplicationEvent[];
  createdAt: string;
  updatedAt: string;
}

export const PLATFORM_LABELS: Record<ApplicationPlatform, string> = {
  boss: 'Boss 直聘',
  liepin: '猎聘',
  lagou: '拉勾',
  linkedin: 'LinkedIn',
  official: '官网投递',
  referral: '内推',
  campus: '校招',
  other: '其他',
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: '待投递',
  applied: '已投递',
  screening: '简历筛选',
  interview: '面试中',
  offer: '已获 Offer',
  rejected: '已拒绝',
  withdrawn: '已撤回',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  wishlist: 'bg-[#f5f5f7] text-apple-text-secondary',
  applied: 'bg-[#e8f4fd] text-apple-blue',
  screening: 'bg-[#f4f1fa] text-apple-purple',
  interview: 'bg-[#fff5e5] text-apple-orange',
  offer: 'bg-[#e8f8ee] text-apple-green',
  rejected: 'bg-[#ffebee] text-apple-red',
  withdrawn: 'bg-[#f5f5f7] text-apple-text-secondary',
};

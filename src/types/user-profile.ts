/** 用户个人资料（用户主动填写并保存，不自动覆盖） */
export interface UserProfileSettings {
  displayName: string;
  /** 上传的头像（data URL） */
  avatarUrl: string;
  /** 无上传头像时的显示字符（自动取自名称首字） */
  avatarChar: string;
  /** 无上传头像时的渐变 id */
  avatarGradient: string;
  bio: string;
  phone: string;
  location: string;
  targetRole: string;
  salaryMin: string;
  salaryMax: string;
  updatedAt: string;
}

export const AVATAR_GRADIENTS = [
  { id: 'blue-purple', from: '#0071e3', to: '#bf5af2', label: '蓝紫' },
  { id: 'purple-pink', from: '#8944ab', to: '#ff375f', label: '紫粉' },
  { id: 'green-teal', from: '#34c759', to: '#5ac8fa', label: '青绿' },
  { id: 'orange-red', from: '#ff9f0a', to: '#ff375f', label: '橙红' },
  { id: 'indigo-blue', from: '#5856d6', to: '#0071e3', label: '靛蓝' },
] as const;

export const EMPTY_PROFILE: UserProfileSettings = {
  displayName: '',
  avatarUrl: '',
  avatarChar: '',
  avatarGradient: 'blue-purple',
  bio: '',
  phone: '',
  location: '',
  targetRole: '',
  salaryMin: '',
  salaryMax: '',
  updatedAt: '',
};

/** 基于素材库生成的参考提示（仅展示，不写入表单） */
export interface ProfileHints {
  hasData: boolean;
  experienceCount: number;
  skillCount: number;
  topSkills: string[];
  experienceTitles: string[];
  bioSuggestion: string | null;
  targetRoleSuggestion: string | null;
  locationSuggestion: string | null;
}

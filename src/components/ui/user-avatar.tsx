'use client';

import { AVATAR_GRADIENTS } from '@/types/user-profile';
import type { UserProfileSettings } from '@/types/user-profile';
import type { Locale } from '@/lib/i18n/translations';
import { getAvatarFallbackChar, translations } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  profile: Pick<UserProfileSettings, 'avatarUrl' | 'avatarChar' | 'avatarGradient'>;
  displayName?: string;
  locale?: Locale;
  className?: string;
  textClassName?: string;
}

export function UserAvatar({
  profile,
  displayName = '',
  locale = 'zh',
  className,
  textClassName,
}: UserAvatarProps) {
  const char = getAvatarFallbackChar(displayName, profile.avatarChar, locale);
  const gradient = AVATAR_GRADIENTS.find((g) => g.id === profile.avatarGradient) ?? AVATAR_GRADIENTS[0];
  const alt = displayName || translations[locale].common.avatarAlt;

  if (profile.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatarUrl}
        alt={alt}
        className={cn('object-cover', className)}
      />
    );
  }

  return (
    <div
      className={cn('flex items-center justify-center text-white font-bold', className)}
      style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
    >
      <span className={textClassName}>{char}</span>
    </div>
  );
}

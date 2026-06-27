import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
  className?: string;
}

export const FashionIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M14 6C14 6 12 10 8 11L10 26H30L32 11C28 10 26 6 26 6L22 9H18L14 6Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M16 9C16 9 17 14 20 14C23 14 24 9 24 9" stroke={color} strokeWidth="1.8"/>
    <path d="M10 26L9 34H31L30 26" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

export const FootwearIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M6 28C6 28 8 20 14 18L26 20C30 20 34 22 34 25V28C34 28 22 30 14 30C10 30 6 29.2 6 28Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M14 18V14C14 12 16 10 20 10L24 14L26 20" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M20 28V30" stroke={color} strokeWidth="1.8"/>
    <path d="M26 27V30" stroke={color} strokeWidth="1.8"/>
  </svg>
);

export const HomeIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M6 18L20 7L34 18V34H24V26H16V34H6V18Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

export const BeddingIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="5" y="22" width="30" height="10" rx="2" stroke={color} strokeWidth="1.8"/>
    <path d="M5 22V18C5 16.9 5.9 16 7 16H33C34.1 16 35 16.9 35 18V22" stroke={color} strokeWidth="1.8"/>
    <ellipse cx="13" cy="16" rx="4" ry="3" stroke={color} strokeWidth="1.8"/>
    <ellipse cx="27" cy="16" rx="4" ry="3" stroke={color} strokeWidth="1.8"/>
    <line x1="5" y1="26" x2="35" y2="26" stroke={color} strokeWidth="1.8"/>
  </svg>
);

export const KitchenIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="22" r="10" stroke={color} strokeWidth="1.8"/>
    <path d="M20 12V8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 9C16 9 14 12 16 14" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M20 22H26" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="20" cy="22" r="2" fill={color}/>
  </svg>
);

export const BabyIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="12" r="5" stroke={color} strokeWidth="1.8"/>
    <path d="M12 34V28C12 24.7 15.6 22 20 22C24.4 22 28 24.7 28 28V34" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 30H12M28 30H32" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const BeautyIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M16 8H24V14L26 18V32C26 33.1 25.1 34 24 34H16C14.9 34 14 33.1 14 32V18L16 14V8Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M14 18H26" stroke={color} strokeWidth="1.8"/>
    <path d="M16 8C16 8 18 6 20 6C22 6 24 8 24 8" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="20" cy="26" r="3" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const HealthIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 34C20 34 6 26 6 16C6 12.1 9.1 9 13 9C16 9 18.6 10.8 20 13.4C21.4 10.8 24 9 27 9C30.9 9 34 12.1 34 16C34 26 20 34 20 34Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

export const FitnessIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="4" y="17" width="5" height="6" rx="1.5" stroke={color} strokeWidth="1.8"/>
    <rect x="31" y="17" width="5" height="6" rx="1.5" stroke={color} strokeWidth="1.8"/>
    <rect x="10" y="14" width="5" height="12" rx="1.5" stroke={color} strokeWidth="1.8"/>
    <rect x="25" y="14" width="5" height="12" rx="1.5" stroke={color} strokeWidth="1.8"/>
    <line x1="15" y1="20" x2="25" y2="20" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

export const AssistiveIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="9" r="4" stroke={color} strokeWidth="1.8"/>
    <path d="M16 34L14 20H12C10.9 20 10 19.1 10 18V15L20 14L30 15V18C30 19.1 29.1 20 28 20H26L24 34" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M16 34H24" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const GiftIcon = ({ size = 40, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="7" y="18" width="26" height="16" rx="2" stroke={color} strokeWidth="1.8"/>
    <rect x="5" y="13" width="30" height="6" rx="1.5" stroke={color} strokeWidth="1.8"/>
    <line x1="20" y1="13" x2="20" y2="34" stroke={color} strokeWidth="1.8"/>
    <path d="M20 13C20 13 15 13 15 9C15 7 17 6 19 7L20 13Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M20 13C20 13 25 13 25 9C25 7 23 6 21 7L20 13Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Feature Icons
export const QualityIcon = ({ size = 48, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2"/>
    <path d="M24 12L26.5 19H34L28 23.5L30.5 31L24 26.5L17.5 31L20 23.5L14 19H21.5L24 12Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

export const VendorIcon = ({ size = 48, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M8 14H40L36 28H12L8 14Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M6 8H10L12 14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="17" cy="36" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="31" cy="36" r="3" stroke={color} strokeWidth="2"/>
    <path d="M18 22H30M14 18H34" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const DeliveryIcon = ({ size = 48, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M6 16H30V34H6V16Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M30 22H38L42 30V34H30V22Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="13" cy="37" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="35" cy="37" r="3" stroke={color} strokeWidth="2"/>
  </svg>
);

export const SecureIcon = ({ size = 48, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 6L40 12V24C40 33 24 42 24 42C24 42 8 33 8 24V12L24 6Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M17 24L21 28L31 19" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AffordableIcon = ({ size = 48, color = 'currentColor', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2"/>
    <path d="M24 12V36M18 17H27C29.2 17 31 18.8 31 21C31 23.2 29.2 25 27 25H21C18.8 25 17 26.8 17 29C17 31.2 18.8 33 21 33H30" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Social Icons
export const FacebookIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

export const InstagramIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export const TikTokIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.7a8.18 8.18 0 004.78 1.52V6.79a4.84 4.84 0 01-1.01-.1z"/>
  </svg>
);

export const WhatsappIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const UploadIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

export const SearchIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export const CartIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.61L23 6H6"/>
  </svg>
);

export const HeartIcon = ({ size = 20, color = 'currentColor', fill = 'none', className = '' }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

export const UserIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export const MenuIcon = ({ size = 22, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

export const ChevronRightIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export const ArrowRightIcon = ({ size = 18, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

export const TrashIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

export const EditIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export const PlusIcon = ({ size = 20, color = 'currentColor' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

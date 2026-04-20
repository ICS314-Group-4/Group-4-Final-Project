import { Category } from '@prisma/client';

export const categoryLabels: Record<Category, string> = {
  [Category.GOOGLE_APPS]: "Google Core/Consumer Apps",
  [Category.STAR_BANNER]: "STAR/Banner",
  [Category.UH_ACCOUNT]: "UH Account",
  [Category.DUO_MOBILE_MFA]: "Duo Mobile/MFA",
  [Category.LAMAKU_LAULIMA]: "Lamaku/Laulima LMS",
  [Category.NETWORK_PRINTING]: "Network/Printing",
  [Category.GENERAL_SUPPORT]: "General Support",
  [Category.SITE_LICENSE]: "Site License",
};

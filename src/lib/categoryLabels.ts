import { Category } from '@prisma/client';

export const categoryLabels: Record<Category, string> = {
  account: 'UH Account',
  google_core: 'Google Core/Consumer Apps',
  star: 'STAR/Banner',
  duo_mobile: 'Duo Mobile/MFA',
  lamaku: 'Lamaku/Laulima LMS',
  network: 'Network/Printing',
  general_support: 'General Support',
  site_licensed_apps: 'Site License',
};

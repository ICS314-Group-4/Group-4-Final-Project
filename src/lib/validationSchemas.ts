import * as Yup from 'yup';
import { Category } from '@prisma/client';

const CATEGORY_OPTIONS = [
  "Google Core/Consumer Apps",
  "STAR/Banner",
  "UH Account",
  "Duo Mobile/MFA",
  "Lamaku/Laulima LMS",
  "Network/Printing",
  "General Support",
  "Site License"
];

export const categoryMapping: Record<string, string> = {
  'GOOGLE_APPS': 'Google Core/Consumer Apps',
  'STAR_BANNER': 'STAR/Banner',
  'UH_ACCOUNT': 'UH Account',
  'DUO_MOBILE_MFA': 'Duo Mobile/MFA',
  'LAMAKU_LAULIMA': 'Lamaku/Laulima LMS',
  'NETWORK_PRINTING': 'Network/Printing',
  'GENERAL_SUPPORT': 'General Support',
  'SITE_LICENSE': 'Site License',
};

export const VALID_CATEGORY_KEYS = Object.keys(categoryMapping);

export const AddTemplateSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  template: Yup.string().required('Email body is required'),
  category: Yup.string().oneOf(CATEGORY_OPTIONS, 'Please select a category').required('Category is required') as Yup.Schema<Category>,
  tags: Yup.array().of(Yup.string()).required(),
});

export const EditTemplateSchema = Yup.object({
  id: Yup.number().required(),
  title: Yup.string().required('Title is required'),
  template: Yup.string().required('Email body is required'),
  category: Yup.string().oneOf(VALID_CATEGORY_KEYS, 'Please select a category').required('Category is required') as Yup.Schema<Category>,
  tags: Yup.array().of(Yup.string().required()).ensure().required(),
  author: Yup.string().required(),
  used: Yup.number().required(),
});
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

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const AddTemplateSchema = Yup.object({
  problem: Yup.string().required(),
  title: Yup.string().required(),
  template: Yup.string().required(),
  category: Yup.string().oneOf(CATEGORY_OPTIONS).required() as Yup.Schema<Category>,
  tags: Yup.array().of(Yup.string()).required(),
  author: Yup.string().required(),
  used: Yup.number().positive().required(),
});

export const EditTemplateSchema = Yup.object({
  id: Yup.number().required(),
  title: Yup.string().required(),
  template: Yup.string().required(),
  category: Yup.string().oneOf(CATEGORY_OPTIONS).required() as Yup.Schema<Category>,
  tags: Yup.array().of(Yup.string().defined()).required(),
  author: Yup.string().required(),
  used: Yup.number().positive().required(),
});
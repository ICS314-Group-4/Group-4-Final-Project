import * as Yup from 'yup';

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
  template: Yup.string().required(),
  category: Yup.string().oneOf(['account']).required(),
  author: Yup.string().required(),
  used: Yup.number().positive().required(),
});

export const EditTemplateSchema = Yup.object({
  id: Yup.number().required(),
  template: Yup.string().required(),
  category: Yup.string().oneOf(['account']).required(),
  author: Yup.string().required(),
  used: Yup.number().positive().required(),
});
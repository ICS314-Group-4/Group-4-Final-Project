'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert';
import { Container, Button, Form } from 'react-bootstrap';
import { editProfile } from '@/lib/dbActions';

type EditProfileForm = {
  newName: string;
  newSig: string;
};

const validationSchema = Yup.object().shape({
  newName: Yup.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters').default(''),
  newSig: Yup.string().max(1000, 'Signature must not exceed 1000 characters').default(''),
  // completely arbitrary max length, can change or even remove if there's reason to
});

const EditProfileForm = ({ email, name, signature }: { email: string; name: string; signature: string }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: { newName: name, newSig: signature ?? '' },
  });

  const onSubmit = async (data: EditProfileForm) => {
    // console.log(JSON.stringify(data, null, 2));
    await editProfile({ email, ...data });
    await swal('Profile Changed', 'Your profile has been updated', 'success', { timer: 2000 });
    window.location.reload();
  };

  return (
    <main>
      {/* Header */}
      <div style={{ backgroundColor: '#024731', color: '#fff' }} className="py-4">
        <Container>
          <h1 className="fw-bold mb-1">Edit Profile</h1>
        </Container>
      </div>
      {/* Body */}
      <Container className="py-5" style={{ maxWidth: '760px' }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-4">
            <Form.Label>Name</Form.Label>
            <input
                type="text"
                {...register('newName')}
                className={`form-control ${errors.newName ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.newName?.message}</div>
            </Form.Group>

            <Form.Group className="mb-4">
            <Form.Label>Signature</Form.Label>
            <textarea
                {...register('newSig')}
                className={`form-control ${errors.newSig ? 'is-invalid' : ''}`}
                rows={15}
                style={{ resize: 'vertical' }}
            />
            <div className="invalid-feedback">{errors.newSig?.message}</div>
            </Form.Group>

            <Form.Group className="py-3">
            <Button type="submit" className="button">
                Edit Profile
            </Button>
            <Button type="button" variant='outline-secondary' onClick={() => reset({ newName: name, newSig: signature ?? '' })} className='float-end' >
                Reset
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </main>
  );
};

export default EditProfileForm;

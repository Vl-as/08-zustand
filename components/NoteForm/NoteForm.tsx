import { ErrorMessage, Formik, Form, Field, type FormikHelpers } from 'formik';
import * as yup from 'yup';
import css from './NoteForm.module.css';
import type { NoteFormValues } from '@/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';

interface NoteFormProps {
  onClose: () => void;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = yup.object({
  title: yup
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(50, 'Must be no more than 50 characters')
    .required('Required'),
  content: yup.string().max(500, 'Must be no more than 500 characters'),
  tag: yup
    .string()
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Please select a valid category'
    )
    .required('Please select a tag'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    mutate(values);
    actions.resetForm();
  };

  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
      onClose();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button onClick={onClose} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}

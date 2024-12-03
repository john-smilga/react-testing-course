import { ChangeEvent, FormEvent, useState } from 'react';

type FormProps = {
  onSubmit: (data: { title: string; likes: number }) => Promise<void>;
};

const Form = ({ onSubmit }: FormProps) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ title, likes: 0 });
    setTitle('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className='mb-8'>
      <label htmlFor='title' className='sr-only'>
        Title
      </label>
      <input
        type='text'
        id='title'
        value={title}
        onChange={handleChange}
        placeholder='Enter post title'
        className='p-2 border rounded mr-2 w-64'
        required
      />
      <button
        type='submit'
        className='px-4 py-2 bg-teal-500 text-white rounded'
      >
        Add Post
      </button>
    </form>
  );
};
export default Form;

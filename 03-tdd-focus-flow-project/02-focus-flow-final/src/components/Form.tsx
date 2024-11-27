import { useState } from 'react';
import { type ItemWithoutId, type ItemCategory } from '../utils';

const Form = ({ onSubmit }: { onSubmit: (item: ItemWithoutId) => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // typescript will complain if we don't check for empty strings
    if (!title || !description || !category) return;
    onSubmit({ title, description, category });
    setTitle('');
    setDescription('');
    setCategory('');
  };

  return (
    <div className='max-w-xl'>
      <h2 className='text-xl font-semibold mb-2'>Add New Task</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='title'
            className='text-sm font-medium leading-none block mb-2'
          >
            Title
          </label>
          <input
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='flex h-10 w-full rounded-md border px-3 py-2 text-sm'
          />
        </div>
        <div>
          <label
            htmlFor='description'
            className='text-sm font-medium leading-none block mb-2'
          >
            Description
          </label>
          <input
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='flex h-10 w-full rounded-md border  px-3 py-2 text-sm'
          />
        </div>
        <div>
          <label
            htmlFor='category'
            className='text-sm font-medium leading-none block mb-2'
          >
            Category
          </label>
          <select
            id='category'
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            required
            className='flex h-10 w-full rounded-md border  px-3 py-2 text-sm'
          >
            <option value=''>Select Category</option>
            <option value='urgent'>Urgent</option>
            <option value='important'>Important</option>
            <option value='normal'>Normal</option>
            <option value='low'>Low Priority</option>
          </select>
        </div>
        <button
          type='submit'
          className='rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 '
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default Form;

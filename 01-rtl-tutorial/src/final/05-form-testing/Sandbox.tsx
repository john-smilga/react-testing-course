import { useState } from 'react';
import validator from 'validator';

const labelStyles = 'block text-grey-700 font-medium mb-2';
const inputStyles = 'w-full px-3 py-2 border border-gray-300 rounded-md';
const buttonsStyles =
  'w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600';

const defaultState = {
  email: '',
  password: '',
  confirmPassword: '',
};

const Sandbox = () => {
  const [signupInput, setSignupInput] = useState(defaultState);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupInput({ ...signupInput, [id]: value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validator.isEmail(signupInput.email)) {
      return setError('Invalid email');
    }
    if (!validator.isLength(signupInput.password, { min: 5 })) {
      return setError('Password must be at least 5 characters');
    }
    if (signupInput.password !== signupInput.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setSignupInput(defaultState);
  };

  return (
    <div className='container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md'>
      <form className='space-y-4'>
        {/* email input */}
        <div className='mb-3'>
          <label htmlFor='email' className={labelStyles}>
            Email address
          </label>
          <input
            type='email'
            id='email'
            value={signupInput.email}
            onChange={handleChange}
            className={inputStyles}
          />
        </div>
        {/* password */}
        <div className='mb-3'>
          <label htmlFor='password' className={labelStyles}>
            Password
          </label>
          <input
            type='password'
            id='password'
            value={signupInput.password}
            onChange={handleChange}
            className={inputStyles}
          />
        </div>
        {/* confirm password */}
        <div className='mb-3'>
          <label htmlFor='confirmPassword' className={labelStyles}>
            Confirm Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            value={signupInput.confirmPassword}
            onChange={handleChange}
            className={inputStyles}
          />
        </div>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button type='button' onClick={handleSubmit} className={buttonsStyles}>
          Submit
        </button>
      </form>
    </div>
  );
};
export default Sandbox;

import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';

const Sandbox = () => {
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleDecrease = () => {
    setCount(count - 1);
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className='p-8 text-center'>
      <h2 className='text-2xl font-bold mb-4'>Count: {count}</h2>
      <button
        onClick={handleIncrease}
        className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
      >
        Increase
      </button>
      <button
        onClick={handleDecrease}
        className='bg-red-500 text-white px-4 py-2 rounded'
      >
        Decrease
      </button>
      <div>
        {isLiked ? (
          <button
            onClick={handleToggleLike}
            className='block mx-auto text-2xl text-red-500 mt-16'
            aria-label='like button'
          >
            <FaHeart />
          </button>
        ) : (
          <button
            onClick={handleToggleLike}
            className='block mx-auto text-2xl text-red-500 mt-16'
            aria-label='unlike button'
          >
            <FaRegHeart />
          </button>
        )}
      </div>
      {/* <div>
        <button
          onClick={handleToggleLike}
          className='block mx-auto text-2xl text-red-500 mt-16'
          aria-label={isLiked ? 'like button' : 'unlike button'}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div> */}
    </div>
  );
};
export default Sandbox;

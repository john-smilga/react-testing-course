import { useState } from 'react';
import Form from './Form';
import List from './List';

export type Review = {
  email: string;
  rating: string;
  text: string;
};

const Sandbox = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const addReview = (review: Review) => {
    setReviews([...reviews, review]);
  };
  return (
    <div className='max-w-xl mx-auto p-8'>
      <h1 className='text-2xl font-bold mb-8'>Reviews App</h1>
      <Form onSubmit={addReview} />
      <List reviews={reviews} />
    </div>
  );
};
export default Sandbox;

import { Review } from './Sandbox';

type ListProps = {
  reviews: Review[];
};

const List = ({ reviews }: ListProps) => {
  return (
    <div className='mt-8'>
      <h2 className='text-xl font-bold mb-4'>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((review, index) => (
          <article key={index} className='border p-4 rounded mb-4'>
            <div className='font-bold'>{review.email}</div>
            <div className='text-yellow-500'>
              {'⭐'.repeat(Number(review.rating))}
            </div>
            <p className='mt-2'>{review.text}</p>
          </article>
        ))
      )}
    </div>
  );
};

export default List;

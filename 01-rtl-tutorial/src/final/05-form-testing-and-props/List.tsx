import { Review } from './Form';

const List = ({ reviews }: { reviews: Review[] }) => {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold'>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((review, index) => (
          <article key={index} className='border p-4 rounded'>
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

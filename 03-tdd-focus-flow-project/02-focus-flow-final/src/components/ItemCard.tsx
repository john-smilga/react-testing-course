import { Trash2 } from 'lucide-react';

type ItemCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  onDelete: (id: string) => void;
};

const categoryColors = {
  urgent: 'bg-red-500',
  important: 'bg-yellow-500',
  normal: 'bg-blue-500',
  low: 'bg-green-500',
};

const ItemCard = ({
  id,
  title,
  description,
  category,
  onDelete,
}: ItemCardProps) => {
  return (
    <article className='w-full rounded-lg border  shadow-sm'>
      <div className='flex flex-row items-center justify-between p-6 pb-2'>
        <h3 className='text-lg font-semibold leading-none tracking-tight'>
          {title}
        </h3>
        <button
          onClick={() => onDelete(id)}
          aria-label={`Delete task: ${id}`}
          className='inline-flex h-9 w-9 items-center justify-center rounded-md '
        >
          <Trash2 className='h-4 w-4' />
        </button>
      </div>
      <div className='p-6 pt-2'>
        <p className='text-sm text-muted-foreground mb-2'>{description}</p>
        <div
          className={`inline-block ${
            // Access the color from categoryColors using category as key
            // Fallback to bg-gray-500 if category doesn't exist in categoryColors
            categoryColors[category as keyof typeof categoryColors] ||
            'bg-gray-500'
          } text-white text-xs font-semibold px-2 py-1 rounded`}
        >
          {category}
        </div>
      </div>
    </article>
  );
};
export default ItemCard;

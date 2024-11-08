import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    price,
    description,
    image_url,
    category_name,
    stock
  } = product;

  return (
    <div className="group relative">
      <div className="aspect-w-4 aspect-h-3 w-full overflow-hidden rounded-lg bg-gray-200">
        <Link to={`/products/${id}`}>
          <img
            src={image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={name}
            className="h-48 w-full object-cover object-center group-hover:opacity-75 transition-opacity"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        </Link>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link to={`/products/${id}`} className="hover:text-indigo-600">
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{category_name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">${Number(price).toFixed(2)}</p>
          <p className={`text-sm ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stock > 0 ? `${stock} in stock` : 'Out of Stock'}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
    </div>
  );
};

export default React.memo(ProductCard);
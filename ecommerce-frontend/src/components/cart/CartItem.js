// src/components/cart/CartItem.js
import React from 'react';
import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // Convert price to number to ensure toFixed works
  const price = parseFloat(item.price);
  const total = price * item.quantity;

  return (
    <div className="flex items-center py-4 border-b">
      <img
        src={item.image_url || '/api/placeholder/80/80'}
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-gray-600">${price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="mx-2 w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end ml-4">
        <span className="text-lg font-medium text-gray-900">
          ${total.toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-800 mt-2 flex items-center"
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Remove
        </button>
      </div>
    </div>
  );
};
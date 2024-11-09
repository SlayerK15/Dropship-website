import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';
import { ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart, cart } = useCart();

  // Check if product is already in cart
  const productInCart = cart.find(item => item.id === Number(id));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getProduct(id);
        setProduct(data);
        setSelectedImage(data.image_url);
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAddedToCart(true);
      
      // Reset the "Added to Cart" message after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link
          to="/products"
          className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <Link
          to="/products"
          className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {addedToCart && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription>Product added to cart successfully!</AlertDescription>
          </Alert>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-200">
            <img
              src={selectedImage || '/api/placeholder/400/400'}
              alt={product.name}
              className="w-full h-full object-center object-cover"
              onError={(e) => {
                e.target.src = '/api/placeholder/400/400';
              }}
            />
          </div>
          
          {/* Additional Product Images */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.image_url)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                    selectedImage === image.image_url ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`${product.name} view`}
                    className="w-full h-full object-center object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/100/100';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-gray-500">
            <Link to="/products" className="hover:text-gray-700">Products</Link>
            <span className="mx-2">/</span>
            <span>{product.category_name}</span>
          </nav>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.stock > 0 ? (
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-sm text-gray-500">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="border-t border-b py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-900">{product.category_name}</span>
              </div>
            </div>

            <div className="space-y-4">
              {productInCart && (
                <Alert className="bg-indigo-50 border-indigo-200">
                  <AlertDescription className="text-indigo-800">
                    This item is already in your cart ({productInCart.quantity} {productInCart.quantity === 1 ? 'unit' : 'units'})
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_active || product.stock === 0}
                  className={`flex-1 flex items-center justify-center px-8 py-3 rounded-md text-white
                    ${product.is_active && product.stock > 0
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-400 cursor-not-allowed'
                    } transition-colors duration-200`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {!product.is_active ? 'Product Unavailable' :
                    product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <Link
                  to="/cart"
                  className="px-8 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  View Cart
                </Link>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h3>
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-500">Product ID</dt>
                  <dd className="text-sm font-medium text-gray-900">{product.id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Last Updated</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
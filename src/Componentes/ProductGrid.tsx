import React from 'react';
import { ProductCard, Product } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Componentes de Computador</h2>
        <p className="text-gray-900">Encontre os melhores componentes para seu setup gamer</p>
      </div>
      
      <div className="product-grid bg-gray-50 p-6 min-h-screen">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={() => onAddToCart(product)} 
          />
        ))}
      </div>
    </div>
  );
};

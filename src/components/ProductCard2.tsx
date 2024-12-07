import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import ProductSelectionWidget from './ProductSelectionWidget';
import { Products } from '../../backend/src/types/index';

interface ProductCardProps {
  product: Products;
  userId: string;
}

const ProductCard2: React.FC<ProductCardProps> = ({ product, userId }) => {
    const [showWidget, setShowWidget] = useState(false);

    const handleRequestClick = () => {
        setShowWidget(true);
      };

    const fullImagePath = product.imagePath 
    ? `${'../../backend/src'}/${product.imagePath}`
    : undefined;
  return (
    <Card className="max-w-3xl mx-auto w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
          <img 
            src={fullImagePath} 
            alt={product.productName}
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg">{product.productName}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{product.productCategory}</Badge>
            <Badge variant="outline">{product.productStatus}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.productDescription}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">Owner:</span> 
              <span className="text-muted-foreground">{product.productOwner}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Postal Code:</span>
              <span className="text-muted-foreground">{product.postalCode}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Product Score:</span>
              <span className="text-muted-foreground">{product.productScore}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Total Bids:</span>
              <span className="text-muted-foreground">{product.totalBids}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <span className="font-medium">Posted:</span>
              <span className="text-muted-foreground">
                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard2;
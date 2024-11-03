import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">Owner:</span> 
              <span className="text-muted-foreground">{product.ownerName}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Pin Code:</span>
              <span className="text-muted-foreground">{product.pinCode}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Footprint:</span>
              <span className="text-muted-foreground">{product.carbonFootprint}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Total Bids:</span>
              <span className="text-muted-foreground">{product.totalBids}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <span className="font-medium">Posted:</span>
              <span className="text-muted-foreground">
                {new Date(product.postDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
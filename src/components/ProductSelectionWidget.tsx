import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Import the reusable Modal
import { Button } from '@/components/ui/button'; // Replace with your button component
import axios from 'axios';

interface Product {
  productId: string;
  productName: string;
  productScore: number;
}

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onProductSelect,
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch user's unsold products where barterOptions is empty
      axios
        .get('/api/user-products', { params: { status: 'unsold', emptyBarter: true } })
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select a Product to Barter">
      {products.length > 0 ? (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.productId}
              className="flex justify-between items-center p-2 border rounded"
            >
              <div>
                <h4 className="font-medium">{product.productName}</h4>
                <p className="text-sm text-muted-foreground">Score: {product.productScore}</p>
              </div>
              <Button
                onClick={() => {
                  onProductSelect(product);
                  onClose();
                }}
              >
                Select
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p>No unsold products available.</p>
      )}
    </Modal>
  );
};

export default ProductSelectionModal;

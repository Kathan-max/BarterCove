import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCategory, Questions, QuestionOption, Products } from '../../backend/src/types/index';
import axios from 'axios';
import { getProductsByCategory, getQuestionsByCategory, createProduct } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { getUserInfo, updateUserUnSoldItems } from '@/services/userService';
import { v4 as uuidv4 } from 'uuid';

interface CreateProductResponse {
    _id: string; // Ensure this matches the actual field returned by your API
  }

// MCQ Question Component
const MCQQuestion: React.FC<{
  question: string,
  options: QuestionOption[],
  onSelect: (selectedOption: QuestionOption) => void
}> = ({ question, options, onSelect }) => {

  const handleSelect = (optionText: string) => {
    const option = options.find(opt => opt.text === optionText);
    if (option) onSelect(option);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.text} value={option.text}>
                {option.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

const ProductCreationForm: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    
    const [userData, setUserData] = useState<any>(null);
    // Form State
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productImage, setProductImage] = useState<File | null>(null);
    const [productCategory, setProductCategory] = useState<string>('');
    const [categoryProducts, setCategoryProducts] = useState<String[]>([]);
    const [categoryQuestions, setCategoryQuestions] = useState<Questions[]>([]);
  
    // Questions and Scoring State
    const [productQuestions, setProductQuestions] = useState<Questions[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [totalProductScore, setTotalProductScore] = useState(0);
    const [selectedQuestionOptions, setSelectedQuestionOptions] = useState<{ [key: string]: QuestionOption }>({});
    const { currentUser } = useAuth();

    // Fetch category products when category is selected
    useEffect(() => {
      const fetchUserData = async () => {
        if(currentUser?.uid){

          try {
            const user = await getUserInfo(currentUser?.uid);
            setUserData(user);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
        };
      fetchUserData();
    }, [currentUser?.uid]);
    useEffect(() => {
        const fetchCategoryData = async () => {
          if (productCategory) {
            try {
              const [productsData] = await Promise.all([
                getProductsByCategory(productCategory),
              ]);
              setCategoryProducts(productsData);
            } catch (error) {
              console.error('Error fetching category data:', error);
            }
          }
        };
    
        fetchCategoryData();
      }, [productCategory]);
      
      useEffect(() => {
        const fetchProductQuestions = async () => {
          if (selectedProduct) {
            try {
              const [productQues] = await Promise.all([
                getQuestionsByCategory(selectedProduct)
              ]);
              setCategoryQuestions(productQues);
              // const response = await axios.get<Questions[]>(`/api/products/product-questions/${selectedProduct._id}`);
              // setProductQuestions(response.data);
            } catch (error) {
              console.error('Error fetching product questions:', error);
            }
          }
        };
      
        fetchProductQuestions();
      }, [selectedProduct]);
  
    // Handle question option selection
    const handleQuestionOptionSelect = (question: string, selectedOption: QuestionOption) => {
      setSelectedQuestionOptions((prev) => ({
        ...prev,
        [question]: selectedOption,
      }));
  
      setTotalProductScore((prev) => prev + selectedOption.score);
    };
  
    // Handle form submission
    const handleSubmit = async () => {
        try {
          const productUUID = uuidv4();
          const formData = new FormData();
          formData.append('productId', productUUID);
          formData.append('productName', productName);
          formData.append('productDescription', productDescription);
          formData.append('productCategory', productCategory);
          formData.append('productScore', totalProductScore.toString());
      
          if (productImage) {
            formData.append('productImage', productImage);
          }

          if(userData){
            formData.append('productOwner',  userData.username);
            formData.append('latitude', userData.latitude);
            formData.append('longitude', userData.longitude);
            formData.append('postalCode', userData.pincode || '000000');
          }
          
      
          // const response = await axios.post<CreateProductResponse>('/api/products/create', formData, {
          //   headers: { 'Content-Type': 'multipart/form-data' },
          // });

          const response = await createProduct(formData);
          if(currentUser?.uid){
            const updatedUser = await updateUserUnSoldItems(currentUser?.uid, productUUID);
          }
          // Now TypeScript knows response.data._id is a string
          // navigate(`/product-review/${response.data._id}`);
          navigate('/dashboard');
        } catch (error) {
          console.error('Product submission error:', error);
        }
      };
  
    // Improved render logic for steps
    const renderStepContent = () => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-4">
              <Input
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <Input
                placeholder="Product Description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
              <Select
                value={productCategory}
                onValueChange={(value) => setProductCategory(value as ProductCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Product Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProductCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setCurrentStep(2)}>Next</Button>
            </div>
          );
  
          case 2:
  return (
    <div className="space-y-4">
      <h2>Select a Product</h2>
      {categoryProducts.length > 0 ? (
        categoryProducts.map((productName, index) => (
          <Card
            key={`product-${productName}-${index}`}
            onClick={() => setSelectedProduct(productName)}
            className={`cursor-pointer ${
              selectedProduct === productName ? 'border-2 border-primary' : ''
            }`}
          >
            <CardContent>{productName}</CardContent>
          </Card>
        ))
      ) : (
        <p>No products found for this category.</p>
      )}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Previous
        </Button>
        <Button onClick={() => setCurrentStep(3)} disabled={!selectedProduct}>
          Next
        </Button>
      </div>
    </div>
  );
  
        case 3:
          return (
            <div className="space-y-4">
              <h2>Category Questions</h2>
              {categoryQuestions.length > 0 ? (
                categoryQuestions.map((question) => (
                  <MCQQuestion
                    key={question.questionText}
                    question={question.questionText}
                    options={question.options}
                    onSelect={(selectedOption) =>
                      handleQuestionOptionSelect(question.questionText, selectedOption)
                    }
                  />
                ))
              ) : (
                <p>No questions available for this category.</p>
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep(4)}>Next</Button>
              </div>
            </div>
          );
  
        case 4:
          return (
            <div className="space-y-4">
              <h2>Upload Product Image</h2>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setProductImage(files[0]);
                  }
                }}
              />
              {productImage && (
                <img src={URL.createObjectURL(productImage)} alt="Product Preview" className="max-w-full h-auto" />
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep(5)}>Next</Button>
              </div>
            </div>
          );
  
        case 5:
          return (
            <div className="space-y-4">
              <h2>Review Product Details</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Product Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <strong>Product Name:</strong> {productName}
                    </div>
                    <div>
                      <strong>Description:</strong> {productDescription}
                    </div>
                    <div>
                      <strong>Category:</strong> {productCategory}
                    </div>
                    <div>
                      <strong>Selected Product:</strong> {selectedProduct?.productName || 'None'}
                    </div>
                    <div>
                      <strong>Total Product Score:</strong> {totalProductScore}
                    </div>
                    {productImage && (
                      <div>
                        <strong>Product Image:</strong>
                        <img
                          src={URL.createObjectURL(productImage)}
                          alt="Product Preview"
                          className="max-w-full h-auto mt-2"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>
                  Previous
                </Button>
                <Button onClick={handleSubmit}>Create Product</Button>
              </div>
            </div>
          );
  
        default:
          return null;
      }
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
      </div>
    );
  };
  
  export default ProductCreationForm;
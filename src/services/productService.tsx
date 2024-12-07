import axios from 'axios';
import { Questions } from '../../backend/src/types/index';
import {Products} from '../../backend/src/types/index';

export const getProductsByCategory = async (category: string): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`/questions/getProductsByCategory/${category}`);
    console.log("response: "+response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const getQuestionsByCategory = async (productName: string): Promise<Questions[]> => {
  try {///questions/productName/:productName
    const response = await axios.get<Questions[]>(`/questions/productName/${productName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions by category:', error);
    throw error;
  }
};

export const createProduct = async (productData: FormData): Promise<any> => {
  try {
    const response = await axios.post('/products/create', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const fetchNearbyProducts = async (userEmail: string, postalCode: string): Promise<Products[]> => {
  try {
    const response = await axios.get<Products[]>('/products/nearby', {
      params: {
        excludeOwner: userEmail,
        postalCode: postalCode
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby products:', error);
    throw error;
  }
};

export const getProductsByIds = async (productIds: string[]): Promise<Products[]> => {
  try {
    const response = await axios.post<Products[]>("/products/getProductsByIds", {
      ids: productIds, // Pass `ids` in the body of the POST request
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

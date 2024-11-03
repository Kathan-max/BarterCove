export interface Product{
    id: string;
    name: string;
    description: string;
    ownerName: string;
    pinCode: string;
    carbonFootprint: number;
    postDate: string;
    totalBids: number;
    tags: string[];
    imageUrl: string;
}
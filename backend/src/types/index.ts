export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
  }
  
  export interface User {
    firebaseUid: string;
    email: string;
    username: string;
    pincode: string;
    createdAt: Date;
  }
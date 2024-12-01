import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from 'lucide-react';


interface Friend {
  id: string;
  name: string;
  avatar?: string;
  lastSeen: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

interface MessagingWidgetProps {
  userId: string;  // Add this prop to identify the current user
  onClose?: () => void;
}

// Mock friends data
const mockFriends: Friend[] = [
  { id: 'oOmpxoqJJgd2GiovqWVGnsaErVM2', name: 'Alice Johnson', lastSeen: '2 mins ago' },
  { id: '2', name: 'Bob Smith', lastSeen: '5 mins ago' },
  { id: '3', name: 'Carol White', lastSeen: 'Just now' },
  { id: '4', name: 'David Brown', lastSeen: '1 hour ago' },
];

const MessagingWidget = ({ userId, onClose }: MessagingWidgetProps) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
//   const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const SOCKET_URL = import.meta.env.NODE_ENV === 'production'
  ? 'https://your-production-server.com'  // Your production server URL
  : 'http://localhost:3000'; 

  useEffect(() => {
    const socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    });

    socketRef.current = socket;
    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('user connected', userId);
    });
    socket.on('private message', (message: Message) => {
        console.log('Received message:', message);
        setMessages(prev => [...prev, message]);
    });
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    }, [userId]);
    // const newSocket = io('http://localhost:3000');
    // setSocket(newSocket);

    // Identify the user when connecting
    // newSocket.emit('user connected', userId);

    // Listen for incoming messages
    // newSocket.on('private message', (message: Message) => {
    //   setMessages(prev => [...prev, message]);
    // });

//     return () => {
//       newSocket.close();
//     };
//   }, [userId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedFriend && socketRef.current) {
      const message = {
        id: crypto.randomUUID(),
        senderId: userId,
        receiverId: selectedFriend.id,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      socketRef.current.emit('private message', message);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Filter available friends based on the current user
  const availableFriends = mockFriends.filter(friend => friend.id !== userId);

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <Card className="w-80 shadow-2xl">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center gap-2">
            {selectedFriend ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFriend(null)}
                  className="p-0 h-8 w-8 text-white hover:text-black hover:bg-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span>{selectedFriend.name}</span>
              </>
            ) : (
              'Contacts'
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto p-0 h-8 w-8 text-white hover:text-black hover:bg-white"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedFriend ? (
            <ScrollArea className="h-96">
              {availableFriends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer"
                >
                  <Avatar>
                    {friend.avatar ? (
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                    ) : (
                      <AvatarFallback>{getInitials(friend.name)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">{friend.name}</div>
                    <div className="text-sm text-gray-500">{friend.lastSeen}</div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="h-96 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                {messages
                  .filter(
                    m =>
                      (m.senderId === userId &&
                        m.receiverId === selectedFriend.id) ||
                      (m.receiverId === userId &&
                        m.senderId === selectedFriend.id)
                  )
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${
                        message.senderId === userId
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-2 rounded-lg ${
                          message.senderId === userId
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                        }`}
                      >
                        <div>{message.text}</div>
                        <div className="text-xs opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </ScrollArea>
              <form
                onSubmit={sendMessage}
                className="p-4 border-t flex gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border rounded bg-white text-black"
                  placeholder="Type a message..."
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingWidget;
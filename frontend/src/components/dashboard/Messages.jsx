import React, { useState } from 'react';
import { 
  MessageSquare, Search, Send, Paperclip, Smile, 
  Phone, Video, MoreVertical, Check, CheckCheck,
  Plus, Archive, Star, Trash2, Filter, User
} from 'lucide-react';

/**
 * Messages Component
 * Complete messaging interface with chat functionality
 */
const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: '👩‍💼',
      lastMessage: 'Great work on the React component! When can we schedule the next milestone?',
      timestamp: '2 min ago',
      unread: 3,
      online: true,
      project: 'E-commerce Dashboard'
    },
    {
      id: 2,
      name: 'TechCorp Team',
      avatar: '🏢',
      lastMessage: 'The final designs look amazing. Ready to move to development phase.',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      project: 'Mobile App UI'
    },
    {
      id: 3,
      name: 'Alex Kumar',
      avatar: '👨‍💻',
      lastMessage: 'Can you help with the Python data analysis script?',
      timestamp: '3 hours ago',
      unread: 1,
      online: true,
      project: 'Data Analytics'
    },
    {
      id: 4,
      name: 'Maya Patel',
      avatar: '👩‍🎨',
      lastMessage: 'Thanks for the quick turnaround on the logo design!',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      project: 'Logo Design'
    },
    {
      id: 5,
      name: 'InnovateCorp',
      avatar: '🚀',
      lastMessage: "Let's discuss the project timeline in detail.",
      timestamp: '2 days ago',
      unread: 0,
      online: true,
      project: 'Startup Website'
    }
  ];

  // Sample messages for the selected chat
  const messages = [
    {
      id: 1,
      sender: 'Sarah Chen',
      content: "Hi! I've reviewed your portfolio and I'm really impressed with your React work.",
      timestamp: '10:30 AM',
      isOwnMessage: false
    },
    {
      id: 2,
      sender: 'You',
      content: "Thank you! I'd love to help with your e-commerce project. Can you share more details about the requirements?",
      timestamp: '10:35 AM',
      isOwnMessage: true,
      status: 'read'
    },
    {
      id: 3,
      sender: 'Sarah Chen',
      content: 'Absolutely! We need a modern, responsive dashboard with user management, product catalog, and analytics. The budget is ₹25,000.',
      timestamp: '10:40 AM',
      isOwnMessage: false
    },
    {
      id: 4,
      sender: 'You',
      content: "That sounds perfect! I can definitely deliver that within your budget. I'd estimate 2-3 weeks for completion. Would you like to see some similar projects I've done?",
      timestamp: '10:45 AM',
      isOwnMessage: true,
      status: 'read'
    },
    {
      id: 5,
      sender: 'Sarah Chen',
      content: 'Yes, please! Also, what would be your preferred tech stack for this project?',
      timestamp: '11:00 AM',
      isOwnMessage: false
    },
    {
      id: 6,
      sender: 'You',
      content: "I'd recommend React with TypeScript for the frontend, Node.js with Express for the backend, and MongoDB for the database. Very scalable and modern.",
      timestamp: '11:05 AM',
      isOwnMessage: true,
      status: 'delivered'
    },
    {
      id: 7,
      sender: 'Sarah Chen',
      content: 'Great work on the React component! When can we schedule the next milestone?',
      timestamp: '2 min ago',
      isOwnMessage: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentChat = conversations.find(conv => conv.id === selectedChat);
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-200px)] bg-white dark:bg-black rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedChat === conversation.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{conversation.project}</p>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  
                  {conversation.unread > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                        {conversation.unread}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      {currentChat.avatar}
                    </div>
                    {currentChat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{currentChat.name}</h3>
                    <p className="text-sm text-gray-500">
                      {currentChat.online ? 'Online' : 'Last seen 2 hours ago'} • {currentChat.project}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwnMessage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-between mt-1 ${
                      message.isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{message.timestamp}</span>
                      {message.isOwnMessage && (
                        <div className="ml-2">
                          {message.status === 'read' ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="1"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // No chat selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

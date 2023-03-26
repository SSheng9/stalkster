import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

import { useAuthenticator } from '@aws-amplify/ui-react';

const ChatGPT = () => {

  const { user } = useAuthenticator((context) => [context.user]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [processing, setProcessing] = useState(false);


  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 p-4 border-r">
        <ChatList onSelect={setSelectedChat} selectedChat={selectedChat} onProcessing={processing} onSetProcessing = {setProcessing}/>
      </div>
      <div className="w-3/4 p-4">
        {user ? (
        
        selectedChat ? (
          <ChatWindow chat={selectedChat} onProcessing={processing} onSetProcessing = {setProcessing} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-lg font-semibold text-gray-600">Select a chat to start the conversation</h2>
          </div>
        )
        ): (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-lg font-semibold text-gray-600">Login to view messages</h2>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChatGPT;

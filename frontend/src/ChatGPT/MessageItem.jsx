import React, { useState, useEffect } from 'react';
import { EditIcon, TrashIcon } from './Icons';
import { Auth } from "aws-amplify";
import { useAuthenticator } from '@aws-amplify/ui-react';


const MessageItem = ({ message, onUpdate, onDelete }) => {
  
  // const { user } = useAuthenticator((context) => [context.user]);

  // const credentials = Auth.currentCredentials();
  // const id = credentials.identityId
  // console.log("current ID ", id)


  const { user } = useAuthenticator((context) => [context.user]);

  const [id, setIdentityId] = useState(null);

  useEffect(() => {
    const getCurrentIdentityId = async () => {
      try {
        const credentials = await Auth.currentCredentials();
        const id = credentials.identityId;
        setIdentityId(id);
      } catch (err) {
        console.log("Error getting current credentials: ", err);
      }
    };
    getCurrentIdentityId();
  }, []);


  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(message.content);

  const isUser = message.sender === 'user';

  const handleUpdate = () => {
    onUpdate(message.id, content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(message.id);
  };

  return (
    <div className={`flex my-2 ${isUser ? 'justify-end' : ''} ${id == message.user_id ? 'justify-end' : ''}`}>
    <div className="p-2 my-1">
      {isEditing ? (
        <div className="flex">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow p-1 border rounded"
          />
          <button onClick={handleUpdate} className="ml-2 px-2 py-1 bg-green-500 text-white font-semibold rounded">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="ml-2 px-2 py-1 bg-red-500 text-white font-semibold rounded">
            Cancel
          </button>
        </div>
      ) : (
        <>
        <p className={`text-xs ${id == message.user_id ? 'text-end font-semibold': 'text-start'}`}>{message.username}</p>
        <div
        className={`px-4 py-2 rounded ${ id == message.user_id ? 'bg-green-500 text-black mr-0	':
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
        }`}
      >
      
              <div className="flex justify-between items-center gap-5">
                <div>
                {message.content_type === 'text' ?

                (<span className="flex-grow">{content}</span>
                ) : (
                <img src={content} alt="img" className="flex-grow" />
                )}
                </div>
           
                { id == message.user_id && (
                  <div>
                {message.content_type === "text" &&
                <button onClick={() => setIsEditing(true)} className="px-1 text-gray-600 hover:text-gray-800">
                  <EditIcon />
                </button>
                }
                <button onClick={handleDelete} className="px-1 ml-2 text-gray-600 hover:text-gray-800">
                  <TrashIcon />
                </button>
                </div>
                )
                }
              </div>
        </div>
        <p className={`text-xs ${id == message.user_id ? 'text-end': 'text-start'}`}>{new Date(message.timestamp).toLocaleString()}</p>

        </>
      )}
    </div>
  </div>
  );
};

export default MessageItem;

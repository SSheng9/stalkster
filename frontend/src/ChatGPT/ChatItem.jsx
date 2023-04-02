import React, { useState } from 'react';
import { EditIcon, TrashIcon } from './Icons'; // Import the icons from a separate file

import { twMerge } from 'tailwind-merge';

import { useAuthenticator } from '@aws-amplify/ui-react';


const ChatItem = ({ chat, selected, onSelect, onUpdate, onDelete,user_id }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  console.log("user", user)
  console.log("chatId", chat)

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(chat.name);

  // console.log({chat})

  const handleUpdate = () => {
    onUpdate(chat.id, name);
    setIsEditing(false);
  };

  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent the chat from being selected
    onDelete(chat.id);
  };

  const handleSelect = () => {
    if (!isEditing) {
      onSelect(chat);
    }
  };

  const toggleEditing = (event) => {
    event.stopPropagation(); // Prevent the chat from being selected
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="p-2 my-1" onClick={handleSelect}>
      {isEditing ? (
        <div className="flex">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow p-1 border rounded"
          />
          <button onClick={handleUpdate} className="ml-2 px-2 py-1 bg-green-500 text-white font-semibold rounded">
            Save
          </button>
          <button onClick={toggleEditing} className="ml-2 px-2 py-1 bg-red-500 text-white font-semibold rounded">
            Cancel
          </button>
        </div>
      ) : (
        <div className={twMerge("flex justify-between items-center cursor-pointer hover:bg-gray-200", selected ? "bg-gray-200" : "")}>
          <div className="flex flex-col">
          <h3 className="flex-grow font-semibold">{chat.name}</h3>
          <p className="text-xs">created by <strong>{chat.username}</strong></p>
          </div>

          {user && user_id == chat.user_id&&(
          // {user &&(

            <div>
          <button onClick={toggleEditing} className="px-1 text-gray-600 hover:text-gray-800">
            <EditIcon />
          </button>
          <button onClick={handleDelete} className="px-1 ml-2 text-gray-600 hover:text-gray-800">
            <TrashIcon />
          </button>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;

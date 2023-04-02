import React, { useEffect, useState } from 'react';
import Message from './MessageItem';
import axios from 'axios';

import { Auth, API } from "aws-amplify";
import { Storage } from 'aws-amplify';


const ChatWindow = ({chat, onProcessing, onSetProcessing }) => {
  // Replace the array with actual message data
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const [file, setFile] = useState(null);


  async function getMessages() {
    const response = await API.get("api", "/chats/" + chat.id + "/messages");
    const messages =response.messages;
    for (const message of messages) {
      console.log("message before", message )
      if (message.content_type === "image") {
        message.key =  message.content
      message.content = await Storage.get(message.content, {
        identityId: message.user_id
      })
    }
    console.log("message after", message )

  }
  console.log(messages);

    setMessages(messages);
  }



  useEffect(() => {
    onSetProcessing(true);
    // fetch the messages
    // const apiURL = import.meta.env.VITE_API_URL
    // axios.get(apiURL + `/chats/${chat.id}/messages`).then((res)=>{
    //   console.log(res);
    //   setMessages(res.data.messages);

    getMessages();
      //  API.get("api", `/chats/${chat.id}/messages`).then((res) => {
      //   // alert(JSON.stringify(response, null, 2))
      //   console.log(res.messages)
      //   for (let message of messages){
      //     if(message.content_type === "image") {
      //       Storage.get(message.content).then((url) => {
      //         message.content = url;
      //         setMessages([...messages]);
      //       })
      //     }
      //   }
      //   setMessages(res.messages);
      // })
      // .catch((error) => {
      //   // console.log(error)
      //   alert(error)
      // })

    onSetProcessing(false);

  }, [chat])


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }


  const handleSend = async () => {
    onSetProcessing(true);

    if (file){
      try {
        const s3Options = {
          contentType: file.type,
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded/progress.total}`);
          },
        }
        // await Storage.put("arandomthing2", file, s3Options);
        const uniqueFileName = `${Date.now()}-${file.name}`;
        await Storage.put(uniqueFileName, file, s3Options);
        console.log('File uploaded successfully!');

        const result = await API.post(
          "api", 
          "/chats/" + chat.id + "/messages",  
          {
            body: {
              content: uniqueFileName,
              content_type: "image"
            } ,
          }
        );

        console.log(result)

      } catch (error) {
        console.log('Error uploading file:', error);
      }
      setFile(null)
      }else{
        const result = await API.post(
          "api", 
          "/chats/" + chat.id + "/messages",  
          {
            body: {
              content: input,
              content_type: "text"
            } ,
          }
        );
        console.log("result!!!!!!", result)
      }


      getMessages();

    setInput('');
    onSetProcessing(false);

  };




  const handleMessageUpdate = async (id, content) => {
    onSetProcessing(true);

    // Implement updating the message here
        // const apiURL = import.meta.env.VITE_API_URL
        // await axios.put(apiURL+`/chats/${chat.id}/messages/`+ id, {content})
        try{
          await API.put("api", `/chats/${chat.id}/messages/`+ id,
          {
            body: {content: content},
            // headers: {
            //   Authorization: `Bearer ${(await Auth.currentSession())
            //     .getAccessToken()
            //     .getJwtToken()}`,
            // },

          }
          );
          console.log(id, content)
          const updatedMessages = messages.map((message) =>
          message.id === id ? { ...message, content: content } : message
          );
          setMessages(updatedMessages);
        }catch(error){
          alert(error)
          console.log(error);
        }

    onSetProcessing(false);


  };




  const handleMessageDelete = async (id) => {
    onSetProcessing(true);

    // Implement deleting the message here

    // const apiURL = import.meta.env.VITE_API_URL
    // await axios.delete(apiURL+`/chats/${chat.id}/messages/`+ id)
    // const message = messages.find(message => message.id === id);

    // await Storage.remove( message.key);
    await Storage.remove(messages.find(message => message.id === id)?.key);



    await API.del("api", `/chats/${chat.id}/messages/` + id,  
    {
      // headers: {
      //   Authorization: `Bearer ${(await Auth.currentSession())
      //     .getAccessToken()
      //     .getJwtToken()}`,
      // },
    }
  );
    
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);

    console.log(id)
    onSetProcessing(false);

  }



  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} onUpdate={handleMessageUpdate} onDelete={handleMessageDelete} />
        ))}
      </div>
      {onProcessing ? "" :
      <div className="flex mt-4">
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className={`ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded ${onProcessing ? "bg-red-100" : ""}`}
        >
          {/* Send */}
          {onProcessing ? "Processing" : "Send"}

        </button>
      </div>}
    </div>
  );
};

export default ChatWindow;

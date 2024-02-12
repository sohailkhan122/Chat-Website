import React, { useEffect, useState, useRef, useContext } from 'react'
import './chatarea.css'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import MessageOther from '../MrssageOther/MessageOther';
import MessageSelf from '../MessageSelf/MessageSelf';
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { AccountContext } from '../Context/AccountProvider';


const ChatArea = () => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"))
  const [converstion, setConverstion] = useState({})
  const [messages, setMessages] = useState([])
  const [image, setImage] = useState(null);
  const messagesRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { person, setPerson, activeUsers, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext)
  const [incomingMessage, setIncomingMessage] = useState(null);
  // useEffect(() => {
  //   console.log(activeUsers)
  // }, [activeUsers])
  useEffect(() => {
    socket.current.on('getMessage', data => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now()
      })
    })
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const generateImageUrl = (imageData) => {
    const blob = new Blob([new Uint8Array(imageData.data.data)], { type: imageData.contentType });
    const url = URL.createObjectURL(blob);
    return url;
  };

  useEffect(() => {
    if (person.profileImage.data) {
      setImageUrl(generateImageUrl(person.profileImage));
    }
  }, [person.profileImage]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        let response = await axios.post('http://localhost:5000/getConversation', { senderId: userData._id, receiverId: person._id })
        setConverstion(response.data)
      } catch (error) {
        console.log(error)
      }

    }
    getConversation()

  }, [person._id, userData._id])

  useEffect(() => {
    const getmessages = async () => {
      try {
        let response = await axios.get(`http://localhost:5000/getMessages/${converstion._id}`)
        setMessages(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    converstion && getmessages()

  }, [converstion, newMessageFlag])

  useEffect(() => {
    incomingMessage && converstion?.members?.includes(incomingMessage.senderId) &&
      setMessages((prev) => [...prev, incomingMessage]);

  }, [incomingMessage, converstion]);
  const sendText = async () => {
    let message = {
      senderId: userData._id,
      receiverId: person._id,
      conversationId: converstion ? converstion._id : null, // Perform null check
      type: 'text',
      text,
      image: null,
    };
    if (image) {
      message.image = image;
      console.log(image)
      setImage(null);
    }
    socket.current.emit('sendMessage', {
      senderId: userData._id,
      receiverId: person._id,
      conversationId: converstion._id,
      type: 'text',
      text,
      image: imagePreview,
    });
    setImagePreview(null)
    try {
      await axios.post('http://localhost:5000/message', message);
      setText('');
      setNewMessageFlag((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImage(reader.result.split(',')[1]);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className='ChatAreaContainer'>
      <div className="chatAreaHeader">
        {imageUrl ? (
          <img className='con_icon' src={imageUrl} alt='pro' />
        ) : (
          <p>Loading image...</p>
        )}
        <div className="headerText">
          <p className='con_tittle'>{person.name}</p>
          <p className='con_timeStamp'>{activeUsers?.find(user => user._id === person._id) ? 'Online' : 'Offline'}</p>
        </div>
        <IconButton onClick={() => setPerson({})}>
          <DeleteIcon />
        </IconButton>
      </div>
      <div className="messageContainer" ref={messagesRef}>

        {
          messages.map((message, index) => (
            userData._id === message.senderId ? (
              <MessageSelf key={index} message={message} />
            ) : (
              <MessageOther key={index} message={message} />
            )
          ))

        }
      </div>
      <div className="textInputArea">
        <IconButton>
          <label htmlFor="image-input">
            <AttachFileIcon style={{ transform: 'rotate(40deg)' }} />
          </label>
          <input
            type="file"
            id="image-input"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </IconButton>
        <input placeholder='Type a Message' className='serachBox' onChange={(e) => setText(e.target.value)} value={text || ''} />
        <IconButton onClick={() => sendText()}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default ChatArea
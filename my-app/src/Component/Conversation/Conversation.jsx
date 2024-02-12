import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AccountContext } from '../Context/AccountProvider';
import axios from 'axios';
import { formatDate } from '../utils/common_utils';
import './conversation.css'

const Conversation = ({ user, setSelectedUser, setUserDrawerOpen }) => {
  const { setPerson, socket, setActiveUsers, newMessageFlag } = useContext(AccountContext)
  const userData = JSON.parse(localStorage.getItem("user"))
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState({})

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUserDrawerOpen(true);
  };
  useEffect(() => {
    const getConversation = async () => {
      try {
        let response = await axios.post('http://localhost:5000/getConversation', { senderId: userData._id, receiverId: user._id })
        if (response?.data) {
          setMessage({ text: response.data.message, timestamp: response.data.updatedAt })
        } else {
          setMessage({ text: '', timestamp: '' });
        }
      } catch (error) {
        console.log(error)
      }
    }
    getConversation();
  }, [newMessageFlag, user._id, userData._id]);


  useEffect(() => {
    if (user && user.profileImage && user.profileImage.data && user.profileImage.contentType) {
      const blob = new Blob([new Uint8Array(user.profileImage.data.data)], { type: user.profileImage.contentType });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageUrl(null);
    }
  }, [user]);



  const getUser = async () => {
    setPerson(user)
    try {
      await axios.post('http://localhost:5000/conversation', { senderId: userData._id, receiverId: user._id });
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    socket.current.emit('addUser', userData)
    socket.current.on('getUsers', user => {
      setActiveUsers(user)
    })
  }, [])
  return (<>
    <div className='conversation-container' >
      {imageUrl ? (
        <img style={{ cursor: 'pointer' }} className='con_icon' src={imageUrl} alt='pro' onClick={() => handleUserClick(user)} />
      ) : (
        <p>Loading image...</p>
      )}
      <p className='con_tittle' onClick={() => getUser()}>{user.name}</p>
      <p style={{ fontSize: '14px', color: 'gray' }} className='con_lastMessage' onClick={() => getUser()} >{message?.text?.includes('localhost') ? 'Photo' : message.text} </p>
      {
        message?.text &&
        <p className='con_timeStamp'>{formatDate(message?.timestamp)}</p>
      }
    </div>
    <hr style={{ width: "90%", margin: '0 auto' }} />
  </>
  );
};

export default Conversation;

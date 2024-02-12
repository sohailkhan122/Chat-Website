import React, { useContext, useEffect, useRef, useState } from 'react'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import AddmemberComponent from '../AddMember/AddmemberComponent';
import axios from 'axios';
import MessageSelf from '../MessageSelf/MessageSelf';
import MessageOther from '../MrssageOther/MessageOther';
import { AccountContext } from '../Context/AccountProvider';

const GroupChatComponent = ({ person, setPerson }) => {
  const [showAddmemberBox, setShowAddMemberBox] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const [text, setText] = useState();
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext)

  const socketRef = useRef(socket.current);

  const senderId = userData._id;
  const groupId = person._id;
  useEffect(() => {

    const currentSocket = socketRef.current;
    const handleGroupMessage = (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, createdAt: Date.now() },
      ]);
    };

    currentSocket.on('groupMessage', handleGroupMessage);

    return () => {
      currentSocket.off('groupMessage', handleGroupMessage);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    axios.get("http://localhost:5000/fetchalluser")
      .then((response) => {
        setAllUsers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const getGroupMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getGroupMessages/${groupId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    getGroupMessages();
  }, [groupId, newMessageFlag]);

  const sendMessage = async () => {
    try {
      socket.current.emit('sendgroupMessage', {
        senderId,
        text,
        image: imagePreview,
        groupId,
      });
      setImagePreview(null)
      const response = await axios.post(`http://localhost:5000/sendMessage/${groupId}`, {
        senderId,
        text,
        image,
      }
      );

      setText('');
      setImage(null);
      setNewMessageFlag((prev) => !prev);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };


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
  console.log(messages)
  return (<>
    <div className='ChatAreaContainer' style={{ position: 'relative' }}>
      <div className="chatAreaHeader">
        {person ? (
          <img
            className='con_icon'
            src={URL.createObjectURL(
              new Blob([new Uint8Array(person.image.data.data)], { type: person.image.contentType })
            )}
            alt='pro'
          />
        ) : (
          <p>Loading image...</p>
        )}
        <div className="headerText">
          <p className='con_tittle'>{person.name}</p>
          <p className='con_timeStamp'>Group</p>
        </div>
        <IconButton onClick={() => setPerson({})}>
          <DeleteIcon />
        </IconButton>
      </div>
      <div className="messageContainer" ref={messagesRef}>
        {messages.map((message) => (
          <React.Fragment key={message._id}>
            {userData._id === message.sender ? <MessageSelf message={message} /> : <MessageOther message={message} />}
          </React.Fragment>
        ))}
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
        {
          userData._id === person.admin._id && <IconButton onClick={() => setShowAddMemberBox(true)}>
            <AddIcon />
          </IconButton>
        }
        <input placeholder='Type a Message' className='serachBox' onChange={(e) => setText(e.target.value)} value={text} />
        <IconButton onClick={() => sendMessage()}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
    {showAddmemberBox ? <AddmemberComponent groupId={person._id} setShowAddMemberBox={setShowAddMemberBox} allUsers={allUsers} /> : null}
  </>
  )
}

export default GroupChatComponent


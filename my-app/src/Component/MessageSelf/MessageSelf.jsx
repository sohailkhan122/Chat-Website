import React from 'react';
import './messageself.css';
import { formatDate } from '../utils/common_utils';

const MessageSelf = ({ message }) => {
  // console.log(message)
  return (
    <div className='selfMessageContainer'>
      <div className="messageBox">
        {message.text && <p>{message.text}</p>}
        {message.image && message.image.data && (
          <img
            width={'300px'}
            height={'auto'}
            src={URL.createObjectURL(new Blob([new Uint8Array(message.image.data.data)], { type: message.image.contentType }))}
            alt="Profile"
            style={{ backgroundColor: 'none' }}
          />
        )}
        <p className='self_timestamp'>{formatDate(message.createdAt)}</p>
      </div>
    </div>
  );
};

export default MessageSelf;


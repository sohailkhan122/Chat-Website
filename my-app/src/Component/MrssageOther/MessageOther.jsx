import React, { useEffect, useState } from 'react';
import './messageother.css';
import { formatDate } from '../utils/common_utils';

const MessageOther = ({ message }) => {

  return (
    <div className='otherMessageContainer'>
      <div className="conversationContainer">
        <div className='otherTextContent'>
          {message.text && <p>{message.text}</p>}
          {message.image && (
            <img
              width={'300px'}
              height={'auto'}
              src={message.image?.data?.data ? URL.createObjectURL(new Blob([new Uint8Array(message.image.data.data)], { type: message.image.contentType })) : `${message.image}`}
              alt="Profile"
              style={{ backgroundColor: 'none' }}
            />
          )}
          <p className='self_timestamp'>{formatDate(message.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageOther;

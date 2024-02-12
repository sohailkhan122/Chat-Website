import React, { useState } from 'react';
import './creategroup.css'
import { IconButton, TextField } from '@mui/material';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const userData = JSON.parse(localStorage.getItem('user'));
  const adminId = userData._id
  const navigate = useNavigate()
  const [image, setImage] = useState(null);

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/createGroups', {
        groupName,
        adminId,
        image,
      });
      message.success('Create Groups Succesfully!');
      navigate('/mainContainer')
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result.split(',')[1]);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='createGroupContainer'>
      <IconButton>
        <label htmlFor="image-input">
          <AddPhotoAlternateIcon />
        </label>
        <input
          type="file"
          id="image-input"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </IconButton>
      <TextField
        style={{ width: '90%' }}
        placeholder='Enter Group Name'
        className='serachBox'
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <IconButton onClick={handleCreateGroup}>
        <DoneOutlineIcon />
      </IconButton>
    </div>
  );
};

export default CreateGroup;


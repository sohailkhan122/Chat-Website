import React, { useState, useEffect } from 'react';
import { Drawer, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { IconButton } from '@mui/material';
import axios from 'axios';

const ProfileDrawer = ({ open, onClose, imageUrl, account, setUpdateUser }) => {
    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState(account.name);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        setNewName(account.name);
    }, [account.name]);

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleImageUpload = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newName);
            formData.append('email', account.email);

            if (fileList.length > 0) {
                formData.append('file', fileList[0].originFileObj);
            }

            const response = await axios.put('http://localhost:5000/updateUserProfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setEditMode(false);
            setFileList([]);
            setNewName('');
            setUpdateUser((prev) => !prev);
            console.log(response.data);
            message.success('Profile updated successfully');
        } catch (error) {
            console.error('Error uploading profile image:', error);
            message.error('Failed to upload profile image. Please try again.');
        }
    };

    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        fileList,
    };

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Profile Details</span>
                    {!editMode && (
                        <IconButton onClick={() => setEditMode(true)}>
                            <EditNoteIcon style={{ cursor: 'pointer' }} />
                        </IconButton>
                    )}
                </div>
            }
            placement="left"
            onClose={onClose}
            open={open}
            width={403}
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                {imageUrl ? (
                    <img style={{ width: '160px', height: '150px', borderRadius: '50%' }} src={imageUrl} alt='pro' />
                ) : (
                    <p style={{ fontSize: '14px' }}>Loading image...</p>
                )}
                {editMode && (
                    <div style={{ marginTop: '10px' }}>
                        <Upload {...uploadProps} onChange={handleImageUpload}>
                            <Button icon={<UploadOutlined />}>Update Profile Image</Button>
                        </Upload>
                    </div>
                )}
            </div>
            {!editMode ? (
                <p style={{ paddingTop: "10px", textAlign: 'center', fontSize: '28px', fontWeight: '600' }}>{account.name}</p>
            ) : (
                <div style={{ marginTop: '10px' }}>
                    <Input value={newName} onChange={handleNameChange} />
                </div>
            )}
            <p style={{ paddingTop: "10px", textAlign: 'center', fontSize: '20px', fontWeight: '600' }}>Email: <span style={{ color: 'gray' }}>{account.email}</span></p>
            {editMode && (
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <Button type="primary" onClick={handleSaveChanges}>Save</Button>
                </div>
            )}
        </Drawer>
    );
};

export default ProfileDrawer;

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import './addmember.css'
import { IconButton, CircularProgress } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
const AddmemberComponent = ({ allUsers, setShowAddMemberBox, groupId }) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const [loading, setLoading] = useState(false);
    const addMemberToGroup = async (memberId) => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/addMemberToGroup", { memberId, groupId });
            setShowAddMemberBox(false)
            message.success('Successfully Add');
            return response.data;

        } catch (error) {
            message.error(error.response.data.error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='addmemberContainer'>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '450', height: '70px', alignItems: 'center' }}>
                <h1 style={{ marginLeft: '30px', fontSize: '35px', fontWeight: 'bold' }}>Add Member</h1>
                <IconButton onClick={() => setShowAddMemberBox(false)}>
                    <ClearIcon />
                </IconButton>
            </div>
            <div className="ugList">
                {allUsers && allUsers.map((user, index) => (
                    userData._id !== user._id &&
                    <>
                        <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                            <div key={user._id} className='conversation-container' >
                                {user ? (
                                    <img className='con_icon' src={URL.createObjectURL(new Blob([new Uint8Array(user.profileImage.data.data)], { type: user.profileImage.contentType }))} alt='pro' />
                                ) : (
                                    <p>Loading image...</p>
                                )}
                                <p className='con_tittle'>{user.name}</p>
                            </div>
                            <div className=''><IconButton onClick={() => addMemberToGroup(user._id)} >
                                {loading ? <CircularProgress size={20} /> : <AddIcon />}
                            </IconButton>

                            </div>

                        </div>
                        <div></div>

                        <hr style={{ width: "90%", margin: '0 auto' }} />
                    </>
                ))}
            </div>
        </div>
    )
}

export default AddmemberComponent

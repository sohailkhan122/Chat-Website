import React, { useEffect, useState } from 'react'
import './users.css'
import axios from 'axios';


const Users = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const [allUsers, setAllusers] = useState([]);
    useEffect(() => {
        axios.get(
            "http://localhost:5000/fetchalluser",
        ).then((response) => {
            console.log(response);
            setAllusers(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    return (
        <div className='listContainer'> <div className="ug-header">
            <img src="https://my.westcoastuniversity.edu/images/canvassupportchat.png" alt="welcome" style={{ height: "2rem", width: "2rem", marginLeft: "10px" }} />
            <p className='ugTittle'>Users</p>
        </div>
            <div className="ugList">
                {allUsers && allUsers.map((user, index) => (
                    userData._id !== user._id &&
                    <>
                        <div className='conversation-container' >
                            {user ? (
                                <img style={{ cursor: 'pointer' }} className='con_icon' src={URL.createObjectURL(new Blob([new Uint8Array(user.profileImage.data.data)], { type: user.profileImage.contentType }))} alt='pro' />
                            ) : (
                                <p>Loading image...</p>
                            )}
                            <p className='con_tittle' >{user.name}</p>
                        </div>
                        <hr style={{ width: "90%", margin: '0 auto' }} />
                    </>
                ))}
            </div>
        </div>
    )
}

export default Users
import React, { useEffect } from 'react'
import './mainContainer.css'
import Sidebar from '../SideBar/Sidebar'
import ChatArea from '../ChatArea/ChatArea'
import Welcome from '../Welcome/Welcome'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AccountContext } from '../Context/AccountProvider';
import GroupChatComponent from '../GroupChat/GroupChatComponent'

const MainContainer = () => {
  const { person, setPerson } = useContext(AccountContext)
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    if (userData === null) {
      navigate("/")
    } else {
      navigate("/mainContainer")
    }
  }, [navigate])

  return (
    <div className='fullAppContainer'>
      <div className='mainContainer'>
        <Sidebar />

        {person.admin ? (
          <GroupChatComponent person={person} setPerson={setPerson} />
        ) : Object.keys(person).length ? (
          <ChatArea person={person} setPerson={setPerson} />
        ) : (
          <Welcome />
        )}
      </div>
    </div>
  );
}

export default MainContainer;




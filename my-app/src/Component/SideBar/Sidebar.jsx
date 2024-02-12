import React, { useContext, useEffect, useState } from 'react';
import './sidebar.css';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Conversation from '../Conversation/Conversation';
import { AccountContext } from '../Context/AccountProvider';
import ProfileDrawer from '../ProfileSidebar/ProfileSidebar';
import UserDrawer from '../UserDrawer/UserDrawer';

const Sidebar = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [allUsersOriginal, setAllUsersOriginal] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [groups, setGroups] = useState([]);
  const { setPerson } = useContext(AccountContext)
  const [account, setAccount] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [EditDrawerOpen, setEditDrawerOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState(false)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = userData ? userData._id : null;
        const accountResponse = await axios.get(`http://localhost:5000/getSingleDocument/${userId}`);
        setAccount(accountResponse.data);
        const blob = new Blob([new Uint8Array(accountResponse.data.profileImage.data.data)], { type: accountResponse.data.profileImage.contentType });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        if (!allUsersOriginal.length) {
          const allUsersResponse = await axios.get("http://localhost:5000/fetchalluser");
          setAllUsersOriginal(allUsersResponse.data.data);
          setAllUsers(allUsersResponse.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [updateUser]);


  useEffect(() => {
    const filteredUsers = allUsersOriginal.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setAllUsers(filteredUsers);
  }, [searchTerm, allUsersOriginal]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getAllGroups');
        setGroups(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className='sidebarContainer'>
      <div className="sb-header">
        <div>
          <IconButton onClick={() => setProfileDrawerOpen(true)}>
            {imageUrl ? (
              <img className='con_icon' src={imageUrl} alt='pro' />
            ) : (
              <p style={{ fontSize: '14px' }}>Loading image...</p>
            )}
          </IconButton>
        </div>
        <div >
          <IconButton onClick={() => { navigate('/users') }}>
            <PersonAddIcon />
          </IconButton>
          <IconButton onClick={() => { navigate('/groups') }} >
            <GroupAddIcon />
          </IconButton>
          <IconButton onClick={() => { navigate('/groupscreate') }}>
            <AddCircleIcon />
          </IconButton>
          <IconButton
            component="div"
            onClick={() => {
              localStorage.clear()
              setPerson({})
              navigate('/')
            }}
          >
            <LogoutIcon />
          </IconButton>

        </div>
        <ProfileDrawer
          open={profileDrawerOpen}
          onClose={() => setProfileDrawerOpen(false)}
          imageUrl={imageUrl}
          account={account}
          setEditDrawerOpen={setEditDrawerOpen}
          setUpdateUser={setUpdateUser}
        />
      </div>
      <UserDrawer
        open={userDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
        selectedUser={selectedUser}
      />
      <div className="sb-serach">
        <IconButton><SearchIcon /></IconButton>
        <input placeholder='Search' style={{ background: "none" }} className='serachBox' onChange={(e) => handleSearch(e)} />
      </div>
      <div className="sb-conversation">
        {allUsers && allUsers.map((user) => (
          userData._id !== user._id &&
          <Conversation key={user._id} user={user} setUserDrawerOpen={setUserDrawerOpen} setSelectedUser={setSelectedUser} />
        ))}
        {
          groups?.map((item) => {
            const userInGroup = item.members && item.members.some(data => data === userData._id);
            if (userInGroup) {
              return (
                <React.Fragment key={item._id}>
                  <div className='conversation-container' onClick={() => setPerson(item)}>
                    {item.image ? (
                      <img className='con_icon' src={URL.createObjectURL(new Blob([new Uint8Array(item.image.data.data)], { type: item.image.contentType }))} alt='pro' />
                    ) : (
                      <p>Loading image...</p>
                    )}
                    <p className='con_tittle'>{item.name} Group</p>
                  </div>
                  <hr style={{ width: "90%", margin: '0 auto' }} />
                </React.Fragment>
              );
            }

            return null;
          })
        }
      </div>
    </div>
  );
}

export default Sidebar;


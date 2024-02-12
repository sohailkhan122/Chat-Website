import { Route, Routes } from 'react-router-dom';
import './App.css';
import MainContainer from './Component/MainContainer/MainContainer';
import Login from './Component/Authentication/Login';
import SignUp from './Component/Authentication/SignUp';
import Forget from './Component/Authentication/Forget';
import AccountProvider from './Component/Context/AccountProvider';
import Users from './Component/Users/Users';
import CreateGroup from './Component/CreateGroup/CreateGroup';
import Groups from './Component/Groups/Groups';

function App() {
  return (
    <div>
      <AccountProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forget" element={<Forget />} />
          <Route path="/mainContainer" element={<MainContainer />} />
          <Route path="/users" element={<Users />} />
          <Route path="/groupscreate" element={<CreateGroup />} />
          <Route path="/groups" element={<Groups />} />
        </Routes>
      </AccountProvider>
    </div>
  );
}

export default App;

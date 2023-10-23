import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

//Login&Dashboard
import Login from './Page/Login';
import DashboardAdmin from './Page/DashboardAdmin';
import Dashboard from './Page/Dashboard';

//AccessPoint
import AccessPointList from './Page/AccessPointList';
import EditAccessPoint from './Page/EditAccessPoint';
import AddAccessPoint from './Page/AddAccessPoint';
import AccessPointKKU from './Page/AccessPointKKU';
import AccessPointNKC from './Page/AccessPointNKC';

//Users
import AddUsers from './Page/AddUsers';
import UserList from './Page/UserList';
import UserEdit from './Page/UserEdit';

//Switch
import SwitchList from './Page/SwitchList';
import EditSwitch from './Page/EditSwitch';
import AddSwitch from './Page/AddSwitch';
import SwitchKKU from './Page/SwitchKKU';
import SwitchNKC from './Page/SwitchNKC';

//Etc
import Maps from './Page/Maps';
import Config from './Page/Config';

//Device Corrupted
import DeviceCorrupted from './Page/DeviceCorrupted';
import AddDeviceCorrupted from './Page/AddDeviceCorrupted';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />     
      <Route path="/dbadmin" element={<DashboardAdmin />} />
      <Route path="/dbuser" element={<Dashboard />} />  
      
      <Route path="/addusers" element={<AddUsers />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/updateuser/:id" element={<UserEdit />} />

      <Route path="/accesspoint" element={<AccessPointList />} /> 
      <Route path="/updateap/:id" element={<EditAccessPoint />} />
      <Route path="/addap" element={<AddAccessPoint />} />
      <Route path="/accesspoint_kku" element={<AccessPointKKU />} /> 
      <Route path="/accesspoint_nkc" element={<AccessPointNKC />} /> 

      <Route path="/switch" element={<SwitchList />} /> 
      <Route path="/updatesw/:id" element={<EditSwitch />} />      
      <Route path="/addsw" element={<AddSwitch />} />
      <Route path="/switch_nkc" element={<SwitchNKC />} /> 
      <Route path="/switch_kku" element={<SwitchKKU />} /> 
    
      <Route path="/maps" element={<Maps />} />
      <Route path="/config" element={<Config />} />

      <Route path="/deviceclist" element={<DeviceCorrupted />} />
      <Route path="/add_dc" element={<AddDeviceCorrupted />} />

    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

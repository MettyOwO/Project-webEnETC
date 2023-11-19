import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

//Login&Dashboard
import Login from './Page/Login';
import DashboardAdmin from './Page/DashboardAdmin';
import Dashboard from './Page/User/Dashboard';

//AccessPoint
import AccessPointList from './Page/AccessPointList';
import AccessPointKKU from './Page/AccessPointKKU';
import AccessPointNKC from './Page/AccessPointNKC';

import EditAccessPoint from './Page/EditAccessPoint';
import AddAccessPoint from './Page/AddAccessPoint';

//UserAccessPoint
import UserEditAccessPoint from './Page/User/EditAccessPoint';
import UserAddAccessPoint from './Page/User/AddAccessPoint';

import UserAccessPointList from './Page/User/AccessPointList';
import UserAccessPointKKU from './Page/User/AccessPointKKU';
import UserAccessPointNKC from './Page/User/AccessPointNKC';

//Users
import AddUsers from './Page/AddUsers';
import UserList from './Page/UserList';
import UserEdit from './Page/UserEdit';

//Switch
import SwitchList from './Page/SwitchList';
import SwitchKKU from './Page/SwitchKKU';
import SwitchNKC from './Page/SwitchNKC';

import EditSwitch from './Page/EditSwitch';
import AddSwitch from './Page/AddSwitch';

//UserSwitch
import UserSwitchList from './Page/User/SwitchList';
import UserSwitchKKU from './Page/User/SwitchKKU';
import UserSwitchNKC from './Page/User/SwitchNKC';

import UserEditSwitch from './Page/User/EditSwitch';
import UserAddSwitch from './Page/User/AddSwitch';

//Etc
import Maps from './Page/Maps';
import Config from './Page/Config';

import UserMaps from './Page/User/Maps';
import UserConfig from './Page/User/Config';

import AddSite from './Page/AddSite';
import ReportAP from './Page/ReportAP';
import ReportSW from './Page/ReportSW';

import UserAddSite from './Page/User/AddSite';
import UserReportAP from './Page/User/ReportAP';
import UserReportSW from './Page/User/ReportSW';

//Device Corrupted
import DeviceCorrupted from './Page/DeviceCorrupted';
import DeviceCorruptedKKU from './Page/DeviceCorruptedKKU';
import DeviceCorruptedNKC from './Page/DeviceCorruptedNKC';

//User Device Corrupted
import UserDeviceCorrupted from './Page/User/DeviceCorrupted';
import UserDeviceCorruptedKKU from './Page/User/DeviceCorruptedKKU';
import UserDeviceCorruptedNKC from './Page/User/DeviceCorruptedNKC';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/login" element={<Login />} />     
      <Route path="/dbadmin" element={<DashboardAdmin />} />
      <Route path="/dbusers" element={<Dashboard />} />  
      
      <Route path="/addusers" element={<AddUsers />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/updateuser/:id" element={<UserEdit />} />

      {/* <Route path="/accesspoint" element={<AccessPointList />} /> */}
      {/* <Route path="/accesspoint/:site" render={(props) => <AccessPointList {...props} />}/>  */}
      <Route path="/accesspoint/:site" element={<AccessPointList />} />
      <Route path="/accesspoint_kku" element={<AccessPointKKU />} /> 
      <Route path="/accesspoint_nkc" element={<AccessPointNKC />} />
      
      <Route path="/useraccesspoint" element={<UserAccessPointList />} /> 
      <Route path="/useraccesspoint_kku" element={<UserAccessPointKKU />} /> 
      <Route path="/useraccesspoint_nkc" element={<UserAccessPointNKC />} /> 

      <Route path="/updateap/:id" element={<EditAccessPoint />} />
      <Route path="/addap" element={<AddAccessPoint />} />
      
      <Route path="/updateap2/:id" element={<UserEditAccessPoint />} />
      <Route path="/addap2" element={<UserAddAccessPoint />} />

      <Route path="/switch/:site" element={<SwitchList />} /> 
      <Route path="/switch_nkc" element={<SwitchNKC />} /> 
      <Route path="/switch_kku" element={<SwitchKKU />} />

      <Route path="/userswitch" element={<UserSwitchList />} />
      <Route path="/userswitch_nkc" element={<UserSwitchNKC />} /> 
      <Route path="/userswitch_kku" element={<UserSwitchKKU />} />

      <Route path="/updatesw/:id" element={<EditSwitch />} />      
      <Route path="/addsw" element={<AddSwitch />} />  

      <Route path="/updatesw2/:id" element={<UserEditSwitch />} />      
      <Route path="/addsw2" element={<UserAddSwitch />} />  
    
      <Route path="/maps" element={<Maps />} />
      <Route path="/config" element={<Config />} />

      <Route path="/maps2" element={<UserMaps />} />
      <Route path="/config2" element={<UserConfig />} />

      <Route path="/deviceclist/:site" element={<DeviceCorrupted />} />
      <Route path="/deviceclist_kku" element={<DeviceCorruptedKKU />} />
      <Route path="/deviceclist_nkc" element={<DeviceCorruptedNKC />} />

      <Route path="/userdeviceclist" element={<UserDeviceCorrupted />} />
      <Route path="/userdeviceclist_kku" element={<UserDeviceCorruptedKKU />} />
      <Route path="/userdeviceclist_nkc" element={<UserDeviceCorruptedNKC />} />

      <Route path="/addsite" element={<AddSite />} />
      <Route path="/report_ap/:id" element={<ReportAP />} />
      <Route path="/report_sw/:id" element={<ReportSW />} />

      <Route path="/addsite2" element={<UserAddSite />} />
      <Route path="/report_ap2/:id" element={<UserReportAP />} />
      <Route path="/report_sw2/:id" element={<UserReportSW />} />

    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

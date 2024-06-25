import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

//Import Excel
import ImportSwitch from './Page/ImportSwitch';
import ImportAccessPoint from './Page/ImportAccessPoint';

//User Import Excel
import UserImportSwitch from './Page/User/ImportSwitch';
import UserImportAccessPoint from './Page/User/ImportAccessPoint';

//Login&Dashboard
import Login from './Page/Login';
import DashboardAdmin from './Page/DashboardAdmin';
import Dashboard from './Page/User/Dashboard';

//Admin
//Users
import AddAdminAcc from './Page/AddAdminAcc';
import UserList from './Page/UserList';
import EditUser from './Page/EditUser';

//AccessPoint
import AccessPointList from './Page/AccessPointList';
import EditAccessPoint from './Page/EditAccessPoint';
import AddAccessPoint from './Page/AddAccessPoint';

//Switch
import SwitchList from './Page/SwitchList';
import EditSwitch from './Page/EditSwitch';
import AddSwitch from './Page/AddSwitch';

import AddModel from './Page/AddModel';
import AddDataSheet from './Page/AddDataSheet';
import UserAddModel from './Page/User/AddModel';
import UserAddDataSheet from './Page/User/AddDataSheet';

//Device Corrupted
import DeviceCorrupted from './Page/DeviceCorrupted';
import ReportAP from './Page/ReportAP';
import ReportSW from './Page/ReportSW';

//Users
//UserSwitch
import UserSwitchList from './Page/User/SwitchList';
import UserEditSwitch from './Page/User/EditSwitch';
import UserAddSwitch from './Page/User/AddSwitch';

//UserAccessPoint
import UserEditAccessPoint from './Page/User/EditAccessPoint';
import UserAddAccessPoint from './Page/User/AddAccessPoint';
import UserAccessPointList from './Page/User/AccessPointList';

//User Device Corrupted
import UserDeviceCorrupted from './Page/User/DeviceCorrupted';
import UserReportAP from './Page/User/ReportAP';
import UserReportSW from './Page/User/ReportSW';

//New
import Home from './Page/Home';
import DeviceAPLog from './Page/DeviceLog';
import UserHome from './Page/User/Home';
import UserDeviceAPLog from './Page/User/DeviceLog';
import EditSite from './Page/EditSite';
import SiteLog from './Page/SiteLog';
import Register from './Page/Register';
import SendMailVerify from './Page/SendVerify';
import Responsible from './Page/Responsible';
import UserSite from './Page/UserSite';
import VerifyAcc from './Page/VerifyAcc';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route path="/switch-excel" element={<ImportSwitch />} />
      <Route path="/accesspoint-excel" element={<ImportAccessPoint />} />

      <Route path="/switch-excel2" element={<UserImportSwitch />} />
      <Route path="/accesspoint-excel2" element={<UserImportAccessPoint />} />

      <Route path="/login" element={<Login />} />     
      <Route path="/dbadmin/:sitename" element={<DashboardAdmin />} />
      {/* <Route path="/dbusers/:sitename" element={<Dashboard />} />   */}
      <Route path="/dbusers" element={<Dashboard />} />  
      
      <Route path="/addadmin" element={<AddAdminAcc />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/updateuser/:id" element={<EditUser />} />

      <Route path="/accesspoint/:site" element={<AccessPointList />} />
      <Route path="/updateap/:id" element={<EditAccessPoint />} />
      <Route path="/addap" element={<AddAccessPoint />} />
   
      <Route path="/useraccesspoint/:site" element={<UserAccessPointList />} /> 
      <Route path="/updateap2/:id" element={<UserEditAccessPoint />} />
      <Route path="/addap2" element={<UserAddAccessPoint />} />

      <Route path="/switch/:site" element={<SwitchList />} /> 
      <Route path="/updatesw/:id" element={<EditSwitch />} />      
      <Route path="/addsw" element={<AddSwitch />} />  

      <Route path="/userswitch/:site" element={<UserSwitchList />} />
      <Route path="/updatesw2/:id" element={<UserEditSwitch />} />      
      <Route path="/addsw2" element={<UserAddSwitch />} />  

      <Route path="/deviceclist/:site" element={<DeviceCorrupted />} />
      <Route path="/report_ap/:id" element={<ReportAP />} />
      <Route path="/report_sw/:id" element={<ReportSW />} />

      <Route path="/userdeviceclist/:site" element={<UserDeviceCorrupted />} />
      <Route path="/report_ap2/:id" element={<UserReportAP />} />
      <Route path="/report_sw2/:id" element={<UserReportSW />} />
      
      <Route path="/add_model/:device" element={<AddModel />} />
      <Route path="/add_datasheet/:device" element={<AddDataSheet />} />
      
      <Route path="/add_model2/:device" element={<UserAddModel />} />
      <Route path="/add_datasheet2/:device" element={<UserAddDataSheet />} />

      <Route path="/home" element={<Home />} />
      <Route path="/device_log/:id" element={<DeviceAPLog />} />

      <Route path="/home2" element={<UserHome />} />
      <Route path="/device_log2/:id" element={<UserDeviceAPLog />} />
      <Route path="/site/:id" element={<EditSite />} />

      <Route path="/site_log/:site" element={<SiteLog />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sendverify" element={<SendMailVerify />} />
      <Route path="/responsible_site/:site" element={<Responsible />} />
      <Route path="/user_site/:name" element={<UserSite />} />
      <Route path="/verify_account" element={<VerifyAcc />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

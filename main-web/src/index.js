import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Login from './Page/Login';
import Dashboard from './Page/Dashboard';
import DashboardAdmin from './Page/DashboardAdmin';
import AddUsers from './Page/AddUsers';
import AccessPointList from './Page/AccessPointList';
import SwitchList from './Page/SwitchList';
import UserList from './Page/UserList';
import EditAccessPoint from './Page/EditAccessPoint';
import AddAccessPoint from './Page/AddAccessPoint';
import ImportExcel from './Page/ImportExcel';
import AccessConfig from './Page/AccessConfig';

import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />     
      <Route path="/dbusers" element={<Dashboard />} />
      <Route path="/dbadmin" element={<DashboardAdmin />} />
      <Route path="/addusers" element={<AddUsers />} />
      <Route path="/accesspoint" element={<AccessPointList />} /> 
      <Route path="/switch" element={<SwitchList />} /> 
      <Route path="/users" element={<UserList />} />
      <Route path="/updateap/:id" element={<EditAccessPoint />} />
      <Route path="/addap" element={<AddAccessPoint />} />
      <Route path="/importexcel" element={<ImportExcel />} />
      <Route path="/apconfig/:id" element={<AccessConfig />} />

    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddSWContent() {
    //Check Token API
    useEffect(() => {
        const token = localStorage.getItem("token");
        const name1 = localStorage.getItem("name");
        fetch("http://localhost:3333/authen", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token, name1,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "ok") {
            } else {
              alert("Authen Failed. Please Try Login Again!");
              localStorage.removeItem("token");
              localStorage.removeItem("name");
              window.location = "/login";
            }
          })
          .catch((error) => {
            console.log("Error:", error);
          });
        getDataSite()
        getDataSWModel()
    },[])

    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [build_name, setBuildname] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [role, setRole] = useState("Select SW Role");
    const [site, setSite] = useState("Select Site");
    const [model, setModel] = useState("Select SW Model");
    const [serial_number, setSRNumber] = useState('');
    const [mac_address, setMacNumber] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {        
        event.preventDefault();        
        if(hostname !== '' && ipswitch !== '' && build_name !== ''
        && build_group !== '' && role !== "Select SW Role" && site !== "Select Site" && model !== "Select SW Model"
        && serial_number !== '' && mac_address !== ''){
        axios
        .post('http://localhost:3333/addsw', {site ,build_name, build_group, ipswitch, hostname, role, model
        ,serial_number, mac_address})        
        .then(res => {            
            if(res.data.added){
                alert("Add Switch Data Complete!")
                navigate('/dbadmin')      
            }else{
                alert("Error! Please Try Again.")
            }       
        })
        .catch(err => console.log(err));
        }else{
            alert("Please Complete The Information!");
        } 
    }

    const [siteName,setSiteName] = useState([])
    async function getDataSite(){
        const getSiteName = await axios.get("http://localhost:3333/site_name")
        setSiteName(getSiteName.data)
    };

    const [sw_models, setSwModel] = useState([]);
    async function getDataSWModel() {
      const getModel = await axios.get("http://localhost:3333/sw_model");
      setSwModel(getModel.data);
    }

    return (
    <div>
    <Navbar variant="dark" bg="dark" expand="lg">
    <Container fluid>
        <Navbar.Brand href='/dbadmin'>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-back" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
        </svg>
        &nbsp; Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
        <Nav className="me-auto"></Nav>
        </Navbar.Collapse>
    </Container>
    </Navbar>

        <div>
            <form className="container mt-3 mb-3" onSubmit={handleSubmit}>
            <div       
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
                <h2>Add New Switch Data</h2>
            </div>              
            
            <div className='mb-4'>
            <label htmlFor='Select Site'>Site</label>
                <select 
                className="form-control" 
                onChange={e => setSite(e.target.value)}>
                    <option>Select Site</option>
                    {siteName.map ((siteName,index) => (        
                        <option key={index}>{siteName.name}</option>           
                    ))}
                </select>
            </div>          
            
            <div className='mb-4'>
                <label>Building Group</label>
                <input 
                type="text" 
                className='form-control'
                placeholder="Enter Building Group"
                required
                onChange={e => setBuildgroup(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label>Building Name</label>
                <input 
                type="text" 
                className='form-control'
                placeholder="Enter Building Name"
                required
                onChange={e => setBuildname(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label>IP Address</label>
                <input 
                type="text" 
                className='form-control'
                placeholder="Enter IP Switch"
                required
                onChange={e => setIpswitch(e.target.value)}/>
            </div>

            <div className='mb-4'>
                <label>Hostname</label>
                <input 
                type="text" 
                className='form-control'
                placeholder="Enter Hostname"
                required
                onChange={e => setHostname(e.target.value)}/>
            </div>
           
            <div className='mb-4'>
                <label htmlFor='Select Model'>Model</label>
                <select 
                    className="form-control" 
                    onChange={e => setModel(e.target.value)}>
                    <option>Select SW Model</option>                    
                    {sw_models.map((sw_models, index) => (
                    <option key={index}>{sw_models.name}</option>
                    ))}
                </select>
            </div>
            
            <div className='mb-4'>
            <label>Role</label>
                <select className="form-control" 
                onChange={e => setRole(e.target.value)}>
                    <option>Select SW Role</option>
                    {sw_models.map((sw_models, index) => (
                    <option key={index}>{sw_models.role}</option>
                    ))}
                </select>
            </div>

            <div className='mb-4'>
                <label>Serial Number</label>
                <input type="text" 
                className='form-control' 
                required
                placeholder="Enter Serial Number"
                onChange={e => setSRNumber(e.target.value)}
                />
            </div>

            <div className='mb-4'>
                <label>Mac Address</label>
                <input type="text" 
                className='form-control' 
                required
                placeholder="Enter Mac Address"
                onChange={e => setMacNumber(e.target.value)}
                />
            </div>

            <div 
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
                <button className="btn btn-primary" onClick={ handleSubmit }>Add Data!</button>   
            </div>
            </form>
        </div> 
    </div>
)}

export default function AddSwitch() {
    return <AddSWContent />
}
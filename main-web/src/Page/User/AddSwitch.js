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
        const email = localStorage.getItem("email");
        const site1 = localStorage.getItem("site");
        const name1 = localStorage.getItem("name");
        fetch("http://localhost:3333/authen", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token, email, site1, name1
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "ok") {
            } else {
              alert("Authen Failed. Please Try Login Again!");
              localStorage.removeItem("token");
              localStorage.removeItem("email");
              localStorage.removeItem("site");
              localStorage.removeItem("name");
              window.location = "/login";
            }
          })
          .catch((error) => {
            console.log("Error:", error);
          });
    },[])

    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [build_name, setBuildname] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [role, setRole] = useState("Select SW Role");
    const [model, setModel] = useState("Select SW Model");
    const [serial_number, setSRNumber] = useState('');
    const [mac_address, setMacNumber] = useState('');
    const navigate = useNavigate();

    const username1 = localStorage.getItem("name");
    const [device_type, SetDVType] = useState("SW");

    function handleSubmit(event) {        
        event.preventDefault();        
        if(hostname !== '' && ipswitch !== '' && build_name !== ''
        && build_group !== '' && role !== "Select SW Role" && model !== "Select SW Model"
        && serial_number !== '' && mac_address !== ''){
            const lowercaseInputValue1 = hostname.toLowerCase();
            const lowercaseArray1 = sw_list1.map(element => element.toLowerCase());
            const lowercaseInputValue2 = serial_number.toLowerCase();
            const lowercaseArray2 = sw_list2.map(element => element.toLowerCase());
            const lowercaseInputValue3 = mac_address.toLowerCase();
            const lowercaseArray3 = sw_list3.map(element => element.toLowerCase());
            // Check if the lowercaseInputValue exists in the lowercaseArray
            if (lowercaseArray1.includes(lowercaseInputValue1)) {
                // If it already exists, show an alert
                alert(`Hostname : "${hostname}" already exists in database. Please try again!`);
            }
            else if (lowercaseArray2.includes(lowercaseInputValue2)) {
                // If it already exists, show an alert
                alert(`Serial Number : "${serial_number}" already exists in database. Please try again!`);
            }
            else if (lowercaseArray3.includes(lowercaseInputValue3)) {
                // If it already exists, show an alert
                alert(`Mac Address : "${mac_address}" already exists in database. Please try again!`);
            }else{        
        axios
        .post('http://localhost:3333/addsw', {site ,build_name, build_group, ipswitch, hostname, role, model
        ,serial_number, mac_address, username1, device_type})        
        .then(res => {            
            if(res.data.added){
                alert("Add Switch Data Complete!")
                navigate('/dbusers')      
            }else{
                alert("Error! Please Try Again.")
            }       
        })
        .catch(err => console.log(err));
        }}else{
            alert("Please Complete The Information!");
        } 
    }

    const [sw_models, setSwModel] = useState([]);
    const [sw_models2, setSwModel2] = useState([]);
    const [site, setSite] = useState([]);

    const [sw_list1, setSwList1] = useState([]);
    const [sw_list2, setSwList2] = useState([]);
    const [sw_list3, setSwList3] = useState([]);
    async function getData() {
      const getModel = await axios.get("http://localhost:3333/sw_model");
      const getModel2 = await axios.get("http://localhost:3333/sw_model2");
      const siteLocation = localStorage.getItem("site");
      
      const getSwList = await axios.get("http://localhost:3333/swlist");
      const SWdata1 = []
      const SWdata2 = []
      const SWdata3 = []
      getSwList.data.map((item)=>{    
        SWdata1.push(item.hostname)
        SWdata2.push(item.serialno)
        SWdata3.push(item.macaddress)
    })
    setSwList1(SWdata1);
    setSwList2(SWdata2);
    setSwList3(SWdata3);

      setSite(siteLocation)
      setSwModel(getModel.data);
      setSwModel2(getModel2.data);
    }
    useEffect(() => {
        getData()
    }, []);

    return (
    <div>
    <Navbar variant="dark" bg="dark" expand="lg">
    <Container fluid>
        <Navbar.Brand href='/dbusers'>
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
            
            <div className="mb-4">
              <label>Site</label>
              <input
                type="text"
                className="form-control"
                value={site}
                disabled
                onChange={(e) => setSite(e.target.value)}
              />
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
                    {sw_models2.map((sw_models2, index) => (
                    <option key={index}>{sw_models2.role}</option>
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
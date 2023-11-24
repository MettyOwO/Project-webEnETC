import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditAPContent() {
    //Check Token API
    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch ('http://localhost:3333/authen', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+token
            },
        })   
        .then(response => response.json())
        .then(data => {
        if(data.status === 'ok'){
        }else{
            alert('Authen Failed. Please Try Login Again!')
            localStorage.removeItem('token')
            window.location = '/login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
        getDataAPModel()
    },[])

    //Access Point List With AP_ID API
    const {id} = useParams();
    const [hostname, setHostname] = useState('');
    const [ipswitch, setIpswitch] = useState('');
    const [build_name, setBuildname] = useState('');
    const [build_group, setBuildgroup] = useState('');
    const [model, setModel] = useState('');
    const [role, setRole] = useState('');
    const [serial_number, setSRNumber] = useState('');
    const [url, setUrl] = useState("");
    useEffect(() => {
        axios
        .get('http://localhost:3333/aplistwithid/'+id)
        .then(res => {
            setHostname(res.data[0].APname);
            setIpswitch(res.data[0].IPswitch);
            setBuildname(res.data[0].Buildname);
            setBuildgroup(res.data[0].Buildgroup);
            setModel(res.data[0].Model);
            setRole(res.data[0].Role);
            setSRNumber(res.data[0].Serialnumber)
            setUrl(res.data[0].urlmap);
        })
        .catch(err => console.log(err));
    },[id])

    //Update AP API
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (hostname !== '' && ipswitch !== '' && build_name !== '' && build_group !== '' && serial_number !== '') {
            axios
            .put('http://localhost:3333/updateap/'+id, {role, build_name, build_group,
            ipswitch, model, hostname, url, serial_number}) 
            .then(res => {
                if(res.data.updated){
                    alert("Update Access Point ID : " + (id) + " Complete!")
                    //navigate('/accesspoint')
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

    const [ap_models, setApModel] = useState([]);
    async function getDataAPModel() {
      const getModel = await axios.get("http://localhost:3333/ap_model");
      setApModel(getModel.data);
    }

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href='/dbadmin'>Back To Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example"/>
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
                <h2>Edit Access Point Data</h2>
            </div> 
                <div className='mb-4'>
                    <label htmlFor=''>Hostname</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={hostname} 
                    onChange={e => setHostname(e.target.value)}/>
                </div>
 
                <div className='mb-4'>
                    <label htmlFor=''>IP Switch</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={ipswitch} 
                    onChange={e => setIpswitch(e.target.value)}/>
                </div>
                
                <div className='mb-4'>
                    <label htmlFor=''>Building Name</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={build_name} 
                    onChange={e => setBuildname(e.target.value)}/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Building Group</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={build_group} 
                    onChange={e => setBuildgroup(e.target.value)}/>
                </div>

                <div className='mb-4'>
                    <label htmlFor='Select Model'>Model</label>
                    <select 
                    className="form-control" 
                    value={model} 
                    onChange={e => setModel(e.target.value)}>                
                        {ap_models.map((ap_models, index) => (
                            <option key={index}>{ap_models.name}</option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Role</label>
                    <select 
                    className="form-control" 
                    value={role} 
                    onChange={e => setRole(e.target.value)}>             
                        {ap_models.map((ap_models, index) => (
                            <option key={index}>{ap_models.role}</option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Serial Number</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={serial_number} 
                    onChange={e => setSRNumber(e.target.value)}/>
                </div>
                
                {url !== "" && (
                <div className='mb-4'>
                    <label htmlFor=''>Map URL</label>
                    <input type="text" 
                    placeholder='' 
                    className='form-control'
                    value={url} 
                    onChange={e => setUrl(e.target.value)}/>
                </div>
                )}
                <div
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <button className="btn btn-primary" onClick={ handleSubmit }>Update Data</button>  
                </div>             
            </form>
        </div> 
        </div>
      );
    }
    
export default function EditAccessPoint() {
    return <EditAPContent />
}
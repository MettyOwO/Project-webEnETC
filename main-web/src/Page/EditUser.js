import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditUserContent() {
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
    },[])

    const {id} = useParams();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [site, setSite] = useState("");
    useEffect(() => {
        axios.get('http://localhost:3333/userlist2/'+id)
        .then(res => {
            setName(res.data[0].name);
            setRole(res.data[0].role);
            setSite(res.data[0].site);           
        })
        .catch(err => console.log(err));
    },[id])

    //Update AP API
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name !== '') {
        axios.put('http://localhost:3333/updateuser/'+id, {name ,role, site}) 
        .then(res => {
            if(res.data.updated){
                alert("Update User Data ID : " + (id) + " Complete!")
                navigate('/users')    
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
    async function getDataSite() {
      const getSiteName = await axios.get("http://localhost:3333/site_name")
      setSiteName(getSiteName.data)
    }
    useEffect(() => {
      getDataSite();
    }, []);

    //UI
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
                <h2>Edit User Data</h2>
            </div> 

                <div className='mb-4'>
                    <label htmlFor=''>Name</label>
                    <input type="text" placeholder='' className='form-control'
                    value={name} onChange={e => setName(e.target.value)}/>
                </div>

                <div className='mb-4'>
                <label htmlFor=''>Role</label>
                <select class="form-control" value={role} onChange={e => setRole(e.target.value)}>
                    <option>Admin</option>
                    <option>Customer</option>
                </select>
                </div>

                <div className="mb-4">
                    <label>Site</label>
                    <select
                    className="form-control"
                    onChange={(e) => setSite(e.target.value)}
                    value={site}
                    >
                        <option value="None">None (For Admin)</option>
                        {siteName.map((siteName, index) => (
                            <option key={index}>{siteName.name}</option>             
                        ))}
                </select>
                </div>

                <div
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <button className="btn btn-primary" onClick={ handleSubmit }>Update!</button>  
                </div>
                 
            </form>
        </div> 
        </div>
      );
    }
    
export default function EditUser() {
    return <EditUserContent />
}
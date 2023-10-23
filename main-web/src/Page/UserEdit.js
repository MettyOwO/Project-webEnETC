import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserEditContent() {
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

    //Access Point List With AP_ID API
    const {id} = useParams();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    useEffect(() => {
        axios.get('http://localhost:3333/userlist2/'+id)
        .then(res => {
            setName(res.data[0].name);
            setRole(res.data[0].role);
        })
        .catch(err => console.log(err));
    },[])

    //Update AP API
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://localhost:3333/updateuser/'+id, {name ,role}) 
        .then(res => {
            if(res.data.updated){
                alert("Update User Data Complete!")
                navigate('/users')    
            }else{
                alert("Error! Please Try Again.")
            }                
        })
        .catch(err => console.log(err));
    }
    
    //Log Out
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/login'
    }

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/users">Back To User List</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto"></Nav>
            <Nav>
                <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
            </Nav>
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
                    <label htmlFor=''>UserName</label>
                    <input type="text" placeholder='' className='form-control'
                    value={name} onChange={e => setName(e.target.value)}/>
                </div>

                <div className='mb-4'>
                <label htmlFor=''>Role</label>
                <select class="form-control" value={role} onChange={e => setRole(e.target.value)}>
                    <option>admin</option>
                    <option>customer</option>
                </select>
                </div>

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
    
export default function UserEdit() {
    return <UserEditContent />
}
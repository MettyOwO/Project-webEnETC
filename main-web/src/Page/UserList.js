import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';


function UserListContent() {
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
            //ไม่ต้องทำอะไร
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

    //User List API
    const [userlist, setUserList] = useState([]); 
    useEffect(() => {
        axios.get('http://localhost:3333/users')        
        .then(res => setUserList(res.data))        
        .catch(err => console.log(err));   
      }, [])

    //Log Out Function
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/login'
    }

    //User Delete Function
    const handleDelete = async (id) => {
        try {           
            alert("Delete User ID : " + (id) + " Complete")
            axios.delete('http://localhost:3333/deleteuser/'+id)
            window.location.reload();          
        }
        catch(err){            
            console.log(err);        
        }
    }

    //Back Function
    const handleBack = (event) => {
        event.preventDefault();
        window.location = '/dbadmin'
    }        

    return (
    <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/dbadmin">Back To Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto"></Nav>
            <Nav>
                <Nav.Link onClick={ handleLogout }>Log-Out</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        
        <div className='vh-100 justify-content-center align-items-center'>
            <div className='bg-white p-3'>
                <div       
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <h2>Users List</h2>
                </div> 
                <Link to="/addusers" className='btn btn-success'>Add Data</Link><br/><br/>
                    <table class="table table-bordered">
                        <thead class="thead-light">
                            <tr>
                                <th scope="col">Email</th>
                                <th scope="col">Name</th>
                                <th scope="col">Type User</th>
                                <th scope="col">Edit & Delete</th>
                            </tr>
                        </thead>
                        {userlist.map (userlist => (
                            <tbody>
                                <tr key={userlist.ID}>
                                    <td>{userlist.email}</td>
                                    <td>{userlist.name}</td>
                                    <td>{userlist.role}</td>
                                    <td><Link to= {`/updateuser/${userlist.ID}`} className="btn btn-primary">Edit</Link>&nbsp;
                                    <button className='btn btn-danger ms-2' onClick={ e => handleDelete(userlist.ID)}>Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        ))}    
                    </table>
            </div>
        </div>
    </div>          
    );
}
    
export default function UserList() {
    return <UserListContent />
}
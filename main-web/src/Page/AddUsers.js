import React, { useEffect } from 'react';

import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddUsersContent() {
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
            window.location = '/Login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
    },[])    
    
    //Register API
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);   
      const jsonData = {
        email: data.get('email'),
        password: data.get('password'),
        name: data.get('name'),
        role: data.get('role'),
      }
      
        fetch ('http://localhost:3333/register', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        })   
        .then(response => response.json())
        .then(data => {
          if(data.status === 'ok'){
            alert('Register Sucess')
            window.location = '/users'
          }else{
            alert('Register Failed')
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    };

    //Log Out Function
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location = '/Login'
    }    
    
    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/users">Back To Users List</Navbar.Brand>
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
              justifyContent: 'center',}}>
                <h2>Add User Data</h2>
            </div>           
            <div className="mb-4">
              <label>Email</label>
              <input class="form-control" id="email" name="email" required/>
            </div> 
          
          <div class="mb-4">
            <label>Password</label>
            <input class="form-control" id="password" name="password" required/>
          </div>
          
          <div class="mb-4">
            <label>Name</label>
            <input class="form-control" id="name" name="name" required/>
          </div>
          
          <div class="mb-4">
          <label>Role</label>
            <select class="form-control" id="role" name="role" required>
              <option>Select User Role</option>
              <option>Customer</option>
              <option>Admin</option>
            </select>
          </div>
          <div 
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <button type="submit" class="btn btn-primary">Add User</button>
          </div>
        </form>
        </div>
        </div>          
      );
    }
    
export default function AddUsers() {
    return <AddUsersContent />
}
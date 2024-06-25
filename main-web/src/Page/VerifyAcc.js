import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from "../components/SearchBar";

function VerifyAccContent() {
    //Check Token API
    useEffect(() => {
        const token = localStorage.getItem('token')
        const name1 = localStorage.getItem("name");
        fetch ('http://localhost:3333/authen', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+token, name1
            },
        })   
        .then(response => response.json())
        .then(data => {
        if(data.status === 'ok'){

        }else{
            alert('Authen Failed. Please Try Login Again!')
            localStorage.removeItem('token')
            localStorage.removeItem("name");
            window.location = '/login'
        }
        })
        .catch((error) => {
        console.log("Error:", error);
        });
        getDataUser()
    },[])
    
    const [userlist, setUserList] = useState([]);
    async function getDataUser(){
        const getUser = await axios.get('http://localhost:3333/users')
        setUserList(getUser.data);
    };
    
    const handleSubmit = async (email) => {
        try {
            alert("Verify Account : " + (email) + " Complete")
            axios.post('http://localhost:3333/verify_account/'+email)
            window.location.reload();                             
        }
        catch(err){            
            console.log(err);        
        }
    }

    // Search bar
    const handleSearch = (searchTerm) => { 
        // Perform your search logic here and update the filtered data
        console.log(searchTerm.length);
        if (searchTerm.length > 0) {
         
          const filteredResults = userlist.filter((item) =>
            Object.values(item).some(
              (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
          console.log(filteredResults);
          setUserList(filteredResults);
        } else {
            getDataUser();
        }
        console.log(searchTerm);
        };

    return (
    <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
        <Navbar.Brand href="/users">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
            <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1"/>
        </svg>
        &nbsp; Users List
        </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-dark-example" />
            <Navbar.Collapse id="navbar-dark-example">
            <Nav className="me-auto">
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
                    <h2>Verify Account</h2>
                </div> 
                Filter : &nbsp;&nbsp; <SearchBar data={userlist} onSearch={handleSearch} />
                <br/><br/>
                    <table className="table table-bordered">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Email</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email Verify</th>
                                <th scope="col">Account Verify</th>
                                <th scope="col">Submit</th>
                            </tr>
                        </thead>
                        <tbody>
                        {userlist.map ((userlist,index) => (                          
                                <tr key={index}>           
                                    <td>{userlist.email}</td>
                                    <td>{userlist.name}</td>
                                    {userlist.emailverify === "true" && (
                                        <td>ยินยันแล้ว</td>
                                    )}
                                    {userlist.emailverify === "false" && (
                                        <td>ยังไม่ได้ยืนยัน</td>
                                    )}
                                    {userlist.verify_acc === "true" && (
                                        <td>ยินยันแล้ว</td>
                                    )}
                                    {userlist.verify_acc === "false" && (
                                        <td>ยังไม่ได้ยืนยัน</td>
                                    )}
                                    {userlist.role === "Admin" && (
                                    <td><Link to="#" className="btn btn-danger">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ban-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M2.71 12.584q.328.378.706.707l9.875-9.875a7 7 0 0 0-.707-.707l-9.875 9.875Z"/>
                                    </svg>
                                    </Link>
                                    </td>
                                    )}
                                    {userlist.role === "User" && userlist.verify_acc === "false" && (
                                    <td>
                                    <Link onClick={ e => handleSubmit(userlist.email)} className="btn btn-warning">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                     </svg>
                                    </Link>
                                    </td>
                                    )}
                                    {userlist.role === "User" && userlist.verify_acc === "true" && (
                                    <td><Link to="#" className="btn btn-success">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                     </svg>
                                    </Link>
                                    </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>    
                    </table>
                </div>
            </div>
        </div>          
    );
}
    
export default function VerifyAcc() {
    return <VerifyAccContent />
}
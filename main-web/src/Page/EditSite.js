import React, { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditSiteContent() {
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
    }, []);

    const {id} = useParams();
    const [name, setName] = useState('');
    const [contact_name, setContactName] = useState("");
    const [contact_tel, setContactTel] = useState("");
    // const [open_hour, setOpenHr] = useState("");
    // const [close_hour, setCloseHr] = useState("");
    const [s_day, setSDay] = useState("");
    const [s_month, setSMonth] = useState("");
    const [s_year, setSYear] = useState("");
    const [e_day, setEDay] = useState("");
    const [e_month, setEMonth] = useState("");
    const [e_year, setEYear] = useState("");
    useEffect(() => {
        axios.get('http://localhost:3333/site/'+id)
        .then(res => {
            setName(res.data[0].name);
            setContactName(res.data[0].contact_name);
            setContactTel(res.data[0].contact_tel); 
            setSDay(res.data[0].start_period[0]+res.data[0].start_period[1]);
            setSMonth(res.data[0].start_period[3]+res.data[0].start_period[4]);
            setSYear(res.data[0].start_period[6]+res.data[0].start_period[7]+res.data[0].start_period[8]+res.data[0].start_period[9]);
            setEDay(res.data[0].end_period[0]+res.data[0].end_period[1]);
            setEMonth(res.data[0].end_period[3]+res.data[0].end_period[4]);
            setEYear(res.data[0].end_period[6]+res.data[0].end_period[7]+res.data[0].end_period[8]+res.data[0].end_period[9]);
        })
        .catch(err => console.log(err));
    },[id])
    
    console.log(s_day)

    //Update AP API
    const site1 = localStorage.getItem("site");
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name !== '' && contact_name !== '' && contact_tel !== '' 
        && s_day !== 'Select Days' && s_month !== 'Select Months' && s_year !== 'Select Years'
        && e_day !== 'Select Days' && e_month !== 'Select Months' && e_year !== 'Select Years') {
        axios.put('http://localhost:3333/updatesite/'+id, {name ,contact_name, contact_tel, s_day, s_month, s_year, e_day, e_month, e_year}) 
        .then(res => {
            if(res.data.updated){
                alert("Update Site Data ID : " + (id) + " Complete!")
                navigate('/home')    
            }else{
                alert("Error! Please Try Again.")
            }                
        })
        .catch(err => console.log(err));
        }else{
            alert("Please Complete The Information!");
        }
    }

    //UI
    return (
        <div>
        <Navbar variant="dark" bg="dark" expand="lg">
        <Container fluid>
            <Navbar.Brand href='/home'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
            </svg>
            &nbsp; Home
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
                <h2>Edit Site Data</h2>
            </div> 

                <div className='mb-4'>
                    <label htmlFor=''>Name</label>
                    <input type="text" placeholder='' className='form-control'
                    value={name} onChange={e => setName(e.target.value)}/>
                </div>

                
                <div className='mb-4'>
                    <label htmlFor=''>Contact Name</label>
                    <input type="text" placeholder='' className='form-control'
                    value={contact_name} onChange={e => setContactName(e.target.value)}/>
                </div>

                <div className='mb-4'>
                    <label htmlFor=''>Contact Name</label>
                    <input type="text" placeholder='' className='form-control'
                    value={contact_tel} onChange={e => setContactTel(e.target.value)} maxLength={10}/>
                </div>

                <div className='mb-4'>
                    <label>Start Period</label>
                    <select className="form-control mb-3" 
                    onChange={e => setSDay(e.target.value)} 
                    value={s_day}>
                    <option defaultValue>Select Days</option>
                        <option>01</option>
                        <option>02</option>
                        <option>03</option>
                        <option>04</option>
                        <option>05</option>
                        <option>06</option>
                        <option>07</option>
                        <option>08</option>
                        <option>09</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                        <option>13</option>
                        <option>14</option>
                        <option>15</option>
                        <option>16</option>
                        <option>17</option>
                        <option>18</option>
                        <option>19</option>
                        <option>20</option>
                        <option>21</option>
                        <option>22</option>
                        <option>23</option>
                        <option>24</option>
                        <option>25</option>
                        <option>26</option>
                        <option>27</option>
                        <option>28</option>
                        <option>29</option>
                        <option>30</option>
                        <option>31</option>
                     </select>
                    <select className="form-control mb-3" 
                    onChange={e => setSMonth(e.target.value)} 
                    value={s_month}>
                    <option defaultValue>Select Month</option>
                    <option>01</option>
                        <option>02</option>
                        <option>03</option>
                        <option>04</option>
                        <option>05</option>
                        <option>06</option>
                        <option>07</option>
                        <option>08</option>
                        <option>09</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>                     
                    </select>
                    <select className="form-control mb-3" 
                    onChange={e => setSYear(e.target.value)} 
                    value={s_year}>
                    <option defaultValue>Select Years</option>
                        <option>2020</option>
                        <option>2021</option>
                        <option>2022</option>
                        <option>2023</option>
                        <option>2024</option>
                        <option>2025</option>
                        <option>2026</option>
                        <option>2027</option>
                        <option>2028</option>
                        <option>2029</option>
                        <option>2030</option>
                    </select>
                </div>

                <div className='mb-4'>
                    <label>End Period</label>
                    <select className="form-control mb-3" 
                    onChange={e => setEDay(e.target.value)} 
                    value={e_day}>
                    <option defaultValue>Select Days</option>
                        <option>01</option>
                        <option>02</option>
                        <option>03</option>
                        <option>04</option>
                        <option>05</option>
                        <option>06</option>
                        <option>07</option>
                        <option>08</option>
                        <option>09</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                        <option>13</option>
                        <option>14</option>
                        <option>15</option>
                        <option>16</option>
                        <option>17</option>
                        <option>18</option>
                        <option>19</option>
                        <option>20</option>
                        <option>21</option>
                        <option>22</option>
                        <option>23</option>
                        <option>24</option>
                        <option>25</option>
                        <option>26</option>
                        <option>27</option>
                        <option>28</option>
                        <option>29</option>
                        <option>30</option>
                        <option>31</option>
                     </select>
                    <select className="form-control mb-3" 
                    onChange={e => setEMonth(e.target.value)} 
                    value={e_month}>
                    <option defaultValue>Select Month</option>
                    <option>01</option>
                        <option>02</option>
                        <option>03</option>
                        <option>04</option>
                        <option>05</option>
                        <option>06</option>
                        <option>07</option>
                        <option>08</option>
                        <option>09</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>                     
                    </select>
                    <select className="form-control mb-3" 
                    onChange={e => setEYear(e.target.value)} 
                    value={e_year}>
                    <option defaultValue>Select Years</option>
                        <option>2020</option>
                        <option>2021</option>
                        <option>2022</option>
                        <option>2023</option>
                        <option>2024</option>
                        <option>2025</option>
                        <option>2026</option>
                        <option>2027</option>
                        <option>2028</option>
                        <option>2029</option>
                        <option>2030</option>
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
    
export default function EditSite() {
    return <EditSiteContent />
}
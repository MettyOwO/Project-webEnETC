import React, { useEffect, useState } from 'react';
import *as xlsx from 'xlsx';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


function IEContent() {
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

    const [excelData, setExcelData]= useState([]);
    const readExcel = async(e)=>{
        const file= e.target.files[0];
        const data= await file.arrayBuffer(file);
        const excelfile= xlsx.read(data);
        const excelsheet= excelfile.Sheets[excelfile.SheetNames[0]];
        const exceljson= xlsx.utils.sheet_to_json(excelsheet);
        setExcelData(exceljson);      
    }
    
    function handleSubmit(event) {        
        event.preventDefault();        
        axios.post('http://localhost:3333/importexcel',)        
        .then(res => {            
   
        })
        .catch(err => console.log(err));    
    }

    //UI       
    return(
        <React.Fragment>
              <Container className="content">
               <div className="row fthight">               
               <div className="col-md-4 ">
               <h3 className='mt-3'>Fetch Excel Data</h3>
               <label className="form-label">Upload File</label>
               <input type="file" className="form-control" onChange={ (e)=>readExcel(e) } />
               </div>
               
               <div className="col-md-12 mt-3">   
               { excelData.length >= 1 && (
                <form onSubmit={handleSubmit}>
                <table className="table">
                  <thead>
                     <tr>
                        <th>ID</th>
                        <th>Hostname</th>
                     </tr>
                  </thead>
                  <tbody>
                    {                     
                    excelData.map( (getdata, index)=>(
                     <tr key={index}>                      
                        <td><input type="text" className='form-control' value={index+1} /></td>
                        <td><input type="text" className='form-control'
                        value={getdata.hostname}/></td>
                     </tr>
                     ))}
                  </tbody>
                </table>
                <button className="btn btn-primary" onClick={ handleSubmit }>Add</button> 
                </form>
               )
            }
            </div>
            </div>
        </Container>
        </React.Fragment>
    );
}   
export default function ImportExcel() {
    return <IEContent />
}
//Test push git by Fluke.
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
      Network Maintenance Information System Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  //Submit
  const handleSubmit = (event) =>{
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    //Login API
    fetch ('http://localhost:3333/login',{
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
        body: JSON.stringify(jsonData),
      })   
      
      .then(response => response.json())  
      .then(data =>{
        if(jsonData.email.length === 0 || jsonData.password.length === 0) {
          alert("Error! please enter email and password again.")
        }else if(data.status === 'error2'){
          alert("Error! please verify your email. (You can check this via email you used to register.)")
        }else if(data.status === 'error3'){
          alert("Error! please wait admin to verify you account.")
        }       
        else{
        const role = data.role;
        const name = data.name;
        if(data.status === 'ok' && role === 'Admin'){
          alert('Login Success! Username : ' + name)
          localStorage.setItem('token', data.token)
          localStorage.setItem('name', data.name)
          localStorage.setItem('role', data.role)
          window.location = '/home'
        }else if(data.status === 'ok' && role === 'User'){
          alert('Login Success! Username : ' + name)
          localStorage.setItem('name', data.name)
          localStorage.setItem('token', data.token)
          localStorage.setItem('role', data.role)
          window.location= '/home2'
        }else{
          alert(`Login Failed. email : "${jsonData.email}" don't exists in database or password is not correct. Please try again!`)
        }
      }})
    .catch((error) =>{
      console.log("Error:", error);
    });
  };
  
  //UI
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus/>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"/>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
          </Box>
          <Link color="inherit" href="/register"> 
              Not have a account? Register here!
          </Link>
          <Link color="inherit" href="/sendverify"> 
              If you don't receive verify email? Click here!
          </Link>
        </Box>
        <Copyright sx={{ mt: 2, mb: 2 }} />
      </Container>
    </ThemeProvider>
  );
}
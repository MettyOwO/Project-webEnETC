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
    console.log(jsonData.email)
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
        }else{
        const role = data.role;
        const name = data.name;
        if(data.status === 'ok' && role === 'Admin'){
          alert('Login Success! Username : ' + name)
          localStorage.setItem('token', data.token)
          localStorage.setItem('name', data.name)
          window.location = '/home'
        }else if(data.status === 'ok' && role === 'Customer'){
          alert('Login Success! Username : ' + name + ' , Site : ' + (data.site))
          localStorage.setItem('name', data.name)
          localStorage.setItem('token', data.token)
          localStorage.setItem('email', data.email)
          localStorage.setItem('site', data.site)
          window.location= '/home2'
        }else{
          alert(`Login Failed. email : "${jsonData.email}" don't exists in database or password is not correct. Please Try Again!`)
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
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
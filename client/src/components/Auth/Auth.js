import React, { useEffect, useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core'; 
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles.js';
import Input from './Input';
import Icon from './icon';
import { useDispatch } from 'react-redux';
import { gapi } from 'gapi-script';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom'; 
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''}; 
const Auth = () => {
  const clientId = "627264005289-4l1oli9iitfdh9tend1min35ujl667f0.apps.googleusercontent.com";
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);
const [isSignup, setIsSignup] = useState(false);
const [formData, setFormData] = useState(initialState);

const handleSubmit = (e) => {
  e.preventDefault();
  if(isSignup) {
   dispatch(signup(formData, navigate));
  } else {
    dispatch(signin(formData, navigate));
  }
};

const handleChange = (e) => {
 setFormData({...formData, [e.target.name]: e.target.value})
};

const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

const switchMode = () => {
  setIsSignup((prevIsSignup) => !prevIsSignup);
  setShowPassword(false);
}

useEffect(() => {
  function start() {
    gapi.auth2.init({
      clientId: clientId,
      scope: ""
    })
  }
  gapi.load('client: auth2', start)
});


const googleSuccess = async(res) => {
  const result = res?.profileObj;
  const token = res?.tokenId;

  try {
    dispatch({type: 'AUTH', data: { result, token }});
    navigate('/');
  } catch (error) {
    console.log(error);
  }
};

const googleFailure = (error) => {
  console.log(error);
  console.log("Google Sign In was unsuccessful. Try Again Later");
};

  return (
  <Container component="main" maxWidth="xs">
    <Paper className={classes.paper} elevation={3}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
       <Grid container spacing={2}>
         {
           isSignup && (
             <>
             <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
             <Input name="lastName" label="Last Name" handleChange={handleChange} half/>
             </>
           )
         }
         <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
         <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
          { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
       <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>{isSignup ? 'Sign Up' : 'Sign In'}</Button>

                  <GoogleLogin 
             clientId={clientId}
             render={(renderProps) => (
               <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">Google Sign In</Button>
             )}
              onSuccess={googleSuccess}
              onFailure={googleFailure}
              cookiePolicy={'single_host_origin'}
             /> 
   
       </Grid>
       <Grid container justifyContent="flex-end">
           <Grid item>


                <Button onClick={switchMode}>
                  {isSignup ? 'Already have an account? Sign In': "Don't have an account? Sign Up"}
                </Button>
           </Grid>
       </Grid>
      </form>
    </Paper>
  </Container>
  )
}

export default Auth
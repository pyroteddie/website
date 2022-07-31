import React, { useEffect, useState } from 'react';
import '../style.css';
import * as data from '../firebase'
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword,signOut  } from "firebase/auth";
import {  BrowserRouter as Router,  Routes,  Route} from "react-router-dom";

import AdminScreen from './admin';

const app = initializeApp(data.firebaseConfig);
const auth = getAuth(app);


export default function AdminSignOnScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false); 
  const [user,setUser]= useState('');
  const [pass,setPass]= useState('');
  const [Signuser, SetSignuser] = useState('');
  

  
  useEffect(() => {

  }, []);

  function SignIn(email,pass){
    signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      // Signed in 
      SetSignuser(userCredential.user.email);
      
      setIsSignedIn(true);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }
  function signOutuser(){
    signOut(auth).then(() => {
      setIsSignedIn(false);
    }).catch((error) => {
      // An error happened.
    });
  }

  if (!isSignedIn) {
    return (
      <div>
        <h1>Admin</h1>
        <p>Please sign-in:</p>
        <input type='email' onChange={(e) => setUser(e.target.value)}/>
        <input type='Password' onChange={(e) => setPass(e.target.value)}/>
        <button onClick={()=> SignIn(user,pass)}>Sign In</button>
      </div>
    );
  }
    return (
      <div>
       <div>
       <h1>Admin</h1>
        <p>Welcome {Signuser}! You are now signed-in!</p>
        <a onClick={() => signOutuser()}>Sign-out</a>
        
      

      </div>

      </div>
    );
  }
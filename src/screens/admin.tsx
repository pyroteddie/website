import React, { useEffect, useState } from 'react';
import '../style.css';
import * as data from '../firebase'
import { initializeApp } from 'firebase/app';
import { getAuth, signOut  } from "firebase/auth";

const app = initializeApp(data.firebaseConfig);
const [isSignedIn, setIsSignedIn] = useState(false); 

const auth = getAuth(app);
function signOutuser(){
    signOut(auth).then(() => {
      setIsSignedIn(false);
    }).catch((error) => {
      // An error happened.
    });
  }
export default function AdminScreen(User) {
    return (
      <div>
       <h1>Admin</h1>
        <p>Welcome {User}! You are now signed-in!</p>
        <a onClick={() => signOutuser()}>Sign-out</a>
        
      

      </div>
    );
  }
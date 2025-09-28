import React from 'react';
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../redux/user/userSlice';

function OAuth() {
  const dispatch=useDispatch()
  const navigate=useNavigate()
    const handleGoolgeClick=async()=>{
        try{
          const provider= new GoogleAuthProvider();
          const auth=getAuth(app);

          const result=await signInWithPopup(auth,provider)
          const res=await fetch(' https://mern-estate-xv51.onrender.com/api/auth/google',{
            method:'POST',
            headers:{
              "Content-Type":"application/json",

            },
            body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
          })
          const data=await res.json()
          dispatch(signInSuccess(data));
          navigate("/")
          


        }catch(error){
          console.log(error)  
        }
    }
  return (
    <button onClick={handleGoolgeClick}type='button'className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>  )
}

export default OAuth
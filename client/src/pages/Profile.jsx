import React, { useState } from 'react';
import {Link} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice';

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUpdateSuccess(false);
    try {
      dispatch(updateUserStart());
  
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }
  
      const updatedData = { ...formData };
      if (!formData.password) {
        delete updatedData.password; // Remove password if it's not being updated
      }
  
      const res = await fetch(`http://localhost:5000/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update profile');
      }
  
      const data = await res.json();
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setError(error.message || 'An unexpected error occurred');
    }
  };
  const handleDeleteuser=async ()=>{
    const token = localStorage.getItem('access_token');
if (!token) {
  throw new Error('No authentication token found. Please sign in again.');
}

    try {
      dispatch(deleteUserStart());
      const res=await fetch(`http://localhost:5000/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      
      });
      const data=await res.json()
      console.log(data)
      if(!data.msg){
        console.log("you are the dumbest ...")
        return 
      }
      localStorage.removeItem("token")
      dispatch(deleteUserSuccess(data.msg))
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  };
  const handleSignOut= async()=>{
    try {
      dispatch(signOutUserStart())
      const res= await fetch("http://localhost:5000/api/auth/signOut");
      const data=await res.json()
      if(data.success==false){
        dispatch(signOutUserFailure(data.message))
        return 
      }
      dispatch(signOutUserSuccess())
    } catch (error) {
      dispatch(signOutUserFailure(data.message))
      
    }

  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={formData.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={formData.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={formData.password}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          Update
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity:95' to={"/create-listing"}> Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteuser}className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut}className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && <p className="text-green-700 mt-5">Profile updated successfully!</p>}
    </div>
  );
}

export default Profile;

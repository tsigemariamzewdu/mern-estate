import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';

function Signin() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [formData, setFormData] = useState({});
const{loading,error}=useSelector((state)=>state.user)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   dispatch(signInStart())

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      

      if ( data.email) {
       
        dispatch(signInSuccess(data)) // Clear any previous errors
        navigate('/'); // Redirect to the sign-in page after success
      } else {
        dispatch(signInFailure(data.message || "Signup failed. Please try again."))
        // setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
     
      dispatch(signInFailure(error.message || "Something went wrong. Please try again."))
      // setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      {error && <p className="text-red-500 text-center">{error}</p>} {/* Display errors */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to="/sign-up">
          <span className='text-blue-500'>Sign up</span>
        </Link>
      </div>
    </div>
  );
}

export default Signin;

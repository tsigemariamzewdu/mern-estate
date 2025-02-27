import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import ImageUpload from '../components/ui/ImageUpload'; // Import your ImageUpload component
import { toast } from 'react-toastify';

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [isUpdating,setIsUpdating]=useState(false);
  const[showListingError,setShowListingError]=useState(false)
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
    avatar: currentUser?.avatar || '', // Avatar URL (Cloudinary image)
  });

  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings,setUserListings]=useState([])
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });


  };

  const handleImageUpload = (url) => {
    setFormData({ ...formData, avatar: url }); // Update avatar URL in form data
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUpdateSuccess(false);
    setIsUpdating(true);

    try {
      dispatch(updateUserStart());

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar, // Include the image URL
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch(`http://localhost:5000/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update profile');
        
      }

      const data = await res.json();
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      toast.success("profile updated successfully!")
    } catch (error) {
      dispatch(updateUserFailure(error.message));
     toast.error(error.message)
    }
    finally{
      setIsUpdating(false)}
   
    
  };
  function handleSignout(){
    try {
      dispatch(signOutUserStart());
      localStorage.removeItem('access_token'); // Clear token from localStorage
     
      dispatch(signOutUserSuccess());
      navigate('/sign-in'); // Redirect to sign-in page
    } catch (error) {
      console.log(error.message)
      dispatch(signOutUserFailure(error.message));
      setError('Failed to sign out. Please try again.');
    }
  }
const handleShowListings=async ()=>{
  try {
    const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }
    setShowListingError(false)
    const res=await fetch(`http://localhost:5000/api/user/listing/${currentUser._id}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data=await res.json()
    if (data.success===false){
      setShowListingError(true)
      return
    }
    console.log(data)
    setUserListings(data)
  } catch (error) {
    setShowListingError(true)
    
  }
}
const handleListingDelete=async (listingId)=>{
  try {
    const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }
    const res=await fetch(`http://localhost:5000/api/listing/delete/${listingId}`,
     { method:"DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

     }
    )
    const data=await res.json();
    if(data.success===false){
      console.log(data.message)
      return
    }

    setUserListings((prev=>prev.filter((listing)=>listing._id!==listingId)))
    
  } catch (error) {
    setError(error)
  }
}
  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Image Upload Component */}
        <div>
         
          <ImageUpload onUpload={handleImageUpload} />
         
        </div>
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
          placeholder="Password (leave blank to keep current)"
          id="password"
          value={formData.password}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
       {isUpdating ? "Updating..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={() => console.log('Delete Account')}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignout}
          className="text-red-700 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      <button className="text-green-700 w-full" onClick={handleShowListings} >show Listings</button>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
            {listing.imageUrls?.length > 0 && listing.imageUrls[0] && (
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              )}

              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}

export default Profile;

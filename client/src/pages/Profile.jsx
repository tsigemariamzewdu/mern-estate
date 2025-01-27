import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
    avatar: currentUser?.avatar || '', // Avatar URL (Cloudinary image)
  });

  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setError(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Image Upload Component */}
        <div>
         
          <ImageUpload onUpload={handleImageUpload} />
          {formData.avatar && (
            <p className="text-green-600 mt-2">Image uploaded successfully!</p>
          )}
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
          Update
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
          onClick={() => console.log('Sign Out')}
          className="text-red-700 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {updateSuccess && <p className="text-green-700 mt-5">Profile updated successfully!</p>}
    </div>
  );
}

export default Profile;

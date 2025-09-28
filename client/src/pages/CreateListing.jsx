import React from 'react';
import ImageUpload from '../components/ui/anotherimageupload';
import {useState} from "react";
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"

function CreateListing() {
  const navigate=useNavigate()
  const { currentUser } = useSelector((state) => state.user);
  const [files,setFiles]=useState([])
  const[error,setError]=useState(false);
  const[loading,setLoading]=useState(false)
  const [formData,setFormData]=useState({
    imageUrls:[],
    name:"",
    description:"",
    address:"",
    type:"rent",
    bedrooms:1,
    bathrooms:1,
    regularPrice:0,
    discountPrice:1,
    offer:false,
    parking:false,
    furnished:false,
  })
  const handleImageUpload = (url) => {
    setFormData((prevState) => {
      const updatedData = {
        ...prevState,
        imageUrls: [...prevState.imageUrls, url],
      };
      console.log("Updated Image URLs:", updatedData.imageUrls);
      return updatedData;
    });
  };
  
  
  const handleChange=(e)=>{
    if(e.target.id==="sale"|| e.target.id==="rent"){
      setFormData({...formData,type:e.target.id})
    }

    if(e.target.id==="parking"||e.target.id==="furnished" || e.target.id==="offer"){
      setFormData({
        ...formData,[e.target.id]:e.target.checked
      })
    }
    if(e.target.type==="number"|| e.target.type==="text"|| e.target.type=="textarea"){
      setFormData({
        ...formData,[e.target.id]:e.target.value
      })
    }
  }
  async function handleSubmit(e){
    e.preventDefault()
    try{
      const token = localStorage.getItem('access_token');
     
      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      setLoading(true);
      setError(false);
      const res= await fetch(" https://mern-estate-xv51.onrender.com/api/listing/create",{
          method:"POST",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify({...formData,userRef:currentUser._id})
          
        

      })
      console.log(formData)
      
      const data=await res.json()
      setLoading(false);
      if(data.success===false){
        setError(data.message)
      }
      navigate(`/listing/${data._id}`)

    }catch(error){
      toast.error(error.message)
      setLoading(false)
    }

  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form  onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" 
              onChange={handleChange}
             checked={formData.type==="sale"}/>
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" 
              onChange={handleChange}
              checked={formData.type==='rent'}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" 
              checked={formData.parking}
              onChange={handleChange}/>
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5"
              checked={formData.furnished}
              onChange={handleChange} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" 
              checked={formData.offer}
              onChange={handleChange}/>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              onChange={handleChange}
              value={formData.bathrooms}/>
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="50"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}/>
              <p>Regular Price</p>
              {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
            </div>
            <div className="flex flex-col items-center">
              <input
                type="number"
                id="discountedPrice"
                min="1"
                max="50"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              value={formData.discountPrice}
              />
              <p>Discounted Price</p>
              
              {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
            </p>
            <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                
                        <ImageUpload onUpload={handleImageUpload} />
                
                    </div> 
                    <div>
        
         
                        <ImageUpload onUpload={handleImageUpload} />
        
                    </div> 
                    <div>
         
                        <ImageUpload onUpload={handleImageUpload} />
        
                    </div> 
                    <div>
         
                        <ImageUpload onUpload={handleImageUpload} />
        
                    </div> 
                    <div>
         
                        <ImageUpload onUpload={handleImageUpload} />
        
                    </div> 
                    <div>
         
                        <ImageUpload onUpload={handleImageUpload} />
        
                    </div>
                    
       </div>
            {/* <div className='flex gap-4'>
                <input  className="p-3 border border-gray-300 rounded w-full"type="file"  id="images" accept='images/*' multiple/>
                <button className='p-3 text-green-700 border border-green-700 rounded upppercase hover:shadow-lg disabled:opacity-80 '>Upload</button>
            </div> */}
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase  hover:opacity-95 disabled:opacity-80'>
            {loading ? "Creating..." : "Create Listing"}</button>
        </div>
       
      </form>
    </main>
  );
}

export default CreateListing;

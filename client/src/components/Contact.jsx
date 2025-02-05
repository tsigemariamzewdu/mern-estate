import { Link } from 'react-dom';
import React, { useState } from 'react'

function Contact({listing}) {
  const {landLord,setLandlord}=useState(null);
  useEffect(()=>{
    const fetchLandlord=async ()=>{
      try {
        const res=await fetch(`http://localhost:5000/api/${listing.userRef}`)
        const data=await res.json();
        setLandlord(data)
        
      } catch (error) {
        console.log(error)
        
      }
    }
    fetchLandlord();
  },[listing.userRef])
  const {message,setMessage}=useState()
  return (
  <>
  {landLord && (
    <div className='flex flex-col gap-2'>
      <p> Contact <span className='font-semibold'>{landLord.username}</span> for
      <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
      <textarea name="message" id="message" rows="2" value={message} onChange={onChange}
      placeholder='enter your message here...'
      className='w-full border p-3 rounded-lg'></textarea>
      <Link
      to={`mailto:${landLord.email}?subject=Regarding ${listing.name} &body=${message}`}
      className="bg-slate-700 text-white text-center p-3 uppercase rounded-llg hover:opacity-95"
      >Send Message</Link>
    </div>
  )
  }

  </>
  )
}

export default Contact
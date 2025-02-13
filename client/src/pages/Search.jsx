import  { useState ,useEffect} from 'react'
import {useNavigate} from "react-router-dom"

function Search() {
    const [sidebardata,setSidebardata]=useState({
        searchTerm:"",
        type:"all",
        parking:false,
        furnished:false,
        offer: false,
        sort: "created_at",
        order:"desc"


})
const [loading,setLoading]=useState(false);
const [listings,setListings]=useState([])
const navigate=useNavigate()

useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      // setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`http://localhost:5000/api/listing/get?${searchQuery}`);
      const data = await res.json();
      console.log(data)
      // if (data.length > 8) {
      //   setShowMore(true);
      // } else {
      //   setShowMore(false);
      // }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);
const handleChange=(e)=>{
    if (
        e.target.id === 'all' ||
        e.target.id === 'rent' ||
        e.target.id === 'sale'
      ) {
        setSidebardata({ ...sidebardata, type: e.target.id });
      }
  
      if (e.target.id === 'searchTerm') {
        setSidebardata({ ...sidebardata, searchTerm: e.target.value });
      }
  
      if (
        e.target.id === 'parking' ||
        e.target.id === 'furnished' ||
        e.target.id === 'offer'
      ) {
        setSidebardata({
          ...sidebardata,
          [e.target.id]:
            e.target.checked || e.target.checked === 'true' ? true : false,
        });
      }
  
      if (e.target.id === 'sort_order') {
        const sort = e.target.value.split('_')[0] || 'created_at';
  
        const order = e.target.value.split('_')[1] || 'desc';
  
        setSidebardata({ ...sidebardata, sort, order });
      }
}
const handleSubmit=(e)=>{
    e.preventDefault()
    const urlParams =new URLSearchParams()
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen' >
            <form onSubmit={handleSubmit}className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label  className='whitespace-nowrap'> Search Term:</label>
                    <input type="text"
                    id='searchTerm'
                    placeholder='Search...' 
                    className='border rounded-lg p-3 w-full'
                    value={sidebardata.searchTerm}
                    onChange={handleChange}/>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label >Type:</label>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='all'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.type==="all"}
                        />
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='rent'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.type==="rent"}
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='sale'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.type==="sale"}
                        />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='offer'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.offer===true}
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label >Amenities:</label>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='parking'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.parking===true}
                        />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input
                            type='checkbox'
                            id='furnished'
                            className='w-5'
                            onChange={handleChange}
                            checked={sidebardata.furnished===true}
                        />
                        <span>furnished</span>
                    </div>
                   
                    
                </div>
                <div className=''>
                    <label >Sort:
                        <select onChange={handleChange} defaultValue={"created_at_desc"} id="sort_order" className='border rounded-lg p-3'>
                            <option value="regularPrice_desc" >price high to low</option>
                            <option value="regularPrice_asec">price low to high</option>
                            <option value="created_at_desc">Latest</option>
                            <option value="created_at_asec">Oldest</option>

                        </select>

                    </label>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'> Search</button>
            </form>
        </div>
        
        <div className=''>
            <h1  className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        </div>
    </div>
  )
}

export default Search
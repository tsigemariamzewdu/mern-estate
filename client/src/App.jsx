import React from 'react';
import {BrowserRouter ,Routes,Route} from "react-router-dom"
import Home from './pages/Home';
import Sigin from './pages/Sigin';
import Signup from './pages/Signup';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import UpdateListing from './pages/UpdateListing';
import Lisitng from './pages/Lisitng';
import Search from './pages/Search';


function App() {
  return (
   
      <BrowserRouter>
      <ToastContainer position="bottom-left" autoClose={3000} theme="dark" />

      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<Sigin/>}/>
        <Route path="/sign-up" element={<Signup/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/listing/:listingId" element={<Lisitng/>}/>
        <Route element={<PrivateRoute/>}>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/create-listing" element={<CreateListing />}/>
        <Route path="/update-listing/:listingId" element={<UpdateListing />}/>

        </Route>
      


      </Routes>
      </BrowserRouter>
      
      
      
  )
}

export default App
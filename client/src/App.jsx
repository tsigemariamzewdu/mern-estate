import React from 'react';
import {BrowserRouter ,Routes,Route} from "react-router-dom"
import Home from './pages/Home';
import Sigin from './pages/Sigin';
import Signup from './pages/Signup';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';

function App() {
  return (
   
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/sign-in" element={<Sigin/>}/>
        <Route path="/sign-up" element={<Signup/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/profile" element={<Profile/>}/>
        {/* <Route path="/" element={<Home/>}/>
        <Route path="/" element={<Home/>}/> */}


      </Routes>
      </BrowserRouter>
      
      
      
  )
}

export default App
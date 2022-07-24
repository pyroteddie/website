import * as React from 'react';
import {  BrowserRouter as Router,  Routes,  Route} from "react-router-dom";
import HomeScreen from './screens/home';
import FAQScreen from './screens/FAQ' 
import BookingScreen from './screens/priceBooking'
import InfoScreen from './screens/info'
import Header from './components/header'




export default function AppMain() {
  return (
    <Router>
    <div>
    <Header/>
   <hr  />
      <Routes>
      <Route path="/" element={< HomeScreen/>}/> 
      <Route path="FAQ" element={< FAQScreen/>}/> 
      <Route path="Booking" element={< BookingScreen/>}/> 
      <Route path="Info" element={< InfoScreen/>}/> 
        
      </Routes>
    </div>
  </Router>
);
}

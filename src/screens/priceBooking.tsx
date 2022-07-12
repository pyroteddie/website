import * as React from 'react';
import '../style/bookingStyle.css';
import BookingSection from '../components/bookingSection';


export default function BookingScreen() {
    return (
      <div className='BookingPContainer'>
        <BookingSection />
        <p></p>
      </div>
    );
  }
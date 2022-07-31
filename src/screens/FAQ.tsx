import * as React from 'react';
import '../style.css';


export default function FAQScreen() {
    return (
      <div>
        <h1 className='HeadingTitle'>Frequently Asked Questions</h1>
        <section className='FeqConItems'>
          <div className='FeqCon'>
            <a className='FeqTit'>Q. How do i pay for this?</a>
            <a className='FeqAns'>A. All bookings are paid before the date of booking and at the time of checkout.</a>
          </div>
          <div className='FeqCon'>
            <a className='FeqTit'>Q. How do i pay for the yard work service?</a>
            <a className='FeqAns'>A. Bookings for yard services are paid in person upon receiving a quote</a>
          </div>
          <div className='FeqCon'>
            <a className='FeqTit'>Q. How do i change a booking?</a>
            <a className='FeqAns'>A. You can change your booking by emailing us at </a>
          </div>          


        </section>
      

      </div>
    );
  }
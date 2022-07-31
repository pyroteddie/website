import * as React from 'react';
import '../style.css';
import ServiceSection from '../components/servicesSection';
import { Link} from "react-router-dom";

export default function HomeScreen() {
    return (
      <div>
        <section className='HeaderImg'>
          <div className='PostcodeSearch'>
              <p className='TitleHead'>Give yourself a break, 
              Let us clean your house</p>      
          <div className='PostCodeDiv'>
            <button className='BookNowBut'><Link style={{color:'white', textDecoration: "none"}} to="Booking">Book Now</Link></button>
            </div>
            </div>
        </section>
        <section >
          <div className='Sec_1'>
            <h1>TSW Property Solutions the name, Cleaning is our Game</h1>
            <p>There is nothing worse then spending your hard earned weekends cleaning, Not to worry though as we are your solution! Kick your feet up and enjoy that weekend, we'll sort the cleaning.  </p>
          </div>
        </section>
        <section className='ServicesSection'>
        <ServiceSection />
        </section>
        <section >
        <h1 className='HeadingTitle'>Why we are your best choice</h1>
          <div className='Sec2_Par'>
        <p>TSW Property Solutions is a family-run firm that was established in 2022. We make every effort to deliver the best service and customer care possible.
          Our experienced expert cleaners are now serving Cairns and numerous surrounding areas. We provide one-time cleanings, Yard work and bond cleanings. We have the knowledge and are delighted to assist you.</p>
          </div>
        </section>

        <section>
          <h1 className='HeadingTitle'>How Does it Work?</h1>
          <div>
            <div className='HIWContainer'>
              <a className='HIWTitle'>Select your needs</a>
              <a className='HIWText'>Pick out of the 4 options to which would best suit your needs from our General or Deep Clean, 
              Yard work, Bond clean or Build your own clean with our easy to use builder.</a>
            </div>
            <div className='HIWContainer'>
              <a className='HIWTitleR'>Select Desired date and day</a>
              <a className='HIWTextR'>Select your desired date and day and we will best try to suit those needs </a>
            </div>
            <div className='HIWContainer'>
              <a className='HIWTitle'>Add any notes</a>
              <a className='HIWText'>have any speical requirments? let us know and we will be happy to assist in anyway we can</a>
            </div>
            <div className='HIWContainer'>
              <a className='HIWTitleR'>Book your service</a>
              <a className='HIWTextR'>all thats left to do is add your details and press book now! One of our customer support officers will be in contact with you to confirm a time. </a>
            </div>


          </div>
        </section>

        
        
      </div>
    );
  }
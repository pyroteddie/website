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
          Our experienced expert cleaners are now serving Cairns and numerous surrounding areas.
          We provide one-time cleanings, weekly cleanings, and bond cleanings. We also help NDIS recipients and veterans.We provide one-time cleanings, weekly cleanings, and bond cleanings. We have the knowledge and are delighted to assist you.</p>
          </div>
        </section>

        <section>
          <h1 className='HeadingTitle'>How Does it Work?</h1>
          <div>
            <p></p>
          </div>
        </section>

        
        <section className='Footer'> 
        <a>A subsidiary of TSW Security Solutions</a>
        </section>
      </div>
    );
  }
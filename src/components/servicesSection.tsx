import * as React from 'react';
import '../style.css';
import { Link} from "react-router-dom";
import MiniService from '../components/miniService'



export default function ServiceSection() {


    return (
      <div className='servicesSection'>
        <MiniService Title='Weekly or Fortnightly' Info='Book an ongoing weekly or fortnightly clean and never worry about the general chores again!' Link={<Link style={{color:'white', textDecoration: "none"}} to="Booking">Pricing & Booking</Link>}/>
        <MiniService Title='Aged Care / Disability' Info='Providers for NDIS, Veteran
Affairs, Workers Compensation, Insurance and aged care providers' Link={<Link style={{color:'white', textDecoration: "none"}} to="Booking">Pricing & Booking</Link>}/>
        <MiniService Title='Move Out / Spring Clean' Info='Our move out and spring cleans take the hard work out of a big cleaning job by using our expert one-off cleaners.' Link={<Link style={{color:'white', textDecoration: "none"}} to="Booking">Pricing & Booking</Link>}/>
        <MiniService Title='Build Your Clean' Info='Build your clean the way you need it in a few simple steps.' Link={<Link style={{color:'white', textDecoration: "none"}} to="Booking">Pricing & Booking</Link>}/>
      </div>
    );
  }


import * as React from 'react';
import '../style.css';
import { Link} from "react-router-dom";

export default function Header() {
    return (
    <div>
      <script src="https://kit.fontawesome.com/b06ca45143.js"></script>
      <div className='HeaderContainer'>
          <div className='HeaderBarImg'>
            <img src='https://firebasestorage.googleapis.com/v0/b/tswpropertysolution.appspot.com/o/Logo_Base.png?alt=media&token=12e6c03b-69cd-4d65-86ee-4a9fbc1eac5f' style={{width:'150px'}}/>
          </div>
          <div className='MenuBar'>
                  <div className='MenuLinks'>
                    <a className='Link'><Link style={{color:'black', textDecoration: "none"}} to="/">Home</Link></a>
                    <a className='Link'><Link style={{color:'black', textDecoration: "none"}} to="Booking">Pricing & Booking</Link></a>
                    <a className='Link'><Link style={{color:'black', textDecoration: "none"}} to="FAQ">FAQ</Link></a>
                    
                  </div>
          </div>
        </div>
    </div>
    );
  }
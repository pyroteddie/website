import * as React from 'react';
import '../style.css';
import { Link} from "react-router-dom";

export default function Footer() {
    return (
    <div>
      <section className='Footer'> 
        <div className='FooterLinkContain'>
            <div className='FooterLinkItemCon'>
                <a className='FootItemtitle'>Socials</a>
                <a onClick={() => window.open("https://www.facebook.com/TSW-Property-Solutions-109726788471565")}>Facebook</a>
            </div> 
            <div className='FooterLinkItemCon'>
                <a className='FootItemtitle'>Other Sites</a>
                <a  onClick={() => window.open("https://tswsecuritysolutions.com.au")}>TSW Security Solutions</a>
            </div>
            <div className='FooterLinkItemCon'>
                <a className='FootItemtitle'>Other Links</a>
                <a >Join Team</a>
            </div>

        </div>

        <a>A subsidiary of TSW Security Solutions</a>
        </section>
    </div>
    );
  }
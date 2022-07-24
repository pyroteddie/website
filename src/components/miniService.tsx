import * as React from 'react';
import '../style.css';
import { Link} from "react-router-dom";

export default function MiniService({Title, Info, Link}) {
  var title = Title; //"Weekly or Fortnightly"
  var info = Info; //"Book an ongoing weekly or fortnightly clean and never worry about the general chores again!"

    return (
    <div className='minServiceBox'>
      <a className='miniServiceTitle'>{title}</a>
      <a className='line'></a>
      
      <a className='miniServiceBody'>{info}</a>
      <a></a>
      <button className='miniServiceButton'>{Link}</button>    
      </div>
    );
  }


import * as data from '../firebase'
import React, { useState, useEffect } from 'react';
import '../style/bookingStyle.css';
import { Link} from "react-router-dom";

import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getStorage, ref as Stref, uploadBytes } from "firebase/storage";

import { jsPDF } from "jspdf";
import { url } from 'inspector';

const app = initializeApp(data.firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage();

    let TotalCostService;
    let KitchenItems = [];
    let BedroomItems = [];
    let OtherItems= [];
    var ClientDetails = { FirstName:"",
                          LastName:"",
                          Email:"",
                          Phone:"",
                          Address:{
                            Line1:"",
                            Suburb:"",
                            State:"",
                            PostCode:""}}

    let BaseRates = []
 
    let CTDeepCleanItems = [];
    let CTGenCleanItems = [];
    let CTBondCleanItems  = [];
    var CleanInfoItems;

    export default function BookingSection() {
    
    const [active, setActive] = useState(false);
    const [id, setId] = useState(String);
    const [reqactive, setReqActive] = useState(false);
    const [reqId, setreqId] = useState(String);
    const [cleanType, setCleanType] = useState(String);
    const [cleanTypeActive, setCleanTypeActive] = useState(false);
    const [rooms, setRooms] = useState(1);
    const [bathRooms, setBathRooms] =useState(1);
    const [customItem, setCustomItem] = useState([]);
    const [customItemCost, setCustomItemCost] = useState(0);
    const [CleanDisplay, SetCleanDisplay] = useState(String);
    const [cost, setCost] = useState(0);
    const [basePrice, setBasePrice] = useState(0);
    const [roomPrice, setRoomPrice] = useState(0);
    const [bathPrice, setBathPrice] = useState(0);
    const [disPrice, setdisPrice] = useState(0.00);
    const [suburb, setSuburb] = useState('');
    const [startDate, setStartDate] = useState('');
    const [SuburbsList, setSuburbsList] = useState('');
    
    const suburbsList = ref(database, 'Information/ServicableArea/');
    onValue(suburbsList, (snapshot) => { global.suburbsItems = (snapshot.val())});

    const BRItems = ref(database, 'Information/BaseRates/');
    onValue(BRItems, (snapshot) => { BaseRates = (snapshot.val())});

    var OrderRefNumber = Math.random().toString(36).slice(2);
    const CTGenCleanDic = ref(database, 'Information/CleanTypes/GeneralClean/')
    const CTDeepCleanDic = ref(database, 'Information/CleanTypes/DeepClean/')
    const CTBondCleanDic = ref(database, 'Information/CleanTypes/BondClean/')

      onValue(CTGenCleanDic, (snapshot) => { CTGenCleanItems = (snapshot.val())});
      onValue(CTDeepCleanDic, (snapshot) => { CTDeepCleanItems = (snapshot.val())});
      onValue(CTBondCleanDic, (snapshot) => { CTBondCleanItems = (snapshot.val())});


    const KitItemsList = ref(database, 'Information/CustomAddon/Kitchen/');
    const BedItemsList = ref(database, 'Information/CustomAddon/Bedroom');
    const OtherItemsList = ref(database, 'Information/CustomAddon/Other');

    

    onValue(KitItemsList, (snapshot) => { KitchenItems = (snapshot.val())});
    onValue(BedItemsList, (snapshot) => { BedroomItems = (snapshot.val())});
    onValue(OtherItemsList, (snapshot) => { OtherItems = (snapshot.val())});

    useEffect(() => {
      
      console.log(KitchenItems)
      ClientDetails['Address']["Suburb"] = suburb;
      TotalCostService = ((customItemCost +(customItemCost * disPrice)) + cost);
      switch(id){
        case '1':
          SetCleanDisplay(cleanType);

        break;
        case '2':
          SetCleanDisplay('Aged Care/ Disability');

        break; 
        case '3':
          SetCleanDisplay('Bond');

        break; 
        case '4':
          SetCleanDisplay('Custom Clean');

        break; 
        
      }
      
      switch(reqId){
        case 'Once':
          setdisPrice(0);

        break;
        case 'Weekly':
          setdisPrice(0.30);

        break; 
        case 'Fortnightly':
          setdisPrice(0.20);

        break; 
        case 'Monthly':
          setdisPrice(0.15);

        break; 
        
      }
      
        switch(CleanDisplay){
          case 'General':
            CleanInfoItems = CTGenCleanItems;
          
          break;
          case 'Deep':
            CleanInfoItems = CTDeepCleanItems;
          break;
          case 'Bond':
            CleanInfoItems = CTBondCleanItems;
          break;
          case 'Custom Clean':
            CleanInfoItems = customItem;
          break;

        }
      switch(CleanDisplay){
        case 'General':
          var base = Number(BaseRates['GeneralClean']['Base']);
          var room = Number(BaseRates['GeneralClean']['Bed']);
          var bath = Number(BaseRates['GeneralClean']['Bath']); 
          setBasePrice(base);
          setRoomPrice(room);
          setBathPrice(bath);
         
        break;
        case 'Deep':
          var base = Number(BaseRates['DeepClean']['Base']);
          var room = Number(BaseRates['DeepClean']['Bed']);
          var bath = Number(BaseRates['DeepClean']['Bath']); 
          setBasePrice(base);
          setRoomPrice(room);
          setBathPrice(bath);
        break;
        case 'Bond':
          var base = Number(BaseRates['BondClean']['Base']);
          var room = Number(BaseRates['BondClean']['Bed']);
          var bath = Number(BaseRates['BondClean']['Bath']); 
          setBasePrice(base);
          setRoomPrice(room);
          setBathPrice(bath);
        break;
        case 'Custom Clean':
          var base = Number(BaseRates['CustomClean']['Base']);
          var room = Number(BaseRates['CustomClean']['Bed']);
          var bath = Number(BaseRates['CustomClean']['Bath']); 
          setBasePrice(base);
          setRoomPrice(room);
          setBathPrice(bath);
        break;

      }
      setCost((basePrice + (roomPrice * (rooms-1)) + (bathPrice * (bathRooms-1))) - ((basePrice + (roomPrice * (rooms-1)) + (bathPrice * (bathRooms-1))) * disPrice));

    });

    function setdateformat(date){
      var selectedDate = new Date(date);
      setStartDate(selectedDate.toLocaleDateString());
    }

     return (
      <div className='container'>
        <div className='bookingContainer'>
          <div style={{width:'-webkit-fill-available'}}>
          <h2>Available Suburbs</h2>
          <select className='AreaSelect' onChange={(e)=> setSuburb(e.target.value) } >
            {global.suburbsItems && global.suburbsItems.map( Codes=> (<option value={Codes.Name}>{Codes.Name}</option>))}
          </select>
          
          </div>

          <div className='servicesSection'>
            <MiniService 
            Title='General Clean / Deep Clean' 
            Info='Book an ongoing weekly or fortnightly clean and never worry about the general chores again!' 
            Link='1'  />
            <MiniService 
            Title='Aged Care / Disability' 
            Info='Providers for NDIS, Veteran Affairs, Workers Compensation, Insurance and aged care providers' 
            Link='2'  />
            <MiniService 
            Title='Move Out' 
            Link='3'  
            Info='Our move out cleans take the hard work out of a big cleaning job by using our expert one-off cleaners.'  />
            <MiniService 
            Title='Build Your Clean' 
            Info='Build your clean the way you need it in a few simple steps.' 
            Link='4' />
          </div>
          <div className='line'></div>

          <div style={active && id==="1" ? {display:'block'}:{display:'none'}} >
            <h2>How often will the cleaner be required</h2>
            <div className='feqButContainer'>
            <button className={cleanTypeActive && cleanType==="General" ? 'FeqButton':'FeqButton-unselect'} onClick={() => SetCleanActive('General')} >General Clean</button>
            <button className={cleanTypeActive && cleanType==="Deep" ? 'FeqButton':'FeqButton-unselect'} onClick={() => SetCleanActive('Deep')} >Deep Clean</button>
            </div>
            <h4>Whats Included:</h4>
            <ul style={cleanTypeActive && cleanType==="General" ? {display:'block'}:{display:'none'}}>
              {CTGenCleanItems && CTGenCleanItems.map( items => (<li>{items}</li> ))}
            </ul>
            <ul style={cleanTypeActive && cleanType==="Deep" ? {display:'block'}:{display:'none'}}>
            {CTDeepCleanItems && CTDeepCleanItems.map( items => (<li>{items}</li> ))}
            </ul>

          </div>

          <div className='line' style={active && id==="1" ? {display:'flex'}:{display:'none'}}></div>
          
          <div >
            <h2>How often will the cleaner be required</h2>
            <div className='feqButContainer'>
            <button className={reqactive && reqId==="Once" ? 'FeqButton':'FeqButton-unselect'}  onClick={() => SetreqActive('Once')} >Once</button>
            <button className={reqactive && reqId==="Weekly" ? 'FeqButton':'FeqButton-unselect'}  onClick={() => SetreqActive('Weekly')} >Weekly</button>
            <button className={reqactive && reqId==="Fortnightly" ? 'FeqButton':'FeqButton-unselect'} onClick={() => SetreqActive('Fortnightly')} >Fortnightly</button>
            <button className={reqactive && reqId==="Monthly" ? 'FeqButton':'FeqButton-unselect'} onClick={() => SetreqActive('Monthly')} >Monthly</button>
            </div>
            
          </div>
          <div className='line'></div>

          <div >
            <h2>How many rooms do you have</h2>
            <div style={{display:'flex', flexDirection:'row',justifyContent:'Space-evenly'}}>
              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:'20px'}}>Bedrooms</label>
                <input type='number' className='AreaSelect' defaultValue={1} onChange={(e => setRooms(Number(e.target.value)) )}/>
              </div>
              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:'20px'}}>Bathrooms</label>
                <input type='number' className='AreaSelect' defaultValue={1} onChange={(e => setBathRooms(Number(e.target.value)) )}/>
              </div>
            </div>
          </div>

          <div className='line'></div>

          <div >
            <h2>How many days per week would you like</h2>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'Space-evenly', alignItems:'center'}}>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label >Any Day</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label >Monday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label >Tuesday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label >Wednesday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label >Thursday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label >Friday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label >Saturday</label>
              </div>
              </div>
            </div>

          <div className='line'></div>

          <div style={{width:'100%'}}>
            <h2>What would you like the cleaning date to Start</h2>
            <input type='date' style={{width:'100%',border:'1.5px solid #394DFF',height:'35px', borderRadius:'10px',fontSize:'18px' ,textAlign:'center'}} onChange={(e)=> setdateformat(e.target.value)}/>
            </div>

          <div className='line'></div>

          <div >
            <h2>Custom Add On's</h2>
              <div style={{display:'flex', flexDirection:'row', justifyContent:'Space-evenly', alignItems:'flex-start'}}>
                <div style={{display:'flex', alignItems:'center',flexDirection:'column',width:'-webkit-fill-available',margin:'10px'}}>
                  <h3 >Kitchen</h3>
                  {KitchenItems && KitchenItems.map(item => ( 
                    <div style={{display:'flex', alignItems:'center',width:'-webkit-fill-available',justifyContent: "space-between"}}>
                      <label >{item['Name']}</label>
                      <input type='checkbox' className='check-UnSelected' value={item['Price']} onChange={(e => editcustomItems(e.target.checked,{Name:"Kitchen - " +item['Name'],Price:item['Price']}) )}/>
                    </div>
                  ))}
                  

                 
                </div>
                <div style={{display:'flex', alignItems:'center',flexDirection:'column',width:'-webkit-fill-available',margin:'10px'}}>
                  <h3 >Bedroom</h3>
                  {BedroomItems && BedroomItems.map(item => ( 
                    <div style={{display:'flex', alignItems:'center',width:'-webkit-fill-available',justifyContent: "space-between"}}>
                      <label >{item['Name']}</label>
                      <input type='checkbox' className='check-UnSelected' value={item['Price']} onChange={(e => editcustomItems(e.target.checked,{Name:"Bedroom - " + item['Name'],Price:item['Price']}) )}/>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex', alignItems:'center',flexDirection:'column',width:'-webkit-fill-available',margin:'10px'}}>
                  <h3 >Other</h3>

                  {OtherItems && OtherItems.map(item => ( 
                    <div style={{display:'flex', alignItems:'center',width:'-webkit-fill-available',justifyContent: "space-between"}}>
                      <label >{item['Name']}</label>
                      <input type='checkbox' className='check-UnSelected' value={item['Price']} onChange={(e => editcustomItems(e.target.checked,{Name:"Other - " +item['Name'],Price:item['Price']}) )}/>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          <div className='line'></div>

          <div >
            <h2>Speical Requirements</h2>
              <div style={{width:'-webkit-fill-available', display:'flex', justifyContent:'center'}}>
              <textarea style={{width:'80%',height:'200px',}}/>
              </div>
          </div>

          <div className='line'></div>

          <form action="/checkout" method="POST">
            <h2>Your Details</h2>
              <div style={{display:'flex', flexDirection:'row',justifyContent:'center'}}>
                <div style={{display:'flex', flexDirection:'column',padding:'15px'}}>
                  <input name='ClientName' id='UserFName' placeholder='First Name' className='InputDetails' type="text" onChange={(e) => ClientDetails['FirstName'] = e.target.value}/>
                  <input id='UserEName' placeholder='Email' className='InputDetails' type="email" onChange={(e) => ClientDetails['Email'] = e.target.value} />
                  <input id='UserAdd' placeholder='Address' className='InputDetails' type="text" onChange={(e) => ClientDetails['Address']["Line1"] = e.target.value} />
                  <input id='UserLState' placeholder='State' className='InputDetails' type="text" onChange={(e) => ClientDetails['Address']['State'] = e.target.value}/>
                </div>
                <div style={{display:'flex', flexDirection:'column',padding:'15px'}}>
                  <input id='UserLName' placeholder='Last Name'  className='InputDetails' type="text" onChange={(e) => ClientDetails['LastName'] = e.target.value}/>
                  <input id='UserPhone' placeholder='Phone' className='InputDetails' type="tel" onChange={(e) => ClientDetails['Phone'] = e.target.value}/>
                  <input id='UserSub' placeholder='Suburb' className='InputDetails' value={suburb}  onChange={(e) => ClientDetails['Address']["Suburb"] = suburb}/>
                  <input id='UserPCode' placeholder='Post code' className='InputDetails' onChange={(e) => ClientDetails['Address']['PostCode'] = e.target.value} />
                  <input name='OrderRef' value={OrderRefNumber} style={{display:"none"}} />
                  <input name='ServicePrice' value={TotalCostService} style={{display:"none"}}/>
                  <input name='Cleantype' value={CleanDisplay} style={{display:"none"}}/>
                  <input name='CleanDetails' value={CleanInfoItems} style={{display:"none"}} />
                </div>
              </div>
              <button type="submit" className='BookNowButton' onClick={() => CreateInvoice(CleanDisplay,reqId,rooms,bathRooms,startDate,customItem,TotalCostService)}>
                  Book Now
                </button>
              </form>
          
        </div>

        <div className='bookingSumContainer'>
          <h3 style={{fontSize:'24px'}}>Your Booking Summary</h3>
            <div className='bookingItems'>
            <div style={{display:'flex', flexDirection:'row',justifyContent: 'space-between',width: '-webkit-fill-available'}}><a>Clean Type</a><a>{CleanDisplay}</a></div>
            <div style={{display:'flex', flexDirection:'row',justifyContent: 'space-between',width: '-webkit-fill-available'}}><a>Frequency</a><a>{reqId}</a></div>
            <div style={{display:'flex', flexDirection:'row',justifyContent: 'space-between',width: '-webkit-fill-available'}}><a>Rooms</a><a>{rooms}</a></div>
            <div style={{display:'flex', flexDirection:'row',justifyContent: 'space-between',width: '-webkit-fill-available'}}><a>Bathrooms</a><a>{bathRooms}</a></div>
            <div style={{display:'flex', flexDirection:'row',justifyContent: 'space-between',width: '-webkit-fill-available'}}><a>Start Date</a><a>{startDate}</a></div>
            <div style={{display:'flex', flexDirection:'row',justifyContent: 'space-between',width: '-webkit-fill-available'}}><a>Custom Add-ons</a><a>${customItemCost}</a></div>
            <div style={{display:'flex', flexDirection:'row',justifyContent: 'space-between',width: '-webkit-fill-available'}}><a>Total Price Per Service</a><a>${(customItemCost +(customItemCost * disPrice)) + cost}</a></div>
            <div style={{display:'flex', flexDirection:'row'}}><p>* Includes GST tax</p></div>
            </div>
        </div>

      </div>
    );
    
    // <button className='BookNowButton' onClick={() => CreateInvoice(CleanDisplay,reqId,rooms,bathRooms,startDate,customItem,TotalCostService)}>Book Now</button>
          
  function editcustomItems(Checked,Value){

    if(Checked === true){
      setCustomItemCost(Number(customItemCost) + Number(Value.Price))
      setCustomItem([Value, ...customItem])
    }else{
      setCustomItemCost(Number(customItemCost) - Number(Value.Price))
      setCustomItem(customItem.filter(item => item['Name'] !== Value.Name))
    }
    
  }
  
    function SetreqActive(ID){
      if(reqactive != true){
        setReqActive(true);
        setreqId(ID);
      }else{  
        setreqId(ID);
       
      }
    }
    function SetCleanActive(ID){
      if(cleanType != ID){
        setCleanTypeActive(true);
        setCleanType(ID);
        
      }else{  
        setCleanType(ID);
        setCleanTypeActive(false);
      }
    }
    function MiniService({Title, Info, Link}) {
      var title = Title; 
      var info = Info; 
      
      return (
        <div className={active && id===Link ? 'minServiceBox':'minServiceBox-unselect'}>
          <a className='miniServiceTitle'>{title}</a>
          <a className='line'></a>
          <a className='miniServiceBody'>{info}</a>
          <a></a>
          <button className={active && id===Link ? 'miniServiceButton':'miniServiceButton-unselect'} onClick={() => SetActive(Link)} >{active && id===Link ? 'Selected':'Select'}</button>    
          </div>
        );
          function SetActive(ID){
            if(active != true){
              setActive(true);
              setId(ID);
            }else{  
              setId(ID);
              
            }
          }
    }

    
    
  }
  const doc = new jsPDF();

  function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

 async function CreateInvoice(CleanType, Frequency, Rooms, Bathroom, StartDate, CustomItems, ServiceCost){
  var checkList = 0;

 

  if(!isBlank(ClientDetails['FirstName'])){
    checkList++;
  }
  if(!isBlank(ClientDetails['LastName'])){
    checkList++;
  }
  if(!isBlank(ClientDetails['Email'])){
    checkList++;
  }
  if(!isBlank(ClientDetails['Phone'])){
    checkList++;
  }
  if(!isBlank(ClientDetails['Address']['Line1'])){
    checkList++;
  }
  if(!isBlank(ClientDetails['Address']['Suburb'])){
    checkList++;
  }
  if(!isBlank(ClientDetails['Address']['State'])){
    checkList++;
  }
  if(!isBlank(ClientDetails['Address']['PostCode'])){
    checkList++;
  }

  console.log(checkList)

  console.log(ClientDetails)

if(checkList <= 8){

   var CleanInfoItems;
   switch(CleanType){
    case 'General':
      CleanInfoItems = CTGenCleanItems;
     
    break;
    case 'Deep':
      CleanInfoItems = CTDeepCleanItems;
    break;
    case 'Bond':
      CleanInfoItems = CTBondCleanItems;
    break;
    case 'Custom Clean':
      CleanInfoItems = CustomItems;
    break;

  }

  var logo = new Image();
  logo.src = '/Logo_Base.jpg';

    var d = new window.Date();
    var Date = d.getDate() +"" +(d.getMonth() + 1) +"" + d.getFullYear();
    var QDate = d.getDate() +"/" +(d.getMonth() + 1) +"/" + d.getFullYear();
    const storageRef = Stref(storage, '/Quotes/JohnSmith-'+Date);
    doc.addImage(logo, 'PNG', 10, 5,40,40)
    doc.text("Date: " + QDate, 200, 20, {align:'right'});
    doc.text("ABN: ", 200, 26, {align:'right'});
    doc.text("ADDRESS line 1: ", 200, 32, {align:'right'});
    doc.text("ADDRESS line 2: ", 200, 38, {align:'right'});
    
    doc.text("Full Name: " + ClientDetails['FirstName'] + " " +ClientDetails['LastName'] , 10, 38, {align:'right'});
    doc.text("Phone: " + ClientDetails["Phone"] , 10, 43, {align:'right'});
    doc.text("Phone: " + ClientDetails['Address']['Line1'] , 10, 43, {align:'right'});
   
    
    
    doc.setFontSize(18)
    doc.text("Quote", 10, 60, {align:'left'});
    doc.setFontSize(16)
    doc.text("Service Quote for " +Rooms + " Bedrooms & " +Bathroom + " Bathrooms", 10, 70, {align:'left'});
    doc.text(CleanType + " Clean includes:", 10, 80, {align:'left'});
    var textHeight = 85;
    
    if(CleanInfoItems.length >= 1){
    for(var i=0;i<CleanInfoItems.length;i++){
      doc.setFontSize(12)
      doc.text("- "+ CleanInfoItems[i], 10, textHeight, {align:'left'});
      textHeight = textHeight + 5;
    }}
    var CusttextHeight = textHeight + 20;
    if(CustomItems.length >= 1){
    doc.setFontSize(16)
    doc.text("Custom Items include:", 10, textHeight + 15, {align:'left'});
    for(var i=0;i<CustomItems.length;i++){
      doc.setFontSize(12)
      doc.text("- "+ CustomItems[i].Name, 10, CusttextHeight, {align:'left'});
      CusttextHeight = CusttextHeight + 5;
    }}

    doc.text(Frequency + " Service Starting on " + StartDate, 10, CusttextHeight + 20, {align:'left'});
    

    doc.text("Total Cost per Service: $" + ServiceCost , 10, CusttextHeight + 30, {align:'left'});
    
    var blob = doc.output("blob");
  
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
    }
 
  }
  

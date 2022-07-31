import React, { useState, useEffect } from 'react';
import '../style/bookingStyle.css';
import { Link} from "react-router-dom";

import * as data from '../firebase'
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getStorage, ref as Stref, uploadBytes } from "firebase/storage";

import { jsPDF } from "jspdf";
import { url } from 'inspector';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

const app = initializeApp(data.firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage();

    let TotalCostService;
    
    let KitchenItems = [];
    let BathItems = [];
    let OutSideItems = [];
    let BedroomItems = [];
    let OtherItems= [];
    var ClientDetails={ FirstName:"",
                          LastName:"",
                          Email:'',
                          Phone:'',
                          Address:{
                            Line1:'',
                            Suburb:'',
                            State:'',
                            PostCode:''}}
    var Details = {
      CleanType:"",
      RefCode:"",
      Rooms:0, 
      Bathroom:0, 
      StartDate:"",
      CustomItems:[],
      ServiceCost:0,
      comments:""
      }                        
    let BaseRates = []
    let CTDeepCleanItems = [];
    let CTGenCleanItems = [];
    let CTBondCleanItems  = [];
    var CleanInfoItems;
    let EachCustomItems = 0;

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
    const [CleanDisplay, SetCleanDisplay] = useState('Select');
    const [cost, setCost] = useState(0);
    const [basePrice, setBasePrice] = useState(0);
    const [roomPrice, setRoomPrice] = useState(0);
    const [bathPrice, setBathPrice] = useState(0);
    const [disPrice, setdisPrice] = useState(0.00);
    const [suburb, setSuburb] = useState('');
    const [startDate, setStartDate] = useState('');
    const [SuburbsList, setSuburbsList] = useState('');
    const [specialReq, setSpecialReq] = useState('');
    
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
    const BathItemsList = ref(database, 'Information/CustomAddon/Bathroom');
    const OtherItemsList = ref(database, 'Information/CustomAddon/Other');
    const OutSideItemsList = ref(database, 'Information/CustomAddon/Outside');

    

    onValue(KitItemsList, (snapshot) => { KitchenItems = (snapshot.val())});
    onValue(BedItemsList, (snapshot) => { BedroomItems = (snapshot.val())});
    onValue(BathItemsList, (snapshot) => { BathItems = (snapshot.val())});
    onValue(OutSideItemsList, (snapshot) => { OutSideItems = (snapshot.val())});

    onValue(OtherItemsList, (snapshot) => { OtherItems = (snapshot.val())});


    useEffect(()=>{
      console.log(customItem)
      console.log("Price Before: " + customItemCost);
      var tempmoney = 0;
      customItem.forEach(item => {
        
        console.log("$ "+ (item['Quanity']*item['Price']));
        tempmoney = tempmoney + (item['Quanity']*item['Price'])
        
      })
      console.log(tempmoney);
      addItemTogether(tempmoney);

    },[customItem]);

    useEffect(() => {
      console.log('ChangeID')
    switch(id){
      case '1':
        SetCleanDisplay(cleanType);
        setCustomItem([])
      break;
      case '2':
        SetCleanDisplay('Yard work');
        setCustomItem([])
      break; 
      case '3':
        SetCleanDisplay('Bond');
        setCustomItem([])
      break; 
      case '4':
        SetCleanDisplay('Custom Clean');
        setCustomItem([])
      break; 
    }
      },[id])


    useEffect(() => {
      
      TotalCostService = (((customItemCost + EachCustomItems) +((customItemCost + EachCustomItems) * disPrice)) + cost);
      ClientDetails['Address']["Suburb"] = suburb;
        
      switch(id){
          case '1':
            SetCleanDisplay(cleanType);
          
          break;
          case '2':
            SetCleanDisplay('Yard work');
            
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
        case 'Yard work':
          
          var base = Number(BaseRates['CustomClean']['Base']);
          var room = Number(BaseRates['CustomClean']['Bed']);
          var bath = Number(BaseRates['CustomClean']['Bath']); 
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
        Details = {
          CleanType:CleanDisplay,
          RefCode:OrderRefNumber,
          Rooms:rooms, 
          Bathroom:bathRooms, 
          StartDate:startDate,
          CustomItems:customItem,
          ServiceCost:TotalCostService,
          comments:specialReq
          }    
          

      var GST = .10;
      var discountPrice = ((basePrice + (roomPrice * (rooms-1)) + (bathPrice * (bathRooms-1))) * disPrice)
      var basicCost = (basePrice + (roomPrice * (rooms-1)) + (bathPrice * (bathRooms-1)))
      var PriceAfterGST = (basicCost - discountPrice + ( (basicCost - discountPrice) * GST ))
      setCost(PriceAfterGST);
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
            Info='Book a clean and never worry about the general chores again!' 
            Link='1'  />
            <MiniService 
            Title='Yard Work' 
            Info='Our professional yard maintance staff will work wonders' 
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
          <div className='line' style={CleanInfoItems == undefined ? {display:'none'}:{display:'block'}}></div>

          <div style={active && id==="1" ? {display:'block'}:{display:'none'}} >
            <h2>What clean type do you require</h2>
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

          <div className='line' style={active && id==="1" && CleanDisplay !== ""  ? {display:'flex'}:{display:'none'}}></div>
          
          <div style={CleanDisplay === "Yard work" || CleanDisplay === "Select" || CleanDisplay === ""  ? {display:'none'}:{display:'block'}} >
            <h2>How many rooms do you have</h2>
            <div style={{display:'flex', flexDirection:'row',justifyContent:'Space-evenly'}}>
              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:'20px'}}>Bedrooms</label>
                <input type='number' className='RoomSelect' defaultValue={1} onChange={(e => setRooms(Number(e.target.value)) )}/>
              </div>
              <div style={{display:'flex', flexDirection:'column'}}>
                <label style={{fontSize:'20px'}}>Bathrooms</label>
                <input type='number' className='RoomSelect' defaultValue={1} onChange={(e => setBathRooms(Number(e.target.value)) )}/>
              </div>
            </div>
          </div>

          <div className='line' style={CleanDisplay === "Yard work"|| CleanDisplay === "Select" || CleanDisplay === "" ? {display:'none'}:{display:'block'}}></div>

          <div style={ CleanDisplay === "Select" || CleanDisplay === ""  ? {display:'none'}:{display:'block'}}>
            <h2>How what day of the week would you like</h2>
            <div className='DaysSelect'>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label > Any Day</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label > Monday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label > Tuesday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label > Wednesday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label > Thursday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label > Friday</label>
              </div>
              <div style={{display:'flex', alignItems:'center'}}>
                <input type='checkbox' className='check-UnSelected' />
                <label > Saturday</label>
              </div>
              </div>
            </div>

          <div className='line' style={CleanDisplay === "Select"|| CleanDisplay === ""  ? {display:'none'}:{display:'block'}}></div>

          <div style={CleanDisplay === "Select"|| CleanDisplay === ""  ? {display:'none'}:{display:'block'}} >
            <h2>What date would suit you?</h2>
            <input type='date' style={{width:'100%',border:'1.5px solid #394DFF',height:'35px', borderRadius:'10px',fontSize:'18px' ,textAlign:'center'}} onChange={(e)=> setdateformat(e.target.value)}/>
            </div>

          <div className='line' style={CleanDisplay === "Select" || CleanDisplay === "" ? {display:'none'}:{display:'block'}}></div>

          <div style={CleanDisplay === 'Custom Clean' || CleanDisplay === 'Yard work' || CleanDisplay === "Select" ? {display:'block'}:{display:'none'}}>
            <h2 style={CleanDisplay === 'Custom Clean' || CleanDisplay === 'Yard work'  ? {display:'block'}:{display:'none'}}>Custom Add On's</h2>

              <div className='CustomItemSection' style={CleanDisplay === 'Custom Clean' || CleanDisplay === 'Yard work' || CleanDisplay === "" ? {display:'flex'}:{display:'none'}}>
                
                <div className='CustomItemContainer' style={CleanDisplay === 'Custom Clean' ? {display:'flex'}:{display:'none'}}>
                  <h3 >Kitchen</h3>
                  {KitchenItems && KitchenItems.map(item => ( 
                    <div className='CustomItem'>
                      <label className='customCheckLabels' >{item['Name']}</label>
                      {item['TaskType'] == 'Each'? 
                      <input className='InputCustItem' type="number" defaultValue={0} onChange={(e => editforEachItem({Name:"Kitchen - " +item['Name'],Price:item['Price'],Quanity:e.target.value,TotalCost:0})) }/>:
                      <input type='checkbox' className='customChecks' value={item['Price']} onChange={(e => editcustomItems(e.target.checked,{Name:"Kitchen - " +item['Name'],Price:item['Price'],Quanity:1,EstTime:item['EstTime'],TotalCost:0}) )}/>
                      }
                      
                      </div>
                  ))}
                </div>

                <div className='CustomItemContainer' style={CleanDisplay === 'Custom Clean' ? {display:'flex'}:{display:'none'}}>
                  <h3 >Bedroom</h3>
                  {BedroomItems && BedroomItems.map(item => ( 
                    <div className='CustomItem'>
                      <label className='customCheckLabels'>{item['Name']}</label>
                      {item['TaskType'] == 'Each'? 
                      <input className='InputCustItem' type="number" defaultValue={0} onChange={(e => editforEachItem({Name:"Kitchen - " +item['Name'],Price:item['Price'],Quanity:e.target.value,TotalCost:0})) }/>:
                      <input type='checkbox' className='customChecks' value={item['Price']} onChange={(e => editcustomItems(e.target.checked,{Name:"Kitchen - " +item['Name'],Price:item['Price'],Quanity:1,EstTime:item['EstTime'],TotalCost:0}) )}/>
                      }</div>
                  ))}
                </div>
                <div className='CustomItemContainer' style={CleanDisplay === 'Custom Clean' ? {display:'flex'}:{display:'none'}}>
                  <h3 >Bathroom</h3>
                  {BathItems && BathItems.map(item => ( 
                    <div className='CustomItem'>
                      <label className='customCheckLabels'>{item['Name']}</label>
                      {item['TaskType'] == 'Each'? 
                      <input className='InputCustItem' type="number" defaultValue={0} onChange={(e => editforEachItem({Name:"Kitchen - " +item['Name'],Price:item['Price'],Quanity:e.target.value,TotalCost:0})) }/>:
                      <input type='checkbox' className='customChecks' value={item['Price']} onChange={(e => editcustomItems(e.target.checked,{Name:"Kitchen - " +item['Name'],Price:item['Price'],Quanity:1,EstTime:item['EstTime'],TotalCost:0}) )}/>
                      }</div>
                  ))}
                </div>
                <div className='CustomItemContainer' style={CleanDisplay === 'Custom Clean' ? {display:'flex'}:{display:'none'}}>
                  <h3 >Other</h3>
                  {OtherItems && OtherItems.map(item => ( 
                    <div className='CustomItem'>
                      <label className='customCheckLabels'>{item['Name']}</label>
                      {item['TaskType'] == 'Each'? 
                      <input className='InputCustItem' type="number" defaultValue={0} onChange={(e => editforEachItem({Name:"Kitchen - " +item['Name'],Price:item['Price'],Quanity:e.target.value,TotalCost:0})) }/>:
                      <input type='checkbox' className='customChecks' value={item['Price']} onChange={(e => editcustomItems(e.target.checked,{Name:"Kitchen - " +item['Name'],Price:item['Price'],Quanity:1,EstTime:item['EstTime'],TotalCost:0}) )}/>
                      }</div>
                  ))}
                </div>
                
                <div className='CustomItemContainer' style={CleanDisplay === 'Yard work' ? {display:'flex'}:{display:'none'}}>
                  <h3 >Yard Work</h3>
                  {OutSideItems && OutSideItems.map(item => ( 
                    <div className='CustomItem'>
                      <label className='customCheckLabels'>{item['Name']}</label>
                      {item['TaskType'] == 'Each'? 
                      <input className='InputCustItem' type="number" defaultValue={0} onChange={(e => editforEachItem({Name:item['Name'],Price:item['Price'],Quanity:e.target.value,TotalCost:0})) }/>:
                      <input type='checkbox' className='customChecks' value={item['Price']} onChange={(e => editcustomItems(e.target.checked,{Name:item['Name'],Price:item['Price'],Quanity:1,EstTime:item['EstTime'],TotalCost:0}) )}/>
                      }</div>
                  ))}
                </div>
              </div>
            </div>

          <div className='line'></div>

          <div >
            <h2>Speical Requirements</h2>
              <div style={{width:'-webkit-fill-available', display:'flex', justifyContent:'center'}}>
              <textarea id='specialReq' style={{width:'80%',height:'200px',}} onChange={(e => setSpecialReq(e.target.value))}/>
              </div>
          </div>

          <div className='line' ></div>

          <form action="/checkout" method="POST">
            <h2>Your Details</h2>
              <div style={{display:'flex', flexDirection:'row',justifyContent:'center'}}>
                <div style={{display:'flex', flexDirection:'column',padding:'15px'}}>
                  <input required name='ClientName' id='UserFName' placeholder='First Name' className='InputDetails' type="text" onChange={(e) => ClientDetails['FirstName']=e.target.value}/>
                  <input required name='UserEName' placeholder='Email' className='InputDetails' type="email" onChange={(e) => ClientDetails['Email']=e.target.value} />
                  <input required name='UserAdd' placeholder='Address' className='InputDetails' type="text" onChange={(e) => ClientDetails['Address']["Line1"] = e.target.value} />
                  <input required name='UserLState' placeholder='State' className='InputDetails' type="text" onChange={(e) => ClientDetails['Address']['State'] = e.target.value}/>
                </div>
                <div style={{display:'flex', flexDirection:'column',padding:'15px'}}>
                  <input required name='UserLName' placeholder='Last Name'  className='InputDetails' type="text" onChange={(e) => ClientDetails['LastName'] = e.target.value}/>
                  <input required name='UserPhone' placeholder='Phone' className='InputDetails' type="tel" onChange={(e) => ClientDetails['Phone'] = e.target.value}/>
                  <input required name='UserSub' placeholder='Suburb' className='InputDetails' value={suburb}  onChange={(e) => ClientDetails['Address']["Suburb"] = suburb}/>
                  <input required name='UserPCode' placeholder='Post code' className='InputDetails' onChange={(e) => ClientDetails['Address']['PostCode'] = e.target.value} />
                  <input name='OrderRef' value={OrderRefNumber} style={{display:"none"}} />
                  <input name='ServicePrice' value={TotalCostService} style={{display:"none"}}/>
                  <input name='Cleantype' value={CleanDisplay} style={{display:"none"}}/>
                  <input name='CleanDetails' value={CleanInfoItems} style={{display:"none"}} />
                  <input name='Details[]' value={JSON.stringify(Details)} style={{display:"none"}} />

                  
                </div>
              </div>
              <button type="submit" className='BookNowButton' style={CleanDisplay === 'Yard work' ? {display:'none'}:{display:'flex'}} onClick={() => CreateInvoice(OrderRefNumber,CleanDisplay,rooms,bathRooms,startDate,customItem,TotalCostService,specialReq)}>
                  Book Now
                </button>
              </form>
              <button className='BookNowButton' style={CleanDisplay === 'Yard work' ? {display:'flex'}:{display:'none'}} onClick={() => CreateYardInvoice(OrderRefNumber,CleanDisplay,startDate,customItem,specialReq)}>Book Quote</button>
          
        </div>

        <div className='bookingSumContainer'>
          <h3 className='BookSumTitle'>Your Booking Summary</h3>
            <div className='bookingItems'>
            <div className='booksumDiv'><a className='BookSumLineItemTitle'>Clean Type: </a><a className='BookSumLineItem'>{CleanDisplay}</a></div>
            <div style={{display:'none'}} className='booksumDiv'><a className='BookSumLineItemTitle'>Frequency: </a><a className='BookSumLineItem'>{reqId}</a></div>
            <div style={CleanDisplay === 'Yard work' ? {display:'none'}:{display:'flex'}} className='booksumDiv'><a className='BookSumLineItemTitle'>Rooms: </a><a className='BookSumLineItem'>{rooms}</a></div>
            <div style={CleanDisplay === 'Yard work' ? {display:'none'}:{display:'flex'}} className='booksumDiv'><a className='BookSumLineItemTitle'>Bathrooms: </a><a className='BookSumLineItem'>{bathRooms}</a></div>
            <div className='booksumDiv'><a className='BookSumLineItemTitle'>Start Date: </a><a className='BookSumLineItem'>{startDate}</a></div>
            <div style={CleanDisplay === 'Yard work' ? {display:'none'}:{display:'flex'}} className='booksumDiv'><a className='BookSumLineItemTitle'>Price Per-Service: </a><a className='BookSumLineItem'>${(((customItemCost) +((customItemCost) * disPrice)) + cost).toFixed(2)}</a></div>
            <div style={CleanDisplay === 'Yard work' ? {display:'none'}:{display:'flex', flexDirection:'row'}}><p>* Includes GST tax</p></div>
            </div>
        </div>

      </div>
    );
    
    // <button className='BookNowButton' onClick={() => CreateInvoice(CleanDisplay,reqId,rooms,bathRooms,startDate,customItem,TotalCostService)}>Book Now</button>
    function addItemTogether(tempmoney){
      setCustomItemCost(Number(tempmoney))

    }   

    async function editcustomItems(Checked,Value){

    if(Checked === true){
      //setCustomItemCost(Number(customItemCost) + Number(Value.Price))
      
      await setCustomItem([Value, ...customItem])
     
      
    }else{
      //setCustomItemCost(Number(customItemCost) - Number(Value.Price))
      
      setCustomItem(customItem.filter(item => item['Name'] !== Value.Name))
      
    }
    
    }

  

    function editforEachItem(Value){
  var arry_Item = customItem.findIndex((arr => arr.Name === Value['Name']))
    if(arry_Item == -1){
      setCustomItem([{Name:Value['Name'],Price:Value['Price'],Quanity:Value['Quanity'],TotalCost:Value['Quanity']*Value['Price']}, ...customItem])
    }else{
      var temptarr = []
      temptarr = customItem
      console.log(temptarr)
      setCustomItem((e) => e.map((item) =>{
        return item.Name === Value['Name'] ? {...item, Quanity:Value['Quanity'] } : item;
      }))
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

  async function CreateInvoice(RefCode, CleanType, Rooms, Bathroom, StartDate, CustomItems, ServiceCost,comments){
    const doc = new jsPDF();
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
    case 'Yard work':
      CleanInfoItems = CustomItems;
    break;

  }

  var logo = new Image();
  logo.src = '/Logo_Base.jpg';

    var d = new window.Date();
    var Date = d.getDate() +"" +(d.getMonth() + 1) +"" + d.getFullYear();
    var QDate = d.getDate() +"/" +(d.getMonth() + 1) +"/" + d.getFullYear();
    const storageRef = Stref(storage, '/Quotes/'+RefCode+" - "+ClientDetails['LastName']+" "+ClientDetails['FirstName']+" - "+Date);


    doc.addImage(logo, 'PNG', 10, 5,40,40)
    doc.text("Quote: " + RefCode, 200, 12, {align:'right'});
    doc.text("Date: " + QDate, 200, 20, {align:'right'});
    doc.text("ABN: ", 200, 26, {align:'right'});
    doc.text("ADDRESS line 1: ", 200, 32, {align:'right'});
    doc.text("ADDRESS line 2: ", 200, 38, {align:'right'});
    
    doc.text("Full Name: " + ClientDetails['FirstName'] + " " +ClientDetails['LastName'] , 10, 43, {align:'left'});
    doc.text("Phone: " + ClientDetails["Phone"] , 10, 48, {align:'left'});
    doc.text("Address: " + ClientDetails['Address']['Line1'] , 10, 53, {align:'left'});
   
    
    
    doc.setFontSize(18)
    
    doc.setFontSize(16)
    doc.text("Service Quote for " +Rooms + " Bedrooms & " +Bathroom + " Bathrooms requested for" + StartDate, 10, 70, {align:'left'});
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

    //doc.text(Frequency + " Service Starting on " + StartDate, 10, CusttextHeight + 20, {align:'left'});
    

    doc.text("Total Cost per Service: $" + ServiceCost , 10, CusttextHeight + 30, {align:'left'});

    doc.text("Special requirements:", 10, CusttextHeight + 40, {align:'left'});
      doc.text(comments, 10, CusttextHeight + 46, {align:'left'});
    var blob = doc.output("blob");
  
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
    }
 

  }

  async function CreateYardInvoice(RefCode, CleanType, StartDate, CustomItems,comments){
    const doc = new jsPDF();
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
   if(checkList <= 8){
  
    var logo = new Image();
    logo.src = '/Logo_Base.jpg';
  
      var d = new window.Date();
      var Date = d.getDate() +"" +(d.getMonth() + 1) +"" + d.getFullYear();
      var QDate = d.getDate() +"/" +(d.getMonth() + 1) +"/" + d.getFullYear();
      const storageRef = Stref(storage, '/Quotes/'+RefCode+" - "+ClientDetails['LastName']+" "+ClientDetails['FirstName']+" - "+Date);
  
  
      doc.addImage(logo, 'PNG', 10, 5,40,40)
      doc.text("Quote: " + RefCode, 200, 12, {align:'right'});
      doc.text("Date: " + QDate, 200, 20, {align:'right'});
      doc.text("ABN: ", 200, 26, {align:'right'});
      doc.text("ADDRESS line 1: ", 200, 32, {align:'right'});
      doc.text("ADDRESS line 2: ", 200, 38, {align:'right'});
      
      doc.text("Full Name: " + ClientDetails['FirstName'] + " " +ClientDetails['LastName'] , 10, 43, {align:'left'});
      doc.text("Phone: " + ClientDetails["Phone"] , 10, 48, {align:'left'});
      doc.text("Address: " + ClientDetails['Address']['Line1'] , 10, 53, {align:'left'});
      doc.text("Address: " + ClientDetails['Address']['Suburb'] + " " + ClientDetails['Address']['PostCode'] + " " + ClientDetails['Address']['State'] , 10, 58, {align:'left'});
      doc.setFontSize(16)
      doc.text("Service Quote Required for "+ CleanType + " on " + StartDate+ " includes: ", 10, 70, {align:'left'});
      var textHeight = 75;
      doc.setFontSize(16)
      for(var i=0;i<CustomItems.length;i++){
        doc.setFontSize(12)
        doc.text("- "+ CustomItems[i].Name + " - " + CustomItems[i].Quanity, 10, textHeight, {align:'left'});
        textHeight = textHeight + 5;
      }
      doc.text("Special requirements", 10, textHeight + 10, {align:'left'});
      doc.text(comments, 10, textHeight + 15, {align:'left'});

      //StartDate
      var blob = doc.output("blob");
    
      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
      }
   
  }
  

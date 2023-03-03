import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import React from 'react';
import $ from 'jquery';
import * as icons from './icons/icons.js';
// var ReactDOM = require('react-dom');

// Global variables
var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/*  React Weather App
    A react app, styled with mostly my own CSS/SASS, some Bootstrap components, and an open-source SVG library to display statistics of inputted city. Once city is inputted
    the API is called and returns on object which we pull our desired values from for determination of the icons and display of said values.

    APIs Used
    https://openweathermap.org/api/one-call-api    

    Must Do
    - consolidate 1456px query
    - combine max/min, font etc css attributes to shorthands
    - make card to cover empty daily section (before input)
    - change font values to shorthands where needed

    Want To Do
    - find way to be more specific in input, ie allow Paris, Texas instead of always getting Paris, France
    - replace card with https://github.com/Yevgenium/weather-chart-card 
    - find different API to do whole process in 1 call !2
    - Figure out function comment convention https://google.github.io/styleguide/jsguide.html#jsdoc-general-form 
    - Make convertDT return am/pm values instead of 24hr format
    - include more info in hourly section
    - style scroll bar (hourly, daily)
    - expand on weatherChecks variety of icons
    - have hourly & weekly cards have isDay checked icons based on relevant times

    Current Task(s)
    - working on placeholder div to cover daily/act intro for user displaying how to use
    - working on media queries (DONE I think)
      - Tablet
        - need to decide if this is even necessary, it already scales decently well
        - maybe should only change if I come up with design changes
      - Mobile
        - need to remap whole dashboard grid + grid areas for children etc
        - restyle input bar, daily
        - organize daily(weekly) cards in portrait/mobile friendly manner


      RESOURCES    
      - curent cards
        - for hourly div 
        https://stackoverflow.com/questions/443700/div-with-horizontal-scrolling-only 
  */

// Perhaps should be function since no state
class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.weatherCheck = this.weatherCheck.bind(this);   
    this.isDay = this.isDay.bind(this);
  }

  componentDidUpdate(prevProps){
    if(prevProps.dt !== this.props.dt){  // When time changes
      console.log(this.props);

      // Determining proper SVG
      let mySVG = this.weatherCheck(this.props.id, this.props.dt);

      // Assorted JQ
      $('#Dashboard #daily #icon-cont #icon img').prop('src', mySVG);    // change src to returned svg

      // $('#Dashboard #daily #icon-cont #icon #feelsLike').text('Feels Like ');           // continues to prepend/append (feels like feels like feels like)
      // $('#degree').text(' &#8451;');
    
      // console.log(this.convertDT(this.props.dt));
    }
  }

  componentDidMount(){
      
      // $('#Dashboard #daily #icon-cont #icon #feelsLike').prepend('Feels Like ');           // continues to prepend/append (feels like feels like feels like)
      // $('#degree').append(' &#8451;')
  }

  /*  getTime
      params
        {dt}: unix time thingy
        {shift}: zone-shift variable 
        {rv}: return value
      returns
        {date}: shortened converted date (11:30, 03:20 etc)

      - zone shift seems irrellivent???? did I even spell that right?
  */
  getTime(dt, rv){
    let time = dt * 1000,
        date = new Date(time);
/*
    if(date.getHours() > 12){
      return (date.getMinutes() < 10 ? `${date.getHours() - 12}:0${date.getMinutes()}` : `${date.getHours()}:${date.getMinutes()} am`)
    } else {
      return (date.getMinutes() < 10 ? `${date.getHours()}:0${date.getMinutes()}` : `${date.getHours()}:${date.getMinutes()} pm`)
    }
*/      
    if(rv === 'time'){  // if user requests the time
      if(date.getHours() > 12){
        return (date.getMinutes() < 10 ? `${date.getHours() - 12}:0${date.getMinutes()} pm` : `${date.getHours() - 12}:${date.getMinutes()} pm`)
      } else {
        return (date.getMinutes() < 10 ? `${date.getHours()}:0${date.getMinutes()} am` : `${date.getHours()}:${date.getMinutes()} am`)
      }
    } else if(rv == 'day'){  // if user requests the day 
      return weekdays.slice(date.getDay(), date.getDay() + 1) // returns day of the week corresponding to dt
    }
  }

  /*  isDay
      params
        {dt}: unix time thingy
      returns
        {bool}: day = true, night = false
  */
  isDay(dt){
    let time = dt * 1000,       
    date = new Date(time);    // getting date object

    if (date.getHours >= 7 && date.getHours <= 19){ // if between 7am and 7pm
      return true;    // true == day
    }

    return false;     // false == night
  }

  /*  weatherCheck(number)
      param 
        {number}: props.main, >=1 digit number
      returns  
        {svg}: icons.xxxxx
      
      determines svg to return based on inputted number
  */ 
  weatherCheck(daily, dt){   
    /* 
      - Since there aren't many options for each category, I decided to use if statementes 
        as a placeholder
      
      - is there a better way than this 'two-tiered' 
        (id, idObjects) => {
          if(idObjects.map(() => {
            
          }))
        }
    */ 
    // use regex to determine what number daily starts with
    if(/^2/.test(daily.toString())){              // Thunderstorms  
      if(daily === 201){
        return icons.rainThunderstorm;
      } else {
        return icons.thunderstormsDefault;
      }
    } else if (/^3/.test(daily.toString())){
      return icons.drizzle;
    } else if (/^5/.test(daily.toString())){
      if(daily === 502){
        return icons.heavyRain;
      } else {
        return icons.rainDefault;
      }
    } else if (/^6/.test(daily.toString())){
      return icons.snowDefault;
    } else if (/^7/.test(daily.toString())){    // need to incorporate time check to differentiate
      if(this.isDay(dt)){
        return icons.fogDay;
      }
      return icons.fogNight;
    } else if (daily === 800){
      if(this.isDay(dt)){
        return icons.clearDay;
      }
      return icons.clearNight;
    } else if (/^8/.test(daily.toString())){
      return icons.cloudyDefault;
    }
  }

  render() {
    return (
      <div id='Dashboard'>{/*current={this.props.current} city={this.props.city} country={this.props.country}*/}    
        <div id='daily'>  
          <div id='icon-cont'>    {/* Need to update componentDidUpdate with changes to DOM */}
            <div id='icon'>
              <img src='...' alt=''/>
              <p id='temp'>{this.props.temp}<p id='degree'>&#8451;</p></p>
              <p id='feelsLike'>Feels Like {this.props.feelsLike}<p id='degree'>&#8451;</p></p> {/* Need to include 'Feels Like: ' w/o showing to early */}
              <p id='asof'>As Of {this.getTime(this.props.dt, 'time')}</p>
            </div>
          </div>      
          <div id='stats'>  
            <div id='desc'>
              <h1>
                <b>{this.props.main}</b>
              </h1>
            </div>
            <div id='location'>
              <h2>{this.props.city}&nbsp;<b>{this.props.country}</b></h2>
            </div>
            <div id='uvi' className='etc' title='Cloud Coverage'> {/* should eventually convert css to reflect actual value*/}
              <img src={icons.clouds} alt='...' /> {this.props.clouds}
            </div>
            <div id='hum' className='etc' title='Humidity'> 
              <img src={icons.humidity} alt='...'/>{this.props.humidity}  
            </div>      
            <div id='sunr' className='etc' title='Sunrise'>
              <img src={icons.sunrise} alt='...'/>{this.getTime(this.props.sunrise, 'time')}
            </div>
            <div id='suns' className='etc' title='Sunset'>
              <img src={icons.sunset} alt='...'/>{this.getTime(this.props.sunset, 'time')}
            </div>  
          </div>
          <div id='hourly-cont'>
            {
              this.props.hourly.map((currElement, index) => {
                return(
                  <div className='hourlyCard'>
                    <h2>{Math.round(currElement.temp)}<p id='degree'>&#8451;</p></h2>
                    <img src={this.weatherCheck(this.props.id, currElement.dt)} alt=''/>
                    <h3>{this.getTime(currElement.dt, 'time')}</h3>
                  </div>
                )
              })
            }
          </div>
        </div>        
        <div id='weekly'>
            { // use the currElement to get the object values
              this.props.daily.map((currElement, index) => {
                return( // using a bootstrap card
                  <div className="card">
                    <div id='date'>
                      <div><b>{this.getTime(currElement.dt, 'day')}</b></div>
                    </div>
                    <div id='icon'>                   
                      <img src={this.weatherCheck(currElement.weather[0].id, currElement.weather[0].dt)} alt=''/>
                    </div>
                    <div id='temp'>
                      <h2 id='temp'>{Math.round(currElement.temp.day)}<p id='degree'>&#8451;</p></h2>
                    </div>
                    <div id='feelsLike'>
                      <div><b>Feels Like {Math.round(currElement.feels_like.day)}<p id='degree'>&#8451;</p></b></div>
                    </div> {/* dont work for some reason */}
                    <div id='cloud' title='Cloud Coverage'>              
                      <img src={icons.clouds} alt='...' />{currElement.clouds}%
                    </div>
                    <div id='high' title='High Temp'>
                      <img src={icons.high} alt='...'/>{Math.round(currElement.temp.max)}<p id='degree'>&#8451;</p>
                    </div>
                    <div id='hum' title='Humidity'>
                      <img src={icons.humidity} alt='...'/>{currElement.humidity}%
                    </div>
                    <div id='low' title='Low Temp'>
                      <img src={icons.low} alt='...'/>{Math.round(currElement.temp.min)}<p id='degree'>&#8451;</p>
                    </div>
                  </div>
                )
              })
            }
        </div>
      </div>
    );
  }

}

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {    // is it necessary to init these values?? if i dont have to for main etc...
      city: '',
      country: '',
      daily: [],
      hourly: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    $('#submit').keypress((event) => {
      var keycode = (event.keyCode ? event.keyCode : event.which);    // **** seeing if its the enter key??? I gotta do somthn diff
      if(keycode == '13'){
        this.handleSubmit();                                          // find lat & long
      }
    });
  }

  handleSubmit = () => {
    // Gather input
    let location = $('#submit').val();                            // gather inputted city

    // handling first API call
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=ad46bca0cb15937504da590a8559bbae`)
      .then(response => response.json())
      .then(data => {     // storing desired API data in state
          this.setState({
            city: data[0].name,
            country: data[0].country
          })

          return fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&units=metric&exclude=alerts&appid=ad46bca0cb15937504da590a8559bbae`)
      }) // Handling second API call
      .catch(err => {
        console.error('Call Failed', err)
      })
      .then(response => response.json())
      .then(data => {     // store desired API data in state
        // console.log(data.current);
        // pooling values in an object so they're readable and state isnt just a top level eval 
        const propObj = {current: {...data.current}, daily: [...data.daily], hourly: [...data.hourly]};

        this.setState({     // pulling from obj above 
          main: propObj.current.weather[0].main,
          desc: propObj.current.weather[0].desc,
          id: propObj.current.weather[0].id,
          dt: propObj.current.dt,
          clouds: propObj.current.clouds,
          feelsLike: Math.round(propObj.current.feels_like),
          humidity: propObj.current.humidity,
          pressure: propObj.current.pressure,
          sunrise: propObj.current.sunrise,
          sunset: propObj.current.sunset,
          temp: Math.round(propObj.current.temp),
          uvi: propObj.current.uvi,
          windspeed: propObj.current.windspeed,
          zoneShift: data.timezone_offset,          

          daily: propObj.daily,
          hourly: propObj.hourly.slice(0, 24)                   // limiting to 24 hours
        })

        // console.log(this.state);        // state is successfully stored with complete values
      })
      .catch(err => {
        console.error('Call Failed', err)
      })
  };

  render(){
    return (
      <div id='container'>  
        <div id='input-container'>
          <div id='input-box' className="input-group input-group-sm w-50 mx-auto">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-sm">Location</span>
            </div>
            <input id='submit' type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder='eg. Toronto, New York, Paris'></input>
          </div>  
        </div>
        <Dashboard {...this.state}/>
      </div>
    );
  }
}

export default App;
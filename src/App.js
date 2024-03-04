import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import React from 'react';
import $ from 'jquery';
import * as icons from './icons/icons.js';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import {Helmet} from "react-helmet";

// var ReactDOM = require('react-dom');

// Global variables
var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// API keys
var autocompleteKey = '62e93b34c2ee4337b92e9b81d777029a';

/*  React Weather App
    A react app, styled with mostly my own CSS/SASS, some Bootstrap components, and an open-source SVG library to display statistics of inputted city. Once city is inputted
    the API is called and returns on object which we pull our desired values from for determination of the icons and display of said values.

    APIs Used
    https://openweathermap.org/api/one-call-api    

    Want To Do
    - replace card with https://github.com/Yevgenium/weather-chart-card 
    - Figure out function comment convention https://google.github.io/styleguide/jsguide.html#jsdoc-general-form 

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
      $('#Dashboard #daily #icon img').prop('src', mySVG);    // change src to returned svg
      $('#Dashboard #daily').css('display', 'grid');            // display daily card
      $('#Dashboard #weekly').css('display', 'flex');           // display weekly
      $('#Dashboard #defaultDaily').css('display', 'none');     // hide default card
    }
  }

  /*  getTime
      params
        {dt}: unix time thingy
        {shift}: zone-shift variable 
        {rv}: return value
      returns
        {date}: shortened converted date (11:30, 03:20 etc)
  */
  getTime(dt, rv){
    let time = dt * 1000,
        date = new Date(time);

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
    // use regex to determine what number daily starts with
    if(/^2/.test(daily.toString())){              // Thunderstorms  
      if(daily === 201){
        return icons.rainThunderstorm;
      } else {
        return icons.thunderstormsDefault;
      }
    } else if (/^3/.test(daily.toString())){      // Drizzle
      return icons.drizzle;
    } else if (/^5/.test(daily.toString())){      // Rain
      if(daily === 502){
        return icons.heavyRain;
      } else {
        return icons.rainDefault;
      }
    } else if (/^6/.test(daily.toString())){      // Snow
      return icons.snowDefault;
    } else if (/^7/.test(daily.toString())){      // Fog
      if(this.isDay(dt)){
        return icons.fogDay;
      }
      return icons.fogNight;
    } else if (daily === 800){                    // Clear
      if(this.isDay(dt)){
        return icons.clearDay;
      }
      return icons.clearNight;
    } else if (/^8/.test(daily.toString())){      // Cloudy
      return icons.cloudyDefault;
    }
  }

  render() {
    return (
      <div id='Dashboard'>{/*current={this.props.current} city={this.props.city} country={this.props.country}*/} 
        <div id='defaultDaily'>
          <div id='icon'>
            <img src={icons.clearDay} alt=''/>
          </div>
          <div id='title'>
            <h1>Weather<br/>Application</h1>
          </div>
          <div id='desc'>
            <p>
              A Weather Dashboard application, created by <a href='https://ben-langlois.github.io/Portfolio/'>Ben Langlois</a>, aimed to display weather statistics for inputted city. The application is
              built in React and SASS, it utilizes multiple APIs such as: <a href='https://www.geoapify.com/address-autocomplete'>GeoApify</a>, and <a href='https://openweathermap.org/api/one-call-3'>OpenWeatherMap API</a>.<br/><br/>
              The application allows users to search for the weather in a specific city and displays the current weather conditions along with hourly and weekly 
              forecasts. Cards display temperatures and various stats such as: humidity, precipitation, sunrise/set etc.
            </p>
            <div id='socials'>
              <a href='https://github.com/Ben-Langlois/Weather-App'><img src={icons.github}/></a>
              <a href='https://www.linkedin.com/in/benjaminlanglois/'><img src={icons.linkedin}/></a>
          </div>

          </div>
        </div>   
        <div id='daily'>  
          <div id='icon'>
            <img src='...' alt=''/>
            <p id='temp'>{this.props.temp}<p class='degree'>&#8451;</p></p>
          </div>
          <div id='stats'>  
            <div id='desc'>
              <h1>
                <b>{this.props.main}</b>
              </h1>
            </div>
            <div id='location'>
              <h2>{this.props.formatted}</h2>
            </div>
          </div>
          <div id="details">
            <p id='feelsLike'>Feels Like {this.props.feelsLike}<p class='degree'>&#8451;</p></p> 
            <p id='asof'>As Of {this.getTime(this.props.dt, 'time')}</p>
            <div id='etc'>
              <div id='uvi' className='etc' title='Cloud Coverage'> 
                <img src={icons.clouds} alt='...' />
                <p>{this.props.clouds} % </p>
              </div>
              <div id='hum' className='etc' title='Humidity'> 
                <img src={icons.humidity} alt='...'/>
                <p>{this.props.humidity} % </p> 
              </div>      
              <div id='sunr' className='etc' title='Sunrise'>
                <img src={icons.sunrise} alt='...'/>
                <p>{this.getTime(this.props.sunrise, 'time')}</p>
              </div>
              <div id='suns' className='etc' title='Sunset'>
                <img src={icons.sunset} alt='...'/>
                <p>{this.getTime(this.props.sunset, 'time')}</p>
              </div>   
            </div>
          </div>
          <div id='hourly-cont'>
            {
              this.props.hourly.map((currElement, index) => {
                return(
                  <div className='hourlyCard'>
                    <h2>{Math.round(currElement.temp)}<p class='degree'>&#8451;</p></h2>
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
                return( 
                  <div className="card">
                    <div id='date'>
                      <h3>{this.getTime(currElement.dt, 'day')}</h3>
                    </div>
                    <div id='icon'>                   
                      <img src={this.weatherCheck(currElement.weather[0].id, currElement.weather[0].dt)} alt=''/>
                    </div>
                    <div id='temp'>
                      <h2 id='temp'>{Math.round(currElement.temp.day)}<p class='degree'>&#8451;</p></h2>
                    </div>
                    <div id='feelsLike'>
                      <h4>Feels Like {Math.round(currElement.feels_like.day)}<p class='degree'>&#8451;</p></h4>
                    </div> 
                    <div id='cloud' class='etc' title='Cloud Coverage'>              
                      <img src={icons.clouds} alt='...' />
                      <p>{currElement.clouds}%</p>
                    </div>
                    <div id='hum' class='etc' title='Humidity'>
                      <img src={icons.humidity} alt='...'/>
                      <p>{currElement.humidity}%</p>
                    </div>                    
                    <div id='high' class='etc' title='High Temp'>
                      <img src={icons.high} alt='...'/>
                      <p>{Math.round(currElement.temp.max)}<p class='degree'>&#8451;</p></p>
                    </div>
                    <div id='low' class='etc' title='Low Temp'>
                      <img src={icons.low} alt='...'/>
                      <p>{Math.round(currElement.temp.min)}<p class='degree'>&#8451;</p></p>
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
    this.state = {   
      city: '',
      country: '',
      lat: '',
      lon: '',
      daily: [],
      hourly: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    // Autocomplete mumbo jumbo
    const autocomplete = new GeocoderAutocomplete(
      document.getElementById("autocomplete"), 
      autocompleteKey, 
      { /* Geocoder options */ });

    // When location is selected
    autocomplete.on('select', (location) => {
      // console.log(location);
      this.setState({
        city: location.properties.city,
        formatted: location.properties.formatted,
        country: location.properties.country,
        lat: location.properties.lat,
        lon: location.properties.lon
      });
      // console.log(this.state)

      this.handleSubmit();                                          

    });
  }

  handleSubmit = () => {
    // fetching API with lat and long from submit
    fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.lon}&units=metric&exclude=alerts&appid=ad46bca0cb15937504da590a8559bbae`)
      .then(response => response.json())
      .then(data => {     // storing desired API data in state
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
          console.log(this.state);        // state is successfully stored with complete values
        })
        .catch(err => {
          console.error('Call Failed', err)
        })
  };

  render(){
    return (
      <div id='container'>  
        <Helmet>
          <meta charSet="utf-8" />
          <title>Ben's Weather App</title>
        </Helmet>
        <div id='input-container'>
          <div id='input-box' className="input-group input-group-sm w-50 mx-auto">
              <div id="autocomplete" class="autocomplete-container"></div>
          </div>  
        </div>
        <Dashboard {...this.state}/>
      </div>
    );
  }
}

export default App;
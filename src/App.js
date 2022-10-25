import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import React from 'react';
import $ from 'jquery';
import * as icons from './icons/icons.js';
// var ReactDOM = require('react-dom');

/*  React Weather App
    A react app, styled with mostly my own CSS/SASS, some Bootstrap components, and an open-source SVG library to display statistics of inputted city. Once city is inputted
    the API is called and returns on object which we pull our desired values from for determination of the icons and display of said values.

    APIs Used
    https://openweathermap.org/api/one-call-api    

    Must Do

    - creating timeCheck function to determine icons based on time (Dashboard/timeCheck())
        trying to hoist timezone_offset to determine time of location
          let time = (dt + timezone_offset).convert to real time
          if(time >= 6am && time <= 7pm){
            return day
          } else {
            return night
          }
      https://www.epochconverter.com/programming/#javascript 

    Want To Do
    - find way to be more specific in input, ie allow Paris, Texas instead of always getting Paris, France
    - find different API to do whole process in 1 call !2
    - replace card with https://github.com/Yevgenium/weather-chart-card 
    - Figure out function comment convention https://google.github.io/styleguide/jsguide.html#jsdoc-general-form 


    Current Task
    - style current and daily cards
      - styling hourly section 

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
    this.timeCheck = this.timeCheck.bind(this);
  }

  componentDidUpdate(prevProps){
    if(prevProps.dt !== this.props.dt){  // When time changes
      console.log(this.props);

      // Determining proper SVG
      let id = this.props.id,
          mySVG = this.weatherCheck(id);

      // Assorted JQ
      $('#Dashboard #daily #icon-cont #icon img').prop('src', mySVG);    // change src to returned svg

      // $('#Dashboard #daily #icon-cont #icon #feelsLike').text('Feels Like ');           // continues to prepend/append (feels like feels like feels like)
      // $('#degree').text(' &#8451;');
    }
  }

  componentDidMount(){
      
      // $('#Dashboard #daily #icon-cont #icon #feelsLike').prepend('Feels Like ');           // continues to prepend/append (feels like feels like feels like)
      // $('#degree').append(' &#8451;')
  }

  /*  timeCheck(dt)
      params
        {dt}: unix time thingy
      returns
        {bool}: true = day/false = night

      determines if its day or night based on dt

      - for some reason, the times arent accurate???
  */
  timeCheck(dt, shift){
    var time = dt + shift;
    var date = new Date(time * 1000);
    // console.loge(date);
  }

  /*  weatherCheck(number)
      param 
        {number}: props.main, >=1 digit number
      returns  
        {svg}: icons.xxxxx
      
      determines svg to return based on inputted number
  */ 
  weatherCheck(daily){   
    this.timeCheck(this.props.dt, this.props.zoneShift);     
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
      return icons.fogDay;
    } else if (daily === 800){
      return icons.clearDay;
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
          </div>
        </div>      
        <div id='stats'>  
          <div id='location'>
            <h2>{this.props.city}&nbsp;<br/><b>{this.props.country}</b></h2>
          </div>
          <div id='uvi' class='etc'>
            <img src={icons.UVI} alt='...' /> {this.props.uvi}
          </div>
          <div id='hum' class='etc' >
            <img src={icons.humidity} alt='...'/>{this.props.humidity}  
          </div>      
          <div id='sunr' class='etc' >
            <img src={icons.sunrise} alt='...'/>{this.props.sunrise}
          </div>
          <div id='suns' class='etc' >
            <img src={icons.sunset} alt='...'/>{this.props.sunset}
          </div>  
        </div>
        <div id='hourly'>
          {
            this.props.hourly.map((currElement) => {
              return(
                <div className='hourlyCard'>
                  {currElement.temp}
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
                  <img className="card-img-top" src='...' alt=''></img>
                  <div className="card-body">
                    <h5 className="card-title">{index}</h5>
                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
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

        // pooling values in an object so they're readable and state isnt just a top level eval 
        const propObj = {current: {...data.current}, daily: [...data.daily], hourly: [...data.hourly]};

        this.setState({     // pulling from obj above 
          main: propObj.current.weather[0].main,
          desc: propObj.current.weather[0].desc,
          id: propObj.current.weather[0].id,
          dt: propObj.current.dt,
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
          hourly: propObj.hourly.slice(0, 23)                   // limiting to 24 hours
        })

        // console.log(this.state);        // state is successfully stored with complete values
      })
      .catch(err => {
        console.error('Call Failed', err)
      })
  };

  render(){
    return (
      <div>  
        <div id='input-box' className="input-group input-group-sm w-50 mb-3 mx-auto my-5">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">Location</span>
          </div>
          <input id='submit' type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder='eg. Toronto, New York, Paris'></input>
        </div>  
        <Dashboard {...this.state}/>
      </div>
    );
  }
}

export default App;
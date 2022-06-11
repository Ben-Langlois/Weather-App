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
    - Figure out function comment convention https://google.github.io/styleguide/jsguide.html#jsdoc-general-form 
    - Recode keypress event

    Want To Do
    - find way to be more specific in input, ie allow Paris, Texas instead of always getting Paris, France
*/

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.weatherCheck = this.weatherCheck.bind(this);    
  }

  componentDidUpdate(prevProps){
    if(prevProps.city !== this.props.city){  // When city is input
      // console.log('changed');
      // this.weatherCheck();
      console.log(this.props.daily);
    }
  }

  // Determining weather for icons
  weatherCheck(current, daily){
    // Switch case to check props.main ('cloudy', 'rainy', etc)
    return 
  }

  render() {
    // const props = {current: {...this.props.current}, city: this.props.city, country: this.props.country}

    return (
      <div id='Dashboard'>{/*current={this.props.current} city={this.props.city} country={this.props.country}*/}    
      <div id='daily'>  
        <div id='icon'>
          <img src={this.weatherCheck()} alt=''></img>
        &nbsp;
        </div>      
        <div id='stats'>  
          <div id=''>
            <h2><b>{this.props.city}</b>&nbsp;{this.props.country}</h2><br/><br/>

          </div>
  
          asasd

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

    this.state = {    // is it necessary to init these values if i dont have to for main etc...
      city: '',
      country: '',
      daily: [],
      hourly: [],
      // main: '',
      // desc: '',
      // dt: '',
      // feels_like: '',
      // humidity: '',
      // pressure: '',
      // sunrise: '',
      // sunset: '',
      // temp: '',
      // uvi: '',
      // windspeed: ''
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
            country: data[0].country,
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
          dt: propObj.current.dt,
          feelsLike: propObj.current.feels_like,
          humidity: propObj.current.humidity,
          pressure: propObj.current.pressure,
          sunrise: propObj.current.sunrise,
          sunset: propObj.current.sunset,
          temp: propObj.current.temp,
          uvi: propObj.current.uvi,
          windspeed: propObj.current.windspeed,

          daily: propObj.daily,
          hourly: propObj.hourly
        })

        console.log(this.state.main);        // state is successfully stored with complete values
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
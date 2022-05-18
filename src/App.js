import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import React from 'react';
import $ from 'jquery';
import * as icons from './icons/icons.js';
// import svgs from './icons/icons';

var ReactDOM = require('react-dom');


/*
  - Figure out function comment convention https://google.github.io/styleguide/jsguide.html#jsdoc-general-form 
  - Recode keypress event
*/


class DailyIcon extends React.Component {
  constructor(props){
    super(props);

  }

  // componentDidUpdate(prevProps){
  //   if(prevProps !== this.props){
  //     console.log(this.props)

  //   }
  // }

  render() {
    return (
      <div id='daily'>  
        <div id='icon'>

        &nbsp;
        </div>      
        <div id='stats'>  
          <h2><b>{this.props.clouds}</b>&nbsp;{this.props.country}</h2>

        </div>
      </div>
    );
  }



}

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.weatherCheck = this.weatherCheck.bind(this);    
  }

  componentDidUpdate(prevProps){
    if(prevProps.city !== this.props.city){  // When city is input
      // console.log('changed');
      // this.weatherCheck();
      console.log(this.props);
    }
  }
  




  // Determining weather for icons
  weatherCheck(current, daily){

    console.log('check');
    console.log(current.clouds);

    // What time (day/night)
    
      // If sunny
      // if(this.props.current.clouds <= 50){
      //   console.log('check');

      //   // ReactDOM.render(
      //   //   <img id='main' src={icons.clearDay} alt=''/>,
      //   //   document.getElementById('icon')
      //   // );
      // }
        // change svg 

      // If raining/snowing

      // If windy

      // If hot ??

      //
  }

  render() {
    return (
      <div id='Dashboard'>
        <DailyIcon current={this.props.current}/>
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

    this.state = {
      city: '',
      country: '',
      current: {},
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
    let location = $('#submit').val();                            // gather input

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
      .then(data => {     // storing desired API data in state
        this.setState({
          current: data.current,
          daily: data.daily,
          hourly: data.hourly
        })

        // console.log(this.state);
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
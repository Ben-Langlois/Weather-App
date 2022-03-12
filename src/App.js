import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import React, { Component } from 'react';
import $ from 'jquery';

/*
  - Figure out function comment convention https://google.github.io/styleguide/jsguide.html#jsdoc-general-form 
  - Recode keypress event l21
  - Find other way to call apis, so error handling works
*/

class App extends Component {
  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRetrieval = this.handleRetrieval.bind(this);
  }


  componentDidMount(){
    $('#submit').keypress((event) => {
      var keycode = (event.keyCode ? event.keyCode : event.which);    // **** seeing if its the enter key??? I gotta do somthn
      if(keycode == '13'){
        let location = $('#submit').val();                            // gather input
        this.handleSubmit(location);                                  // find lat & long
        console.log('asasd');                                          
      }
    });
  }


  handleSubmit = (location) => {

    // passing input through api to find coords
    // using jquery to make call
    $.ajax({
      url: `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=ad46bca0cb15937504da590a8559bbae`,
      type: 'GET',
      success: function (result){     // Retrieves object
        console.log(result);

        // gather needed values
        this.handleRetrieval({          
          country: result[0].country,
          state: result[0].state,
          city: result[0].city,
          lat: result[0].lat,
          lon: result[0].lon});      // pass through
      },
      error: function (error){        // Error handling **** doesn't really work yet
        console.log('didnt work');
        console.log(error);
      }
    })
  }

  handleRetrieval = function (obj) {
    // store values for easy access
    console.log(obj);


    // $.ajax({
    //   url: 'http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit={limit}&appid=ad46bca0cb15937504da590a8559bbae',
    //   type: 'GET',
    //   success: function (result){
        
    //   },
    //   error: function (error){

    //   }
    // })
  }

  render(){
    return (
      <div>
        <div class="input-group input-group-sm w-50 mb-3 mx-auto my-5">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">Location</span>
          </div>
          <input id='submit' type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder='eg. Toronto, New York, Paris'></input>
        </div>  
      </div>
    );
  }
}

export default App;
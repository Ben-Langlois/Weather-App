import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { Component } from 'react';
import $ from 'jquery';

class App extends Component {

  handleSubmit = () => {
    let location = $('#form=control').val();

    $.ajax({
      url: `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=ad46bca0cb15937504da590a8559bbae"`,
      type: 'GET',
      success: function (result){
        
      },
      error: function (error){

      }
    })
  }

  onRetrieval = (coords) => {
    $.ajax({
      url: 'http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit={limit}&appid=ad46bca0cb15937504da590a8559bbae',
      type: 'GET',
      success: function (result){
        
      },
      error: function (error){

      }
    })
  }

  render(){
    return (
      <div>
        <div class="input-group input-group-sm w-50 mb-3 mx-auto my-5">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">Location</span>
          </div>
          <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder='eg. Toronto, Ontario'></input>
        </div>  
      </div>
    );
  }
}

export default App;
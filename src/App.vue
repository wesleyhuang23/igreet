<template>
  <section v-bind:style="{ backgroundImage: 'url(' + background + ')' }">
    <!--weather box top right-->
    <div class="weather" :alt="this.weather.condition">
      <p v-on:click="unitChange()">{{weather.temp}}<span>{{weather.degree}}</span></p>
      <p>{{weather.city | uppercase }}</p>
    </div>
    <!--main center content, clock and greeting-->
    <div class="content">
      <span class="clock">{{hours}}:{{min}}</span><br>
      <h1 class="greeting">{{greeting}}, <span id="name">{{name}}</span></h1><input type="text" placeholder="name" v-model="name" v-on:keyup="submitName(name, $event)"/>
    </div>
    <!--quote on the bottom-->
    <div class="quote">
      <p>{{quote.quote}}</p>
      <p>{{quote.author}}</p>
    </div>
  </section>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'app',
  data () {
    return {
      hours: '',
      min: '',
      name: '',
      spaces: '',
      greeting: 'Good Morning',
      background: localStorage.img,
      weather: {
        city: '',
        temp: '',
        unit: 'f',
        condition: '',
        degree: '°'
      },
      quote: {
        author: '',
        quote: '',
      }
    }
  },
  methods: {
    //clock logic
    updateClock: function() {
      let now = new Date()
      let hours = now.getHours();
      let min = now.getMinutes();
      let day = now.getDay();
      let year = now.getFullYear();
      // console.log(hours);
      localStorage.day = day;
      localStorage.year = year;
      if(hours <= 12 && hours >= 0){
        this.hours = hours;
      } else {
        this.hours = hours - 12;
      }
      if(min < 10){
        this.min = '0' + min;
      } else {
        this.min = min;
      }
      //greeting logic throughout the day
      if(hours > 0 && hours < 12){
        this.greeting = 'Good Morning';
      } else if(hours >= 12 && hours <= 18 && min >= 0){
        this.greeting = 'Good Afternoon';
      } else if(hours >= 18 && hours <= 24 && min >= 0){
        this.greeting = 'Good Evening';
      }
    },
    initClock: function(){
      this.updateClock();
      window.setInterval(this.updateClock, 1000);
    },
    //form logic
    submitName: function(name, event){
      if(event.keyCode == 13){
        console.log(name);
        let greeting = document.getElementsByClassName('greeting')[0];
        let clock = document.getElementsByClassName('clock')[0];
        let input = document.getElementsByTagName('input')[0];
        let nameTag = document.getElementById('name');
        nameTag.style.display = 'none';
        input.style.width = (name.length * 28) + 'px';
        input.style.transition = 'border-bottom 3s ease-in-out 1s';
        input.style.borderBottom = '1px solid rgba(0,0,0,0)';
        greeting.style.transition = 'opacity 4s ease-in-out 1s';
        greeting.style.opacity = '1';
        greeting.style.visibility = 'visible';
        greeting.style.position = 'relative';
        clock.style.transition = 'opacity 4s ease-in-out 1s';
        clock.style.opacity = '1';
        localStorage.name = name;
      }
    },
    namePresent: function(){
        setTimeout(function(){
          let greeting = document.getElementsByClassName('greeting')[0];
          let clock = document.getElementsByClassName('clock')[0];
          let input = document.getElementsByTagName('input')[0];
          let nameTag = document.getElementById('name');
          nameTag.style.display = 'inline-block';
          nameTag.style.fontSize = '55px';
          nameTag.style.fontWeight = 'lighter';
          input.style.display = 'none';
          greeting.style.opacity = '1';
          greeting.style.visibility = 'visible';
          greeting.style.position = 'relative';
          clock.style.opacity = '1';
        }, 1)
        
    },
    setName: function(){
      this.name = localStorage.name
    },
    dateCheck: function(){
      let now = new Date()
      let year = now.getFullYear();
      let day = now.getDate();
      console.log(localStorage.day, day);
      if(year != localStorage.year){
        this.getImage();
      }
    },
    getImage: function(){
      this.$http.get('https://api.unsplash.com/photos/random/?client_id=f0ac1eeb93ba63a48290fc82b431790f5f237f97ca1c76cf7e6206dc3b7b3385').then((res) => {
        console.log(res.body);
        this.background = res.body.urls.full;
        localStorage.img = res.body.urls.full;
        let now = new Date();
        console.log(now.getDate());
        localStorage.day = now.getDate();
        localStorage.year = now.getFullYear();
      })
    },
    getLocation: function(){
      var thisPointer = this;
      function showLocation(position){
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        thisPointer.getWeather(latitude, longitude, thisPointer)
      }
      function errorHandler(err) {
        if(err.code == 1) {
            alert("Error: Access is denied!");
        }
        else if(err.code == 2) {
            alert("Error: Position is unavailable!");
        }
      }
      function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showLocation, errorHandler);
        }
        else{
            console.log("Sorry, browser does not support geolocation!");
        }
      }
      getLocation();
    },
    getWeather: function(lat, long, newThis){
      console.log(lat, long)
      newThis.$http.get(`http://api.openweathermap.org/data/2.5/weather?lat=`+ lat +`&lon=`+ long +`&appid=25e741fab3a58394045b709c0392a364`).then((res) => {
        console.log(JSON.parse(res.bodyText));
        let weather = JSON.parse(res.bodyText);
        this.weather.city = weather.name;
        this.weather.temp = Math.floor(1.8 * (weather.main.temp - 273) + 32);
        this.weather.condition = weather.weather[0].description;
        console.log(this.weather.condition);
      })
    },
    unitChange: function(){
      if(this.weather.unit === 'f'){
        this.weather.temp = Math.floor((5/9) * (this.weather.temp - 32));
        this.weather.unit = 'c';
      } else if (this.weather.unit === 'c'){
        this.weather.temp = Math.floor((this.weather.temp * (9/5)) + 32);
        this.weather.unit = 'f';
      }
    },
    getQuotes: function(){
      // this.$http.jsonp('http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en').then((res) => {
      //   let quote = JSON.parse(res.bodyText);
      //   console.log(JSON.parse(res.bodyText));
      // })
      // Using YQL and JSONP
      $.ajax({
          url: "http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en",
          jsonp: "callback",
          dataType: "jsonp",
          success: function( response ) {
              console.log( "iuahsdiuahsd", response ); // server response
          }
      });
    }
  },
  filters: {
    uppercase: function(value){
      return value.toUpperCase();
    }
  },
  created: function(){
    this.initClock();
    console.log(localStorage);
    if(localStorage.name){
      this.namePresent();
      this.setName();
    }
    if(!localStorage.img){
      this.getImage()
    }
    this.dateCheck();
    this.getLocation();
    this.getQuotes();
  }
}
</script>

<style lang="scss">
  *{
    margin: 0;
    font-family: Helvetica, sans-serif;
  }
  section{
    background-color: black;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    overflow: hidden;
    background-size: cover;
  }
  h1{
    color: white;
    display: inline-block;
  }
  input{
    font-size: 50px;
    font-weight: lighter;
    width: 300px;
    border: none;
    border-bottom: 2px solid white;
    background: transparent;
    text-align: center;
    color: white;
    outline: none;
  }
  .content{
    position: relative;
    // border: 1px solid green;
    width: 100vw;
    text-align: center;
    
    span{
      color: white;
      font-size: 200px;
      text-shadow: 3px 3px 30px black;
    }
    a{
      opacity: 0;
    }
  }
  .clock{
    opacity: 0;
  }
  .greeting{
    visibility: hidden;
    position: absolute;
    opacity: 0;
    font-size: 50px;
    font-weight: lighter;
    z-index: 1;
  }
  .weather{
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;

    p:last-child{
      font-size: 10px;
      color: #F2F2F2;
      opacity: .5;
    }

    p:first-child{
      text-align: right;
      font-size: 25px;
      font-weight: bolder;
    }
  }
  .quote{
    color: white;
    text-align: center;
    position: absolute;
    width: 100%;
  }
</style>

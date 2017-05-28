<template>
  <section v-bind:style="{ backgroundImage: 'url(' + background.img + ')' }">
    <!--weather box top right-->
    <div class="weather" :alt="this.weather.condition">
      <p v-on:dblclick="unitChange()">{{weather.temp}}<span>{{weather.degree}}</span></p>
      <p>{{weather.city | uppercase }}</p>
    </div>
    <!--main center content, clock and greeting-->
    <div class="content">
      <span class="clock">{{hours}}:{{min}}</span><br>
      <h1 class="greeting">{{greeting}}, <span id="name">{{name}}</span></h1><input type="text" placeholder="name" v-model="name" v-on:keyup="submitName(name, $event)"/>
    </div>
    <!--focus of the day-->
    <div class="list">
      <h1>What is your main focus today?</h1><br>
      <input type="text" v-on:keyup="todayFocus(keyword, $event)" v-model="keyword"/>
    </div>
    <div class="check">
      <h2>Today</h2>
      <br>
      <input type="checkbox" id="keyword" name="subscribe" value="keyword">
      <label for="subscribeNews">{{keyword}}<div id="delete" v-on:click="removeFocus()">&#215;</div></label>
    </div>
    <!--quote on the bottom-->
    <div class="quote">
      <p id="quote">"{{quote.quote[quote.index]}}"</p>
      <p id="author">{{quote.author[quote.index]}}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      hours: '',
      min: '',
      name: '',
      spaces: '',
      greeting: 'Good Morning',
      background: {
        img: localStorage.img,
        lat: '',
        lng: '',
        name: '',
        location: '',
      },
      weather: {
        city: '',
        temp: '',
        unit: 'f',
        condition: '',
        degree: '°'
      },
      quote: {
        author: ['Oscar Wilde', 'Norman Vincent Peale'],
        quote: ['Experience is simply the name we give our mistakes.', 'There is real magic in enthusiasm. It spells the difference between mediocrity and accomplishment.'],
        index: 0
      },
      keyword: '',
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
      } else if(hours >= 12 && hours < 18 && min >= 0){
        this.greeting = 'Good Afternoon';
      } else if(hours >= 18 && hours < 24 && min >= 0){
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

        if(this.quote.index === this.quote.author.length){
          this.quote.index = 0;
        } else {
          this.quote.index++
        }
      }
    },
    getImage: function(){
      this.$http.get('https://api.unsplash.com/photos/random/?query=landscape&orientation=landscape&client_id=f0ac1eeb93ba63a48290fc82b431790f5f237f97ca1c76cf7e6206dc3b7b3385').then((res) => {
        console.log(res.body);
        this.background = res.body.urls.full;
        localStorage.img = res.body.urls.full;
        localStorage.photoBy = res.body.user.name;
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
    todayFocus: function(keyword, event){
      if(event.keyCode == 13){
        console.log(keyword);
        let focus = document.getElementsByClassName('list')[0];
        let check = document.getElementsByClassName('check')[0];
        focus.id = 'hideFocus';
        check.id = 'showCheck';
        this.keyword = keyword;
        localStorage.keyword = keyword;
      }
    },
    keywordPresent: function(){
      setTimeout(function(){
        let focus = document.getElementsByClassName('list')[0];
        let check = document.getElementsByClassName('check')[0];
        focus.style.transition = 'none';
        check.style.transition = 'none';
        focus.id = 'hideFocus';
        check.id = 'showCheck';
      }, 1);
      this.keyword = localStorage.keyword;
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
    if(localStorage.keyword){
      this.keywordPresent();
    }
    this.dateCheck();
    this.getLocation();
    
    //quote float logic
    setTimeout(function(){
      //logic to add event listeners to quote
      let container = document.getElementsByClassName('quote')[0];
      let quote = document.getElementById('quote');
      let author = document.getElementById('author');
      console.log(quote, author);
      container.onmouseenter = function(){
        quote.className = 'liftQuote';
        author.className = 'showAuthor';
      }
      container.onmouseleave = function(){
        quote.className = '';
        author.className = '';
      }
      //logic to add event listener to show and hide checkbox and delete
      let checkContainer = document.getElementsByClassName('check')[0];
      let checkbox = document.getElementById('keyword');
      let remove = document.getElementById('delete');
      checkbox.style.transition = 'all 0.1s ease-in-out';
      remove.style.transition = 'all 0.1s ease-in-out';
      checkContainer.onmouseenter = function(){
        checkbox.style.opacity = '1';
        remove.style.opacity = '0.6';
      }
      checkContainer.onmouseleave = function(){
        checkbox.style.opacity = '0';
        remove.style.opacity = '0';
      }
    }, 100)
    
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
    background-position: center;
  }
  h1{
    color: white;
    display: inline-block;
    // text-shadow: 5px 5px 20px black;
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
      font-size: 190px;
      // text-shadow: 3px 3px 30px black;
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
    user-select: none;
    cursor: default;

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
    bottom: 10px;
    width: 100%;
    font-weight: lighter;
    p{
      transition: all 0.2s;
    }

    p:last-child{
      font-size: 12px;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.5s ease-in-out;
    }
  }
  .list{
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 150px;
    transition: all 1s ease-in-out;

    h1{
      font-size: 30px;
      font-weight: lighter;
    }
    input{
      display: inline-block;
      width: 350px;
      font-size: 30px;
    }
  }
  .check{
    opacity: 0;
    position: absolute;
    color: white;
    font-size: 30px;
    width: 100%;
    transition: all 1s ease-in-out 1s;
    // border: 1px solid green;

    input{
      width: auto;
      margin-right: 20px;
    }
    #delete{
      margin-left: 20px;
      font-size: 17px;
      display: inline-block;
      height: 25px;
      width: 25px;

      &:hover{
        border: 1px solid white;
        border-radius: 50px;
        opacity: 1 !important;
        font-size: 18px;
      }
    }
  }
  //showing and hiding
  .showAuthor{
    opacity: 1 !important;
    transform: translateY(-8px) !important;
  }
  .liftQuote{
    transform: translateY(-10px);
  }
  #hideFocus{
    opacity: 0;
    position: absolute;
  }
  #showCheck{
    opacity: 1;
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 150px;
  }
</style>

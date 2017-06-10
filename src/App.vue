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
    <!--photo by credits-->
    <div class="photo-author">
      <p v-show="show">photo by {{photoBy}}</p>
    </div>
    <!--todo list-->
    <Todo :user="this.name"></Todo>
    <!--search-->
    <div class="search" v-on:click="showSearch()">
      <img src="https://d30y9cdsu7xlg0.cloudfront.net/png/21336-200.png"/>
      <input type="text" v-on:keyup="search(searchTerm, $event)" v-model="searchTerm"/>
    </div>
  </section>
</template>

<script>
import Todo from './Todo.vue';

export default {
  name: 'app',
  components: {
      Todo,
  },
  data () {
    return {
      show: false,
      hours: '',
      min: '',
      name: '',
      spaces: '',
      greeting: 'Good Morning',
      searchTerm: '',
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
        author: ['Oscar Wilde', 'Norman Vincent Peale', 'Maya Angelou', 'Eleanor Roosevelt'],
        quote: ['Experience is simply the name we give our mistakes.', 'There is real magic in enthusiasm. It spells the difference between mediocrity and accomplishment.', 'You may not control all the events that happen to you, but you can decide not to be reduced by them.', 'Do the thing you think you cannot do.'],
        index: 0
      },
      keyword: '',
      photoBy: localStorage.photoBy,
    }
  },
  methods: {
    //clock logic
    updateClock: function() {
      let now = new Date()
      let hours = now.getHours();
      let min = now.getMinutes();
      let date = now.getDate();
      let year = now.getFullYear();
      // console.log(hours);
      localStorage.date = date;
      localStorage.year = year;

      hours <= 12 && hours >= 0 ? this.hours = hours : this.hours = hours - 12
      min < 10 ? this.min = '0' + min : this.min = min;
      //greeting logic throughout the day
      if(hours > 0 && hours < 12){
        this.greeting = 'Good Morning';
      } else if(hours >= 12 && hours < 18 && min >= 0){
        this.greeting = 'Good Afternoon';
      } else if(hours >= 18 && hours < 24 && min >= 0){
        this.greeting = 'Good Evening';
      }
    },
    initClock: function(){ //starts the clock
      this.updateClock();
      window.setInterval(this.updateClock, 1000);
    },
    //form logic
    submitName: function(name, event){ //submiting the name and officially showing the clock and focus entry
      if(event.keyCode == 13){
        let greeting = document.getElementsByClassName('greeting')[0];
        let clock = document.getElementsByClassName('clock')[0];
        let input = document.getElementsByTagName('input')[0];
        let nameTag = document.getElementById('name');
        let list = document.getElementsByClassName('list')[0];
        nameTag.style.display = 'none';
        input.style.width = (name.length * 28) + 'px';
        input.style.transition = 'border-bottom 3s ease-in-out 1s';
        input.style.borderBottom = '1px solid rgba(0,0,0,0)';
        greeting.style.transition = 'opacity 4s ease-in-out 1s';
        greeting.style.opacity = '1';
        greeting.style.visibility = 'visible';
        greeting.style.position = 'relative';
        list.style.transition = 'opacity 4s ease-in-out 1s';
        list.style.opacity = '1';
        clock.style.transition = 'opacity 4s ease-in-out 1s';
        clock.style.opacity = '1';
        localStorage.name = name;
      }
    },
    namePresent: function(){ //checking to see if there was name present in local storage to restore previous user
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
    setName: function(){ //storing the users name in local storage
      this.name = localStorage.name
    },
    dateCheck: function(){ //reseting of certain information when date changes for quote, image and focus of the day
      let now = new Date()
      let year = now.getFullYear();
      let date = now.getDate();
      console.log(localStorage.date, date);
      if(year != localStorage.year || date != localStorage.date){
        this.getImage();
        this.quote.index === this.quote.author.length ? this.quote.index = 0 : this.quote.index++;
        this.removeFocus(); //resets focus if it is a new day
      }
    },
    getImage: function(){ //getting image api and setting the date to compare later on weather to update image
      this.$http.get('https://api.unsplash.com/photos/random/?query=landscape&featured&orientation=landscape&client_id=f0ac1eeb93ba63a48290fc82b431790f5f237f97ca1c76cf7e6206dc3b7b3385').then((res) => {
        // console.log(res.body);
        localStorage.img = res.body.urls.full;
        localStorage.photoBy = res.body.user.name;
        let now = new Date();
        localStorage.date = now.getDate();
        localStorage.year = now.getFullYear();
        this.background.img = localStorage.img;
        this.photoBy = localStorage.photoBy;
        this.show = true;
      })
    },
    getLocation: function(){
      var thisPointer = this; //having problem with block scope in accessing vue instance this creates the instance in the function
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
        navigator.geolocation ? navigator.geolocation.getCurrentPosition(showLocation, errorHandler) : console.log("Sorry, browser does not support geolocation!");
      }
      getLocation();
    },
    getWeather: function(lat, long, newThis){ //getting weather based on geolocation
      // console.log(lat, long)
      newThis.$http.get(`http://api.openweathermap.org/data/2.5/weather?lat=`+ lat +`&lon=`+ long +`&appid=25e741fab3a58394045b709c0392a364`).then((res) => {
        // console.log(JSON.parse(res.bodyText));
        let weather = JSON.parse(res.bodyText);
        this.weather.city = weather.name;
        this.weather.temp = Math.floor(1.8 * (weather.main.temp - 273) + 32);
        this.weather.condition = weather.weather[0].description;
        // console.log(this.weather.condition);
      })
    },
    unitChange: function(){ //changes unit when double click on temp
      if(this.weather.unit === 'f'){
        this.weather.temp = Math.floor((5/9) * (this.weather.temp - 32));
        this.weather.unit = 'c';
      } else if (this.weather.unit === 'c'){
        this.weather.temp = Math.floor((this.weather.temp * (9/5)) + 32);
        this.weather.unit = 'f';
      }
    },
    todayFocus: function(keyword, event){ //submiting the focus of the day and stores in local storage
      if(event.keyCode == 13){
        // console.log(keyword);
        let focus = document.getElementsByClassName('list')[0];
        let check = document.getElementsByClassName('check')[0];
        check.style.transition = 'all 1s ease-in-out 1s';
        focus.style.transition = 'all 1s ease-in-out';
        focus.style.opacity = '0';
        focus.id = 'hideFocus';
        check.id = 'showCheck';
        this.keyword = keyword;
        localStorage.keyword = keyword;
      }
    },
    removeFocus: function(){
      let check = document.getElementsByClassName('check')[0];
      let focus = document.getElementsByClassName('list')[0];
      check.style.transition = 'none';
      focus.style.transition = 'all 1s ease-in-out';
      focus.style.opacity = '1';
      focus.id = '';
      check.id = '';
      this.keyword = '';
      delete localStorage.keyword;
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
    },
    noKeyword: function(){ //if keyword not present then remove focus
      setTimeout(function(){
        let focus = document.getElementsByClassName('list')[0];
        focus.style.opacity = '1';
        focus.id = '';
      }, 1);
    },
    showSearch: function(){
      let search = document.getElementsByClassName('search')[0];
      search.style.transition = 'all 1s';
      search.id = 'showSearch';
      let section = document.getElementsByTagName('section')[0];

      var a = function() {
        search.style.transition = 'none';
        search.id = '';
        setTimeout(function(){
          section.removeEventListener('click', a);
        }, 100)
      }

      setTimeout(function(){
        section.addEventListener('click', a)
      }, 100);
    },
    search: function(term, e){
      if(e.keyCode == 13){
        window.location.href = 'https://www.google.com/search?q=' + term;
      }
    }
  },
  filters: {
    uppercase: function(value){
      return value.toUpperCase();
    }
  },
  created: function(){
    this.dateCheck(); //check date first or else init clock will overwrite old time in local storage
    this.initClock();
    if(localStorage.name){
      this.namePresent();
      this.setName();
    }
    if(!localStorage.img){
      this.getImage()
    }
    localStorage.keyword ? this.keywordPresent() : this.noKeyword();
    localStorage.photoBy ? this.show = true : this.show = false;
    
    this.getLocation();
    //quote float logic
    setTimeout(function(){
      //logic to add event listeners to quote
      let container = document.getElementsByClassName('quote')[0];
      let quote = document.getElementById('quote');
      let author = document.getElementById('author');
      // console.log(quote, author);
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
  //styling of the greeting
  .greeting{
    visibility: hidden;
    position: absolute;
    opacity: 0;
    font-size: 50px;
    font-weight: lighter;
    z-index: 1;
  }
  //styling for weather
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
  //styling for quote
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
  //styling for focus of the day
  .list{
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 150px;
    transition: all 1s ease-in-out;
    opacity: 0;

    h1{
      font-size: 30px;
      font-weight: lighter;
      user-select: none;
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
    #keyword{
      opacity: 0;
    }
    #delete{
      margin-left: 20px;
      font-size: 17px;
      display: inline-block;
      height: 25px;
      width: 25px;
      cursor: pointer;
      box-sizing: border-box;
      opacity: 0;
      transition: all 1s ease-in-out 0.4s;

      &:hover{
        border: 1px solid white;
        border-radius: 50px;
        opacity: 1 !important;
        transform: scale(1.1);
      }
    }
  }
  .photo-author{
    position: absolute;
    bottom: 20px;
    left: 50px;
    color: white;
    font-weight: lighter;
    font-size: 10px;
    z-index: 5;
  }
  .search{
    position: absolute;
    top: 10px;
    left: 100px;
    width: 180px;
    height: 30px;
    padding: 5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 2;
    border-bottom: 2px solid rgba(255,255,255,0);

    img{
      height: 22px;
      width: 22px;
      filter: invert(100%);
      opacity: 0.7;
    }
    input{
      border: none;
      height: 20px;
      width: 150px;
      text-align: left;
      font-size: 20px;
      margin-left: 10px;
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
  #showSearch{
    border-bottom: 2px solid rgba(255,255,255,1);
  }
</style>

<template>
  <section>
    <div class="content">
      <span class="clock">{{hours}}:{{min}}</span><br>
      <h1 class="greeting">{{greeting}}, </h1><input type="text" placeholder="name" v-model="name" v-on:keyup="submitName(name, $event)"/>
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
      greeting: 'Good Morning'
    }
  },
  methods: {
    //clock logic
    updateClock: function() {
      let now = new Date()
      let hours = now.getHours();
      let min = now.getMinutes();
      this.hours = hours - 12;
      if(min < 10){
        this.min = '0' + min;
      } else {
        this.min = min;
      }
      //greeting logic throughout the day
      if(hours > 0 && hours < 12){
        this.greeting = 'Good Morning';
      } else if(hours > 12 && hours < 18){
        this.greeting = 'Good Afternoon';
      } else if(hours > 18 && hours < 24){
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
        let greeting = document.getElementsByClassName('greeting')[0];
        let clock = document.getElementsByClassName('clock')[0];
        let input = document.getElementsByTagName('input')[0];
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
          input.style.width = (name.length * 28) + 'px';
          input.style.borderBottom = '1px solid rgba(0,0,0,0)';
          greeting.style.opacity = '1';
          greeting.style.visibility = 'visible';
          greeting.style.position = 'relative';
          clock.style.opacity = '1';
        }, 1)
        this.name = localStorage.name;
    }
  },
  created: function(){
    this.initClock();
    console.log(localStorage);
    if(localStorage.name){
      this.namePresent();
    }
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
  }
  h1{
    color: white;
    display: inline-block;

    span{
      display: none;
    }
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
      font-size: 150px;
      font-weight: bolder;
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
</style>

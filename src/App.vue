<template>
  <section>
    <div class="content">
      <span class="clock">{{hours}}:{{min}}</span><br>
      <h1 class="greeting">Good Morning, {{name}}</h1><input type="text" placeholder="YOUR NAME" v-model="name" v-on:keyup="submitName(name, $event)"/>
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
        greeting.style.opacity = '1';
        greeting.style.visibility = 'visible';
        clock.style.opacity = '1';
        clock.style.visibility = 'visible';
        
        input.style.display = 'none';
        localStorage.name = name;
        this.name = localStorage.name;
      }
    }
  },
  created: function(){
    this.initClock();
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
    justify-content: center;
    align-items: center;
  }
  h1{
    color: white;
  }
  input{
    font-size: 50px;
    width: 300px;
    border: none;
    border-bottom: 2px solid white;
    background: transparent;
    text-align: center;
    color: white;
    outline: none;
  }
  .content > span{
    color: white;
    font-size: 150px;
    font-weight: bolder;
  }
  .clock{
    visibility: hidden;
    opacity: 0;
    transition: opacity 4s;
  }
  .greeting{
    visibility: hidden;
    opacity: 0;
    transition: opacity 4s;
    font-size: 50px;
    font-weight: lighter;
  }
</style>

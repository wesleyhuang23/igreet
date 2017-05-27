<template>
  <section>
    <div class="content">
      <span class="clock">{{hours}}:{{min}}</span><br>
      <h1 class="greeting">Good Morning, </h1><input type="text" placeholder="YOUR NAME" v-model="name" v-on:keyup="submitName(name, $event)"/>
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
        for(let i = 0; i < name.length; i++){
          this.spaces += 'o';
        }
        console.log(this.spaces);
        console.log(document.getElementsByClassName('greeting'))
        let greeting = document.getElementsByClassName('greeting')[0];
        let clock = document.getElementsByClassName('clock')[0];
        let input = document.getElementsByTagName('input')[0];
        input.style.transition = 'all 3s';
        input.style.borderBottom = 'none';
        input.style.zIndex = '2';
        input.style.width = (name.length * 28) + 'px';
        
        greeting.style.opacity = '1';
        greeting.style.visibility = 'visible';
        greeting.style.position = 'relative';

        clock.style.opacity = '1';
        localStorage.name = name;
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
    transition: opacity 4s ease-in-out 2s;
  }
  .greeting{
    visibility: hidden;
    position: absolute;
    opacity: 0;
    transition: opacity 4s ease-in-out 2s;
    font-size: 50px;
    font-weight: lighter;
    z-index: 1;
  }
</style>

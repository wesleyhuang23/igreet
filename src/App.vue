<template>
  <section>
    <div>
      <span>{{hours}}:{{min}}</span><br>
      <input type="text" placeholder="YOUR NAME"/>
      <h1>Good Morning, </h1>
    </div>
  </section>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      hours: '',
      min: '',
    }
  },
  methods: {
    updateClock: function() {
      let now = new Date()
      let hours = now.getHours();
      let min = now.getMinutes();
      this.hours = hours
      this.min = min
    },
    initClock: function(){
      this.updateClock();
      window.setInterval(this.updateClock, 1000);
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
  span{
    color: white;
    font-size: 150px;
    font-weight: bolder;
  }
</style>

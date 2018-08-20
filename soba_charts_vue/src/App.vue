<template>
  <div id="app">
    <h1>
      ChartJS + GraphQL
    </h1>
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <SobaVisualization></SobaVisualization>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import SobaVisualization from './components/SobaVisualization.vue'

export default {
  name: 'app',
  components: {
    // HelloWorld,
    SobaVisualization
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

table{
    width: 100%;
  }

  td {
     border: 1px solid black;
  }

  table table table{
    /*width: 60%;*/
  }

  table table strong{
    display: block;
    text-align: center;
  }
  table table table td{
    text-align: right;

    padding-right: 10px;
    width: 100%;
  }

  table table table td:first-child{
    padding-left: 50px;
    text-align: right;

  }

  .inputs > div{
    margin-bottom: 20px;
  }
  .inputs input{
    width: 50%;
  }

  .inputs label{
    width: 100px;
    display: inline-block;
  }

</style>

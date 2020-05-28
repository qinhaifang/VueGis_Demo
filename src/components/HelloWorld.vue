<template>
  <div>
    <ces></ces>
  </div>
</template>

<script type="text/ecmascript-6">
  import ces from './CesiumExample/No01-init.vue'
  import {login} from '../api/loginApi'
export default {
  name: 'HelloWorld',
  components:{
    ces
  },
  props: {
    msg: String
  },
  created(){
    this.login()
  },
  mounted(){
    this.$initCesium.tabcesium(["fengLiu"]);
    this.$initCesium.tabcesium(["chuanGanQi"]);
  },
  methods:{
    login(){
      login('admin','123456').then(response =>{
        console.log(111,response)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

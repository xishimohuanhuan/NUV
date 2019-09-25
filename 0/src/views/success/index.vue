<template>
<div id="success">
  <!-- <iframe :src="$phpUrl + '/wap/user/index?normal=1&cgpid=5'"></iframe> -->
  <div   :class="{'handle-loading':isloading}">
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isloading:true,
      src:''
    }
  },
  mounted() {
     this.$store.commit('changeLoading', true);
    setTimeout(function () {
      this.$store.commit('changeLoading', false);
      this.$store.commit('testMethods', new Date().getTime());
      this.isloading=false
      let query = location.search;
      if (query) {
        window.location.href = this.$simulateUrl + query + '&login=1';
      } else {
        window.location.href = this.$simulateUrl + '?demo_cg=&login=1';
      }
      
   }.bind(this),100)
  }
}
</script>
<style scoped>
 #success, #success iframe{
    height: 100%;
    width: 100%;
   overflow: hidden;
  }
</style>

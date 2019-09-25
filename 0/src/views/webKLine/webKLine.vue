<template>
  <iframe :src="iframeSrc" frameborder="0"></iframe>
</template>

<script>
export default {
  data() {
    return {
      iframeSrc: ''
    }
  },
  mounted() {
    if (!this.$router.currentRoute.query.key) {
      this.$router.push({ name: 'home' });
      return;
    }
    this.iframeSrc = this.$phpUrl + '/contract/kline/' + this.$router.currentRoute.query.key;
  }
}
</script>

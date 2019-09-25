<template>
  <div class="home-container">
    <header class="home-header ui-flex">
      <div class="mint-header-button flex__item">
      </div> 
      <div class="mint-header-title flex__item">
        <img src="/static/img/home/logo.png" alt="">
      </div>
      <div class="mint-header-button flex__item">
        <select name="lang" id="lang">
          <option value="zh-cn">中文</option>
          <option value="zh-tw">繁体</option>
          <option value="en-us">英文</option>
        </select>
      </div>
      
    </header>
    <Swipe :show-indicators="false" class="top-swipe">
      <SwipeItem>
        <img src="http://p29xzljyg.iobox.me/Fj0JlUpjFG3nRgGd-02fZrjnIVdH" alt="">
      </SwipeItem>
      <SwipeItem>
        <img src="/static/logo.png" alt="">
      </SwipeItem>
      <SwipeItem>
        <img src="http://p29xzljyg.iobox.me/Fj0JlUpjFG3nRgGd-02fZrjnIVdH" alt="">
      </SwipeItem>
    </Swipe>

    <div>{{ $t("language") }}</div>
    <Button @click="buttonTest" type="default">default</Button>
  </div>
</template>

<script>
export default require("./home");
</script>
<style lang="scss">
@import "./home.scss";
</style>
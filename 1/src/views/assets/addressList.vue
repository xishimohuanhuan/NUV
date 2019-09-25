<template>
  <div class="address">
    <headers title="" value="" @back="handleBack"></headers>
    <div class="address-header">
      <span v-text="name + $t('assets.address.title')"></span>
    </div>
    <div v-show="!loading" ref="addressList" class="address-list">
      <ul>
        <li data-main="main" :ref="item.address" class="address-item" v-for="(item, index) in addressList" :key="index">
          <div :data-name="item.address" class="address-item-info">
            <p :data-name="item.address">
              <span :data-name="item.address" v-text="name"></span>
              <span :data-name="item.address" v-text="item.title"></span>
            </p>
            <p :data-name="item.address" v-text="$t('assets.address.title')"></p>
            <p :data-name="item.address" v-text="item.address"></p>
          </div>
          <div :data-name="item.id" class="address-item-operate" data-item="UNBIND" v-text="$t('assets.address.unbind')"></div>
        </li>
      </ul>
    </div>
    <!-- <p class="no-other-data" v-show="addressList.length">{{$t('assets.address.noOtherData')}}</p> -->
    <div v-show="!addressList.length && !loading" class="no-address">
      <img src="../../assets/img/assets/noData.png" alt/>
      <p v-text="$t('assets.address.noData')"></p>
    </div>
    <div @click="handleAdd" class="address-footer" v-text="$t('assets.address.add')"></div>
    <div class="address-unbind-shade" v-show="showUnbind">
      <div class="address-unbind">
        <div class="address-unbind-h">
          <span v-text="$t('assets.address.enterUnbind')"></span>
          <img @click="showUnbind=false" src="../../assets/img/assets/close.png" alt/>
        </div>
        <div class="address-unbind-item">
          <span v-text="$t('assets.safeVeirfy.password')"></span>
          <input type="password" :placeholder="$t('assets.safeVeirfy.passwordPoptip')" v-model="password"/>
        </div>
        <div 
          @click="unbind" 
          :class="['address-unbind-enter', {'active-address-unbind-enter': password.trim()}]" 
          v-text="$t('assets.safeVeirfy.enter')"></div>
      </div>
    </div>
  </div>
</template>

<script>
import headers from '../../component/header';
export default {
  components: {
    headers
  },
  data() {
    return {
      name: '',
      showUnbind: false,
      addressList: [],
      password: '',
      selectId: '',
      loading: false
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      let key = vm.$route.params.key;
      if (key && (vm.$getCookie('userId') && JSON.parse(decodeURIComponent(vm.$getCookie('userId'))).userId)) {
        vm.name = key;
        vm.getAddressList();
        vm.handletouch(vm.$refs['addressList'], vm.handleMove, vm.handleClick, vm.handleUnbind);
        vm.$store.commit('changeNoMenu', false);
      } else
        vm.$loginRoute('./home');
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    next();
  },
  methods: {
    handleBack() {
      let that = this;
      that.$loginRoute('/assets/withdrawMoney/'+that.name);
    },
    handletouch(ele, handleMove, handleClick, handleUnbind) {
      let startPoint = {x: 0, y: 0},
        endPoint = {x: 0, y: 0},
        movingDirection = 0,
        isMove = true,
        isWork = false;
      ele.addEventListener('touchstart', function(e) {
        if (!isWork) {
          isWork = true;
          startPoint = {x:e.changedTouches[0].screenX, y: e.changedTouches[0].screenY};
          if (e.target.dataset.name && e.target.dataset.item !== 'UNBIND') {
            var eleList = ele.querySelectorAll('[data-main=main]');
            for (let item of eleList) {
              let _style = item.getAttribute('style');
              if (_style) {
                isMove = false;
                item.setAttribute('style', 'transition: transform .3s;transform: translateX(0)');
                setTimeout(function() {
                  item.setAttribute('style', '');
                }, 300);
              }
            }
          }
          isWork = false;
        }
      })

      ele.addEventListener('touchmove', function(e) {
      })

      ele.addEventListener('touchend', function(e) {
        if (!isWork) {
          isWork = true;
          endPoint = {x:e.changedTouches[0].screenX, y: e.changedTouches[0].screenY};
          movingDirection = endPoint.x > startPoint.x ? 1 : (endPoint.x < startPoint.x ? -1 : 0);// 1:收起抽屉，0：保持不变，-1：弹出抽屉
          if (isMove) {
            if (movingDirection) {
              handleMove(e.target.dataset.name, movingDirection);
            } else {
              e.preventDefault();
              e.target.dataset.item !== 'UNBIND' && handleClick(e.target.dataset.name);
              e.target.dataset.item === 'UNBIND' && handleUnbind(e.target.dataset.name);
            }
          }
          isMove = true;
          isWork = false;
        }
      })
    },
    handleMove(ele, direction) {
      let that = this,
        // move = (direction === -1 ? -22 : 0),
        move = (direction === -1 ? -18 : 0),
        _style = `transition: transform .3s;transform: translateX(${move}%)`;
      ele && that.$refs[ele][0].setAttribute('style', _style);
    },
    handleClick(key) {
      let that = this;
      that.$router.replace({path: `/assets/withdrawMoney/${that.name}`, query: {address: key}})
    },
    handleUnbind(key) {
      let that = this;
      that.showUnbind = true;
      that.selectId = key;
    },
    unbind() {
      let that = this;
      if (that.password.trim()) {
        let formData = new FormData();
        formData.append('id', that.selectId);
        formData.append('pwd', that.password);
        formData.append('userId', (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId));
        formData.append('token', (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token));
        that.$axios({
          baseURL: that.$interfacePhpUrl,
          url: '/finance/del_wallet',
          method: 'post',
          data: formData,
          withCredentials: false
        }).then(function(data) {
          if(data.status == 200) {
            that.showUnbind = false;
            if (data.data.code == 1) {
              that.$normalToast(that.$t('assets.address.unbindSuccess'), 1000);
              that.getAddressList();
            } else {
              that.$normalToast(that.$t('assets.address.passwordError'), 1000);
            }
            var eleList = that.$refs['addressList'].querySelectorAll('[data-main=main]');
            for (let item of eleList) {
              let _style = item.getAttribute('style');
              if (_style) {
                item.setAttribute('style', 'transition: transform .3s;transform: translateX(0)');
                setTimeout(function() {
                  item.setAttribute('style', '');
                }, 300);
              }
            }
          }
          that.password = '';
        })
      }
    },
    getAddressList() {
      let that = this;
      that.loading = true;
      that.$axios({
        baseURL: that.$interfacePhpUrl,
        url: '/finance/address',
        method: 'get',
        params: {
          coin: that.name.toLowerCase(),
          userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
          token:(that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).token)
        },
        withCredentials: false
      }).then(function(data) {
        if(data.status == 200) {
          that.addressList = data.data.map(item => {
            return {
              id: item.id,
              title: item.name,
              address: item.addr
            }
          });
          that.loading = false;
        }
      })
    },
    handleAdd() {
      let that = this;
      that.$loginRoute(`/assets/addAddress/${that.name}`);
    }
  }
}
</script>

<style lang="scss" scoped>
.address {
  .address-header {
    padding: 50px 22px 40px;
    text-align: left;
    color: #202025;
    font-size: 45px;
    line-height: 45px;
    font-weight: bold;
    background-color: #fff;
    border-bottom: solid 1px #dcdcdc;
  }
  .address-list {
    .address-item {
      display: flex;
      width: 122%;
      height: 213px;
      border-bottom: solid 2px #dcdcdc;
      .address-item-info {
        padding: 35px 0 22px 23px;
        width: 750px;
        background-color: #fff;
        text-align: left;
        & > p:first-child {
          font-size: 34px;
          height: 34px;
          line-height: 34px;
          font-weight: bold;
          & > span {
            color: #323232;
          }
          & > span:first-child {
            color: #3e80ca;
          }
        }
        & > p:nth-child(2) {
          margin-top: 42px;
          height: 22px;
          line-height: 22px;
          font-size: 22px;
          color: #cacaca;
        }
        & > p:last-child {
          margin-top: 28px;
          height: 28px;
          line-height: 28px;
          font-size: 28px;
          color: #8d8d8d;
        }
      }
      .address-item-operate {
        flex-grow: 1;
        height: 213px;
        line-height: 213px;
        background-color: #f8f8f8;
        font-size: 28px;
        color: #4d4d4d;
      }
    }
  }
  .no-address {
    padding-top: 135px;
    & > img {
      width: 135px;
	    height: 129px;
    }
    & > p {
      margin-top: 25px;
      font-size: 24px;
      color: #575757;
    }
  }
  .address-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 34px;
    color: #fff;
    background-color: #3e80ca;
  }
  .address-unbind-shade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(67, 67, 67, 0.6);
    z-index: 1200;
    .address-unbind {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0 15px;
      width: 100%;
      height: 450px;
      background-color: #fff;
      .address-unbind-h {
        display: flex;
        padding: 79px 25px 32px;
        border-bottom: solid 1px #dcdcdc;
        & > span {
          flex-grow: 1;
          height: 50px;
          line-height: 50px;
          color: #262626;
          font-size: 50px;
          vertical-align: middle;
          text-align: left;
        }
        & > img {
          width: 31px;
          height: 31px;
          vertical-align: middle;
        }
      }
      .address-unbind-item {
        height: 120px;
        line-height: 120px;
        border-bottom: solid 1px #dcdcdc;
        text-align: left;
        & > span:nth-child(1) {
          display: inline-block;
          margin-left: 30px;
          width: 170px;
          font-size: 28px;
          color: #575757;
        }
        & > span:nth-child(3) {
          display: inline-block;
          width: 60px;
          font-size: 24px;
          color: #3e80ca;
        }
        & > input {
          width: 440px;
          font-size: 24px;
          color: #aaa;
          border: none;
        }
        & > input:focus {
          outline: none;
        }
      }
      .address-unbind-enter {
        margin: 50px 70px 0;
        width: 580px;
        height: 90px;
        line-height: 90px;
        background-color: #bfbfbf;
        border-radius: 10px;
        font-size: 34px;
        color: #fff;
      }
      .active-address-unbind-enter {
        background-color: #3e80ca;
      }
    }
  }
}
</style>


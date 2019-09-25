<template>
  <div class="fixedPosition" @click="testClick">
    <UserDrawer v-model="popup"></UserDrawer>
    <div :class="['home-container', {'handle-loading': isLoading}]">
      <div class="top-header bgf ">
        <header class="flex-row">
          <div class="box1" style="display: none;"></div>
          <div class="user-drawer">
            <img @click="alterDrawerHandle" src="../../assets/img/home/menu.png" alt="">
          </div>
          <div class="box1 box-center">
            <img src="../../assets/img/home/logo.png" alt>
          </div>
          <div @click="$router.push({path: '/invitaUser/invitadownload'})" v-show="!$clientEnv.isNativeiOS && !$clientEnv.isNativeAndroid" class="app-download" v-text="$t('menu.appDownload')"></div>
          <!-- <div style="display: none !important;" class="box1 flex-row flex-middle position-r flex-right">
            <p :class="{active: isActive}" @click="isActive=!isActive">Language</p>
            <ul v-show="isActive">
              <li class="border-b" @click="changeLanguage('zh-cn')">简体中文</li>
              <li class="border-b" @click="changeLanguage('zh-tw')">繁体中文</li>
              <li @click="changeLanguage('en-us')">English</li>
            </ul>
          </div> -->
        </header>
      </div>

      <!-- swiper start -->
      <section class="bgf top-swiper banner">
        <Swipe :show-indicators="false">
          <SwipeItem v-show="bannerList.length" v-for="(item,n) in bannerList" :key="n" @click.native="viewBanner(item.url)">
            <img :src="item.img" alt=""/>
          </SwipeItem>
        </Swipe>
        <div class="ad bgf border-top">
          <div class="notice1 ellipsis">
            <img src="../../assets/img/home/notice.png" alt=""/>
            <div class="notice-container" v-show="noticeList.length" @click="viewNotice($event)">
              <ul>
                <li 
                  ref="scroll-item" 
                  v-for="(item, index) in noticeList" 
                  :key="index" 
                  v-text="item.detail" 
                  :data-id="item.id" 
                  :data-type="item.type" 
                  :class="{anim: animate}"
                ></li>
              </ul>
            </div>
            <span class="no-content" v-show="!noticeList.length">{{$t('notice.default')}}</span>
            <span v-show="noticeList.length" class="more-notice" @click="viewNotice">{{$t('newZh.moreNotice')}}</span>
          </div>
        </div>
      </section>

      <!-- 合约现货 start -->
      <section class="item item-goods" v-if="false">
        <div class="sub-tit">{{$t('tit.goods')}}</div>
        <Swipe :continuous="false" :auto="0" class="swiper">
          <SwipeItem class="flex-parent" v-for="(item,n) in spotContractList" :key="n">
            <div
              class="box1 text-center"
              v-for="(it,j) in item"
              :key="j"
              @click="viewMarketDetail(it.title, it.name, it.isContract, 'contract')"
            >
              <p>{{it.title}}</p>
              <p class="num" :style="{color: it.change<0?'#d87675':'#85bf85'}">{{it.new_price}}</p>
              <p class="sign" :style="{color: it.change<0?'#d87675':'#85bf85'}">{{it.change | priceChange}}</p>
            </div>
          </SwipeItem>
        </Swipe>
      </section>

      <!-- 模拟交易 start-->
      <section v-if='false'>
        <a href="#" @click="viewSimulatedTransaction">
          <div class="advertising">
            <img src="../../assets/img/home/red_packet.png" alt>
            <div class="advertising-content">
              <p v-text="$t('redPacket.message')"></p>
              <p v-text="$t('redPacket.poptip')"></p>
            </div>
            <div class="advertising-operate">
              <span v-text="$t('redPacket.operate')"></span>
            </div>
          </div>
        </a>
      </section>

      <!-- 币币行情 start -->
      <section class="item item-money" v-if="false">
        <div class="sub-tit">{{$t('tit.main')}}</div>
        <div class="swiper-container swiper-money">
          <swiper :options="marketSwiperOption" class="swiper-wrapper">
            <swiper-slide
              class="swiper-slide all-currency-data"
              v-for="(item,n) in currencyMarketList"
              :key="n">
              <div
                class="flex-row current-currency border-bom"
                v-for="(it,j) in item"
                :key="j"
                @click="viewMarketDetail(it.title, it.name, it.isContract, 'trade')">
                <div class="flex-row padding-r10">
                  <div class="add-type flex-col padding-l5 box-space">
                    <p>{{it.title | tit(0)}}
                      <span>/ {{it.title | tit(1)}}</span>
                    </p>
                    <span>{{$t('marketData.volumn')+' '+it.volume.toFixed(2)}}</span>
                  </div>
                </div>
                <div class="box1 flex-row">
                  <div class="add-money box1 flex-col flex-right box-space">
                    <p :style="{color: it.change<0?'#d87675':'#85bf85'}">{{ $dataConversion.toNonExponential(it.new_price) }}</p>
                    <span :style="{color: it.change<0?'#d87675':'#85bf85'}">￥ {{ new Number(it.jia) }}</span>
                  </div>
                  <div class="box-center padding-l20">
                    <div
                      class="btn box-center"
                      :style="{backgroundColor: it.change<0?'#d87675':'#85bf85'}"
                    >{{ it.change | priceChange }}</div>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </section>

      <!-- 永续合约 -->
      <div class="subContra">
        <div class="subCo-left">
          <p class="subCo-Title">
            {{$t("newZh.sustCont")}}
            <span>{{$t('newZh.lowRate')}}</span>
          </p>
          <div class="subCo-swi">
            <ul ref="ulTop">
              <li 
                v-for="(item,inte) in prioData"
                :key='inte'
                :class="[dataNUMath===inte && 'maddle',inte>dataNUMath && 'upAdd']"
                >
                <span>{{item.phone}}</span>
                <span>{{$t("newZh.profitGain")}}</span>
                <span>{{item.price}}</span>
                <img src="../../assets/img/home/tTu.png" alt="" srcset="">
              </li>
            </ul>
          </div>
          <!-- 注册及赚钱 -->
          <div class="registerGo border-one">
            <div class="leftt" @click="gotoRegister">
              <span>{{$t("newZh.reGisterMa")}}</span>
              <span>{{$t('newZh.earmFrom')}}USDT</span>
            </div>
          </div>
          <!-- 加入社群 -->
          <div class="bottom-add border-one" @click="gotoAddSei">
            <img src="../../assets/img/home/a1.png" alt=""/>
            <span>{{$t('newZh.joinComm')}}</span>
          </div>
          <!--  -->
          <div class="bottom-add border-one" @click="gotoNewMen">
            <img class="imgTwo" src="../../assets/img/home/a2.png" alt=""/>
            <span>{{$t("newZh.newHelp")}}</span>
          </div>
        </div>
        <div class="subCo-right">
          <p class="lookAll" @click="gotoAllData('cantrat')">{{$t('newZh.lookAll')}}</p>
          <div
            :class="['rigiht-sub', 'border-one', `rigiht-sub${inde===0 ?
                numDataImg : 
                (inde===1 ? numDataImg1 : numDataImg)}`]" 
            v-for="(ite,inde) in dataTwoSub"
            :key="inde"
            @click="viewMarketDetail(ite.title, ite.name, ite.isContract, 'contract')"
          >
            <img src="../../assets/img/home/yiongxu.png" class="span-right" alt=""/>
            <div class="top-subCo">
              <span>{{ite.title | takeOutData}}</span>
              <span>/ USDT</span>
            </div>
            <div 
              class="bott-sibCo" 
              :style="{color: ite.change<0?'#e71e42':'#40d190'}"
            >
              <span >{{ite.new_price}}</span>
              <span>{{ite.change | priceChange}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 币币行情 涨幅榜 成交榜 -->
      <div class="coinSlide" v-if="false">
        <!-- <div class="coinTitle">
          <div :class="['border-pot',CheckEdDetail===1 ? 'addBLue': '']" >
            <span @click="setCheckED(1)">币币行情</span>
            <span @click="setCheckED(1)" v-show='CheckEdDetail===1'></span>
            <div class="noneMan">
              免手续费
            </div>
          </div>
          <div :class="['border-pot',CheckEdDetail===2 ? 'addBLue': '']">
            <span @click="setCheckED(2)">涨幅榜</span>
            <span @click="setCheckED(2)" v-show='CheckEdDetail===2'></span>
          </div>
          <div :class="['border-pot',CheckEdDetail===3 ? 'addBLue': '']">
            <span @click="setCheckED(3)">成交榜</span>
            <span @click="setCheckED(3)" v-show='CheckEdDetail===3'></span>
          </div>
        </div> -->
        <!-- <div class="detail-list">
          <div 
            v-if='CheckEdDetail===2 && !perforData' 
            style='color:darkgray'
          >暂无数据</div>
          <div 
            class="flex-row current-currency"
            v-for="(item,iten) in (CheckEdDetail===1 ?
              currencyMarketListNew :
              (CheckEdDetail===2 ? perforData : cliDeal))"
            :key="iten"
            @click="viewMarketDetail(item.title, item.name, item.isContract, 'trade')"
          >
            <div class="flex-row padding-r10">
              <div class="add-type flex-col padding-l5 box-space">
                <p>{{item.title | tit(0)}}
                  <span>/ {{item.title | tit(1)}}</span>
                </p>
                <span v-if="CheckEdDetail!==3">
                  {{$t('marketData.volumn')+' '+item.volume.toFixed(2)}}
                </span>
              </div>
            </div>
            <div class="box1 flex-row">
              <div class="add-money box1 flex-col flex-right box-space">
                <p 
                  :style="{color: item.change<0?'#d87675':'#85bf85'}"
                  v-if='CheckEdDetail!==3'
                >{{ $dataConversion.toNonExponential(item.new_price) }}</p>
                <p 
                  :style="{color: '#adadad'}"
                  v-if='CheckEdDetail===3'
                >{{item.volume.toFixed(2)}}￥</p>
                <span 
                  :style="{color: item.change<0?'#d87675':'#85bf85'}"
                  v-if='CheckEdDetail!==3'
                >￥ {{ new Number(item.jia) }}</span>
                <span 
                  :style="{color: '#adadad'}"
                  v-if='CheckEdDetail===3'
                >24h成交额</span>
              </div>
              <div class="box-center padding-l20">
                <div
                  class="btn box-center"
                  :style="{color: item.change<0?'#d87675':'#85bf85'}"
                >{{ item.change | priceChange }}</div>
              </div>
            </div>
          </div>
        </div> -->
        <!-- new Vant -->
        <div class="noneMan">
          免手续费
        </div>
        <Tabs 
          v-model="activeNew"
          swipeable
          animated
          :duration="0.5"
          color='#3e80ca'
          :line-height='2'
          title-active-color='#3e80ca'
          title-inactive-color='#787878'
          :line-width='40'
          @change='touchHanldeExch'
        >
            <!-- :title="inde===1 ? '币币行情' : (inde===2 ? '涨幅榜': '成交榜')" -->
          <Tab 
            v-for="inde in 4" 
            :title="tabTitle[inde-1]"
            :name="inde"
            :key='inde'
          >
            <div class="detail-list">
              <div 
                v-if='inde===2 && !perforData' 
                style='color:darkgray'
              >
                暂无数据
              </div>
              <!-- <div 
                class="flex-row current-currency"
                v-for="(item,iten) in (inde===1 ?
                  currencyMarketListNew :
                  (inde===2 ? transactionDate :
                  (inde===3 ? perforData : cliDeal)))"
                :key="iten"
                @click="viewMarketDetail(item.title, item.name, item.isContract, 'trade')"
              > -->
              <div 
                class="flex-row current-currency border-bom"
                v-for="(item,iten) in (inde===1 ?
                  perforData :
                  (inde===2 ? cliDeal :
                  (inde===3 ? transactionDate : currencyMarketListNew)))"
                :key="iten"
                @click="viewMarketDetail(item.title, item.name, item.isContract, 'trade')"
              >
                <div class="flex-row padding-r10">
                  <div class="add-type flex-col padding-l5 box-space">
                    <p>{{item.title | tit(0)}}
                      <span>/ {{item.title | tit(1)}}</span>
                    </p>
                    <span v-if="inde!==2">
                      {{$t('marketData.volumn')+' '+item.volume.toFixed(2)}}
                    </span>
                  </div>
                </div>
                <div class="box1 flex-row">
                  <div class="add-money box1 flex-col flex-right box-space">
                    <p 
                      :style="{color: item.change<0?'#e71e42':'#40d190'}"
                      v-if='inde!==2'
                    >{{ $dataConversion.toNonExponential(item.new_price) }}</p>
                    <p 
                      class="zhicang"
                      :style="{color: '#adadad'}"
                      v-if='inde===2'
                    >{{item.volume.toFixed(2)}}￥</p>
                    <span 
                      :style="{color: '#adadad'}"
                      v-if='inde!==2'
                    >￥ {{ new Number(item.jia) }}</span>
                    <span 
                      :style="{color: '#adadad'}"
                      v-if='inde===2'
                    >24h成交额</span>
                  </div>
                  <div 
                    class="box-center padding-l20" 
                    :style="{background: item.change<0?'#e71e42':'#40d190'}"
                    >
                    <div class="btn box-center">
                      {{ item.change | priceChange }}</div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <!-- <Tab title="涨幅榜">内容 2</Tab>
          <Tab title="成交榜">内容 3</Tab> -->
        </Tabs>
      </div>
      <!-- 币币行情 涨幅榜 成交榜 -->
      <div 
        class="newDetailCoin" 
        v-for="(item1,inde) in wrapData"
        :key="inde"
      >
        <div class="coinTitle">
          <span v-if="inde==='perforData1'">
            {{$t('newZh.perFo')}}
          </span>
          <span v-if="inde==='cliDeal1'">
            {{$t('newZh.dealList')}}
          </span>
          <span v-if="inde==='currencyMarketListNew1'">
            {{$t('newZh.coinCurr')}}
          </span>
          <span @click="gotoAllData(inde)">{{$t('newZh.lookAll')}}</span>
          <div class="noneMan" v-if="inde==='currencyMarketListNew1'">
            {{$t("newZh.freeFee")}}
          </div>
        </div>
        <div class="detail-list">
          <div  
            class="flex-row current-currency border-bom"
            v-for="(item,iten) in item1"
            :key="iten"
            @click="viewMarketDetail(item.title, item.name, item.isContract, 'trade')"
          > 
            <div class="flex-row padding-r10">
              <div class="add-type flex-col padding-l5 box-space">
                <p>{{item.title | tit(0)}}
                  <span>/ {{item.title | tit(1)}}</span>
                </p>
                <span v-if="inde!=='cliDeal1'">
                  {{$t('marketData.volumn')+' '+item.volume.toFixed(2)}}
                </span>
              </div>
            </div>
            <div class="box1 flex-row">
              <div class="add-money box1 flex-col flex-right box-space">
                <p 
                  :style="{color: item.change<0?'#e71e42':'#40d190'}"
                  v-if='inde!=="cliDeal1"'
                >{{ $dataConversion.toNonExponential(item.new_price) }}</p>
                <p 
                  class="zhicang"
                  :style="{color: '#adadad'}"
                  v-if='inde==="cliDeal1"'
                >{{item.volume.toFixed(2)}}￥</p>
                <span 
                  :style="{color: '#adadad'}"
                  v-if='inde!=="cliDeal1"'
                >￥ {{ new Number(item.jia) }}</span>
                <span 
                  :style="{color: '#adadad'}"
                  v-if='inde==="cliDeal1"'
                >{{$t("newZh.timeBus")}}</span>
              </div>
              <div 
                class="box-center padding-l20" 
                :style="{background: item.change<0?'#e71e42':'#40d190'}"
                >
                <div class="btn box-center">
                  {{ item.change | priceChange }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <footer>{{$t('foot')}}</footer> -->
    </div>
  </div>
</template>

<script>
import home from "./home";
import {Alert} from 'vux'
// import Swipe from 'mint-ui/lib/swipe'
// import SwipeItem from 'mint-ui/lib/swipe-item'

export default {
  ...home,
};
</script>
<style lang="scss" >
@import "./home.scss";
</style>

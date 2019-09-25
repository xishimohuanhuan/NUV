<template>
  <div class="quotation">
    <div v-show="false" class="common-header">{{$t('quotation.quotation')}}</div>
    <!-- <div class="sd">
      <p class="sd-c">
        <img :src="require(refreshImg)" alt=""/>
        <span v-text="refreshText"></span>
      </p>
    </div> -->
    <div class="quotation-container">
      <div class="quotation-navbar quotation-part">
        <div :class="[{'tab-item-selected': selectedTab==='OP'},'tab-item', 'tab-item-0']" @click="changeSelectTb('OP')">
          <span>{{$t('quotation.optional')}}</span>
        </div>
        <div :class="[{'tab-item-selected': selectedTab==='CT'},'tab-item', 'tab-item-0']" @click="changeSelectTb('CT')">
          <span>{{$t('quotation.contract')}}</span>
        </div>
        <div :class="[{'tab-item-selected': selectedTab==='MX'},'tab-item', 'tab-item-1']" @click="changeSelectTb('MX')">
          <span>{{$t('quotation.HBMain')}}</span>
        </div>
        <div :class="[{'tab-item-selected': selectedTab==='TSXV'},'tab-item', 'tab-item-2']" @click="changeSelectTb('TSXV')">
          <span>{{$t('quotation.HBNext')}}</span>
        </div>
        <div class="search-currency" @click="handleSearch">
          <img src="../../assets/img/quotation/search.png" alt/>
        </div>
      </div>
      <div :class="['quotation-data', {'handle-loading': !isLoading}]">
        <!-- <div class="quotation-data-header">
          <div class="data-header-item data-header-item-0" @click="changeOrder('market')">
            <span>{{$t('quotation.name')}}</span>
            <img :src="orderTypeImg[tabList[selectedTab]['market']]" alt=""/>
          </div>
          <div class="data-header-item data-header-item-1" @click="changeOrder('newPrice')">
            <span>{{$t('quotation.marketPrice')}}</span>
            <img :src="orderTypeImg[tabList[selectedTab]['newPrice']]" alt=""/>
          </div>
          <div class="data-header-item data-header-item-2" @click="changeOrder('change')">
            <span>{{$t('quotation.change')}}</span>
            <img :src="orderTypeImg[tabList[selectedTab]['change']]" alt=""/>
          </div>
        </div> -->
        <div ref="dataContainer" class="data-container" v-show="isLoading">
          <ul v-show="showQuotationList.length">
            <li class="data-item" :data-name="item.name" v-for="(item, index) in showQuotationList" :key="index">
              <div data-main="main" :ref="item.name" :data-name="item.name" :class="['data-item-d', {'data-item-d0': selectedTab === 'OP'}]">
                <div :data-name="item.name" class="data-item-head">
                  <p :data-name="item.name">{{item.title | tit(0)}}
                    <span :data-name="item.name">/ {{item.title | tit(1)}}</span>
                  </p>
                  <span :data-name="item.name">{{$t('marketData.volumn')+' '+item.volume.toFixed(2)}}</span>
                </div>
                <div :data-name="item.name" class="data-item-price">
                  <p :data-name="item.name" :style="{color: item.change<0?'#d87675':'#85bf85'}">{{$dataConversion.toNonExponential(item.new_price)}}</p>
                  <p :data-name="item.name" :style="{color: item.change<0?'#d87675':'#85bf85'}">￥ {{new Number(item.jia)}}</p>
                </div>
                <div :data-name="item.name" class="data-item-change">
                  <div :data-name="item.name" class="btn" :style="{backgroundColor: item.change<0?'#d87675':'#85bf85'}">{{ item.change | priceChange }}</div>
                </div>
                <div class="long-press">
                  <span data-item="MODIFY" v-if="selectedTab !== 'OP'" v-text="$t('quotation.addOptional')" @click.self="modifyOptional('ADD', item, $event)"></span>
                  <span data-item="MODIFY" v-if="selectedTab === 'OP'" style="backgroundColor: #3e80ca;color: #fff;" v-text="$t('quotation.topOptional')" @click.self="modifyOptional('TOP', item, $event)"></span>
                  <span data-item="MODIFY" v-if="selectedTab === 'OP'" v-text="$t('quotation.delOptional')" @click.self="modifyOptional('DEL', item, $event)"></span>
                </div>
              </div>
            </li>
          </ul>
          <div v-show="!showQuotationList.length" data-login="login" class="add-optional" v-text="$t('quotation.addOptional')" @click.self="$loginRoute('./quotation/search')"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import quotation from './quotation';
export default {
  ...quotation
}
</script>

<style lang="scss" >
@import "./quotation.scss";
</style>

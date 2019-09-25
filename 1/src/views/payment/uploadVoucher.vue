<template>
  <div class="upload-voucher">
    <headers @back="$goBack"/>
    <!-- <div class="voucher-poptip">
      <div class="poptip-header">
        <img src="../../assets/img/uploadVoucher/poptip.png" alt />
        <span v-text="$t('uploadVoucher.header')"></span>
      </div>
      <p v-text="$t('uploadVoucher.content1')"></p>
      <p v-text="$t('uploadVoucher.content2')"></p>
    </div> -->
    <div class="tilte" v-if='startEnter==="2"' v-text="'上传支付凭证'"></div>
    <div class="tilte" v-if='startEnter==="1"' v-text="'提供订单线下付款信息'"></div>
    <div class="click-voucher" v-if='startEnter==="2"'>
      <div @click.self="handleUploadImg(false)" class="click-box">
        <img 
          @click.stop.prevent="handleEnlargeImg" 
          ref="percent" 
          v-show="!percent" 
          :class="['normal-img', {'upload-img': uploadSrc}]" 
          src="../../assets/img/uploadVoucher/upload.png" 
          alt
        />
        <div v-show="percent" class="custom-progress">
          <my-progress :percent="percent"/>
        </div>
      </div>
      <p class="click-title" @click.self="handleUploadImg(true)" v-text="$t('uploadVoucher.click')"></p>
    </div>
    <!-- 提供订单线下付款信息 -->
    <div class="click-mas" v-if='startEnter==="1"'>
      <p>选择付款方式</p>
      <div class="cli-box">
        <div 
          :class="[checkAdd===2 ? 'addBlue' :'',(checkTrueAdd ||checkAdd===2) ? '':'addCCC']"
          @click="handleCliSele(2)"
        >支付宝</div>
        <div 
          :class="[checkAdd===3 ? 'addBlue' :'',(checkTrueAdd ||checkAdd===3) ? '':'addCCC']"
          @click="handleCliSele(3)"
        >微信支付</div>
        <div 
          :class="[checkAdd===1 ? 'addBlue' :'',(checkTrueAdd ||checkAdd===1) ? '':'addCCC']"
          @click="handleCliSele(1)"
        >银行卡</div>
      </div>
    </div>
    <!-- 输入线下支付信息 -->
    <div class="munAdd" v-if='startEnter==="1"'>
        <p>提供支付信息</p>
        <div class="input-deta" v-show='checkAdd===2'>
          <input 
            v-model="dataAccount" 
            placeholder="请输入您的支付宝账号"
            @input="verifyData"
            @blur="bankAjax1"
            @focus="showFocusNeunIf"
          />
          <!-- <span>支付宝</span> -->
        </div>
        <div class="input-deta" v-show='checkAdd===3'>
          <input 
            v-model="dataAccount1" 
            placeholder="请输入您的微信昵称"
            @input="verifyData"
            @blur="bankAjax1"
            @focus="showFocusNeunIf"
          />
          <!-- <span>微信</span> -->
        </div>
        <div class="input-deta" v-show='checkAdd===1'>
          <input 
            v-model="dataAccount2" 
            type='number' 
            placeholder="请输入您的银行卡号"
            @input="verifyData"
            @blur="bankAjax"
            @focus="showFocusNeunIf"
          />
          <span v-show="bankABC" v-text="bankMasge[bankABC]"></span>
        </div>
        <!-- 下拉菜单 -->
        <div 
          class="menu-up" 
          v-show="showNeunIf && dataSelech.length"
        >
          <div 
            class="menu-detail"
            v-for="(ite,ind) in dataSelech" 
            :key='ind' 
            @click="selectCheck(ite)"
          >
            <div v-text="ite"></div>
            <!-- <div>支付宝</div> -->
          </div>
        </div>
    </div>
    <div 
      class="fot-wr" 
      v-if='startEnter==="1" && checkAdd===2'
    >
      仅支持字母、数字0~9，部分特殊字符，最多30位
    </div>
    <div 
      class="fot-wr" 
      v-if='startEnter==="1" && checkAdd===3'
    >
      微信昵称最多30字
    </div>
    <div 
      class="fot-wr" 
      v-if='startEnter==="1" && checkAdd===1'
    >
      仅支持数字0~9最多20位
    </div>
    <div class="p-Wrod">
      <div class="tit-hea">温馨提示：</div>
      <div class="wrod-wra" v-if='startEnter==="1"'>
        <span>*</span>
        <div>请提供线下支付相关信息，方便商家快速核对订单支付金额，极速放币。</div>
      </div>
      <div class="wrod-wra" v-if='startEnter==="1"'>
        <span>*</span>
        <div>支付宝支付请提供账号信息，微信支付请提供微信昵称，银行卡支付请提供银行卡号。</div>
      </div>
      <div class="wrod-wra" v-if='startEnter==="1"'>
        <span>*</span>
        <div>填写信息仅用于商家核对订单转账金额，平台承诺保障用户隐私。</div>
      </div>
      <!-- 上传凭证 -->
      <div class="wrod-wra" v-if='startEnter==="2"'>
        <span>*</span>
        <div>请上传支付转账成功页面截图，方便商家快速核对订单支付金额，极速放币。</div>
      </div>
      <div class="wrod-wra" v-if='startEnter==="2"'>
        <span>*</span>
        <div>支付截图凭证需信息完整，截图清晰，任何修改截图内容伪造支付者，商家有权拒接放币。</div>
      </div>
    </div>
    <input v-show="false" accept="image/*" type="file" ref="uploadImg"/>
    <div v-if='startEnter==="2"' @click="handlePay" :class="['voucher-footer', {'voucher-footer-active': uploadSrc}]" v-text="$t('uploadVoucher.submit')"></div>
    <div 
      v-if='startEnter==="1"' 
      @click="handlePayData" 
      :class="['voucher-footer', confAccount ? 'voucher-footer-active' :'']" 
      v-text="'确认提交'"
    ></div>
    <div v-show="startEnter==='2' && showImg" class="detail-shade" @click.self="showImg=false">
      <img v-if="showImg" :src="showImgSrc" alt/>
    </div>
    <toast 
      :isShow="showToast" 
      :showToastType="toast.type"
      :toastContent="toast.content"
      :toastTitle="toast.title" 
      :toastOperateTitle="toast.confirm" 
      :toastAssistOperateTitle="toast.assist" 
      @handle-main-click="mainClick" 
      @handle-assist-click="assistClick"
    />
    <!-- 线下付款弹框 -->
    <toast 
      :isShow="showToast1" 
      :showToastType="'operate'"
      :toastContent="'请确认提交的订单支付信息是否正确'"
      :toastTitle="'确认提交'" 
      :toastOperateTitle="'确认'" 
      :toastAssistOperateTitle="'取消'" 
      @handle-main-click="mainClick1" 
      @handle-assist-click="showToast1=false"
    />
    <toast 
      :isShow="showToast12"  
      :showToastType="'normal'" 
      :toastContent="mainWord"/>
  </div>
</template>

<script>
import headers from '../../component/header';
import myProgress from '../../component/progress';
import toast from '../../component/toast';
import { uploadQiniu } from '../../commons/qiniuUpload'
export default {
  components: {
    headers,
    myProgress,
    toast
  },
  data() {
    return {
      // 下拉账号框
      showNeunIf:false,
      showToast1:false,
      showToast12:false,
      mainWord:"出错",
      // 账号
      dataAccount:'',
      dataAccount1:'',
      dataAccount2:'',
      // 最终确定的支付方式
      confAccount:'',
      // 选择付款方式
      checkAdd:1,
      // 账号搜素
      dataSelech:[],
      startEnter:false,
      orderId: '',
      isUpload: false,
      uploadSrc: '',
      percent: 0,
      showImg: false,
      showToast: false,
      showImgSrc: '',
      toastFlag: false,
      toast: {
        type: '',
        content: '',
        title: '',
        confirm: '',
        assist: '',
        method: ''
      },
      // 银行卡信息
      bankMasge:{
        "SRCB": "深圳农村商业银行", 
        "BGB": "广西北部湾银行", 
        "SHRCB": "上海农村商业银行", 
        "BJBANK": "北京银行", 
        "WHCCB": "威海市商业银行", 
        "BOZK": "周口银行", 
        "KORLABANK": "库尔勒市商业银行", 
        "SPABANK": "平安银行", 
        "SDEB": "顺德农商银行", 
        "HURCB": "湖北省农村信用社", 
        "WRCB": "无锡农村商业银行", 
        "BOCY": "朝阳银行", 
        "CZBANK": "浙商银行", 
        "HDBANK": "邯郸银行", 
        "BOC": "中国银行", 
        "BOD": "东莞银行", 
        "CCB": "中国建设银行", 
        "ZYCBANK": "遵义市商业银行", 
        "SXCB": "绍兴银行", 
        "GZRCU": "贵州省农村信用社", 
        "ZJKCCB": "张家口市商业银行", 
        "BOJZ": "锦州银行", 
        "BOP": "平顶山银行", 
        "HKB": "汉口银行", 
        "SPDB": "上海浦东发展银行", 
        "NXRCU": "宁夏黄河农村商业银行", 
        "NYNB": "广东南粤银行", 
        "GRCB": "广州农商银行", 
        "BOSZ": "苏州银行", 
        "HZCB": "杭州银行", 
        "HSBK": "衡水银行", 
        "HBC": "湖北银行", 
        "JXBANK": "嘉兴银行", 
        "HRXJB": "华融湘江银行", 
        "BODD": "丹东银行", 
        "AYCB": "安阳银行", 
        "EGBANK": "恒丰银行", 
        "CDB": "国家开发银行", 
        "TCRCB": "江苏太仓农村商业银行", 
        "NJCB": "南京银行", 
        "ZZBANK": "郑州银行", 
        "DYCB": "德阳商业银行", 
        "YBCCB": "宜宾市商业银行", 
        "SCRCU": "四川省农村信用", 
        "KLB": "昆仑银行", 
        "LSBANK": "莱商银行", 
        "YDRCB": "尧都农商行", 
        "CCQTGB": "重庆三峡银行", 
        "FDB": "富滇银行", 
        "JSRCU": "江苏省农村信用联合社", 
        "JNBANK": "济宁银行", 
        "CMB": "招商银行", 
        "JINCHB": "晋城银行JCBANK", 
        "FXCB": "阜新银行", 
        "WHRCB": "武汉农村商业银行", 
        "HBYCBANK": "湖北银行宜昌分行", 
        "TZCB": "台州银行", 
        "TACCB": "泰安市商业银行", 
        "XCYH": "许昌银行", 
        "CEB": "中国光大银行", 
        "NXBANK": "宁夏银行", 
        "HSBANK": "徽商银行", 
        "JJBANK": "九江银行", 
        "NHQS": "农信银清算中心", 
        "MTBANK": "浙江民泰商业银行", 
        "LANGFB": "廊坊银行", 
        "ASCB": "鞍山银行", 
        "KSRB": "昆山农村商业银行", 
        "YXCCB": "玉溪市商业银行", 
        "DLB": "大连银行", 
        "DRCBCL": "东莞农村商业银行", 
        "GCB": "广州银行", 
        "NBBANK": "宁波银行", 
        "BOYK": "营口银行", 
        "SXRCCU": "陕西信合", 
        "GLBANK": "桂林银行", 
        "BOQH": "青海银行", 
        "CDRCB": "成都农商银行", 
        "QDCCB": "青岛银行", 
        "HKBEA": "东亚银行", 
        "HBHSBANK": "湖北银行黄石分行", 
        "WZCB": "温州银行", 
        "TRCB": "天津农商银行", 
        "QLBANK": "齐鲁银行", 
        "GDRCC": "广东省农村信用社联合社", 
        "ZJTLCB": "浙江泰隆商业银行", 
        "GZB": "赣州银行", 
        "GYCB": "贵阳市商业银行", 
        "CQBANK": "重庆银行", 
        "DAQINGB": "龙江银行", 
        "CGNB": "南充市商业银行", 
        "SCCB": "三门峡银行", 
        "CSRCB": "常熟农村商业银行", 
        "SHBANK": "上海银行", 
        "JLBANK": "吉林银行", 
        "CZRCB": "常州农村信用联社", 
        "BANKWF": "潍坊银行", 
        "ZRCBANK": "张家港农村商业银行", 
        "FJHXBC": "福建海峡银行", 
        "ZJNX": "浙江省农村信用社联合社", 
        "LZYH": "兰州银行", 
        "JSB": "晋商银行", 
        "BOHAIB": "渤海银行", 
        "CZCB": "浙江稠州商业银行", 
        "YQCCB": "阳泉银行", 
        "SJBANK": "盛京银行", 
        "XABANK": "西安银行", 
        "BSB": "包商银行", 
        "JSBANK": "江苏银行", 
        "FSCB": "抚顺银行", 
        "HNRCU": "河南省农村信用", 
        "COMM": "交通银行", 
        "XTB": "邢台银行", 
        "CITIC": "中信银行", 
        "HXBANK": "华夏银行", 
        "HNRCC": "湖南省农村信用社", 
        "DYCCB": "东营市商业银行", 
        "ORBANK": "鄂尔多斯银行", 
        "BJRCB": "北京农村商业银行", 
        "XYBANK": "信阳银行", 
        "ZGCCB": "自贡市商业银行", 
        "CDCB": "成都银行", 
        "HANABANK": "韩亚银行", 
        "CMBC": "中国民生银行", 
        "LYBANK": "洛阳银行", 
        "GDB": "广东发展银行", 
        "ZBCB": "齐商银行", 
        "CBKF": "开封市商业银行", 
        "H3CB": "内蒙古银行", 
        "CIB": "兴业银行", 
        "CRCBANK": "重庆农村商业银行", 
        "SZSBK": "石嘴山银行", 
        "DZBANK": "德州银行", 
        "SRBANK": "上饶银行", 
        "LSCCB": "乐山市商业银行", 
        "JXRCU": "江西省农村信用", 
        "ICBC": "中国工商银行", 
        "JZBANK": "晋中市商业银行", 
        "HZCCB": "湖州市商业银行", 
        "NHB": "南海农村信用联社", 
        "XXBANK": "新乡银行", 
        "JRCB": "江苏江阴农村商业银行", 
        "YNRCC": "云南省农村信用社", 
        "ABC": "中国农业银行", 
        "GXRCU": "广西省农村信用", 
        "PSBC": "中国邮政储蓄银行", 
        "BZMD": "驻马店银行", 
        "ARCU": "安徽省农村信用社", 
        "GSRCU": "甘肃省农村信用", 
        "LYCB": "辽阳市商业银行", 
        "JLRCU": "吉林农信", 
        "URMQCCB": "乌鲁木齐市商业银行", 
        "XLBANK": "中山小榄村镇银行", 
        "CSCB": "长沙银行", 
        "JHBANK": "金华银行", 
        "BHB": "河北银行", 
        "NBYZ": "鄞州银行", 
        "LSBC": "临商银行", 
        "BOCD": "承德银行", 
        "SDRCU": "山东农信", 
        "NCB": "南昌银行", 
        "TCCB": "天津银行", 
        "WJRCB": "吴江农商银行", 
        "CBBQS": "城市商业银行资金清算中心", 
        "HBRCU": "河北省农村信用社"
      },
      bankABC:false,
      timerset:null,
      timer2:null,
      checkTrueAdd:false
    }
  },
  beforeRouteEnter (to, from, next) {
    // ...
    next(vm => {
      vm.startEnter=vm.$route.params.coin;
      let key = vm.$route.params.key;
      if (key) {
        vm.orderId = key;
        vm.$store.commit('changeNoMenu', false);
        vm.checkAdd=Number(vm.$route.params.payway)
        if(vm.checkAdd===1){
          vm.checkTrueAdd=true;
        }
      } else
        vm.$loginRoute('./home');
    })
  },
  beforeRouteLeave (to, from, next) {
    // ...
    this.$store.commit('changeNoMenu', true);
    clearTimeout(this.timerset);
    clearTimeout(this.timer2);
    next();
  },
  methods: {
    handleUploadImg(flag) {
      if(flag) {
        this.isUpload = false;
      }
      let that = this;
      if (!that.isUpload) {
        that.$refs['uploadImg'].onchange = function(event) {
          that.isUpload = true;
          let _file = event.target.files[0];      
          if (!_file) {
            that.isUpload = false;
            return;
          }
          if (_file.size > 10 * 1024 * 1024) {
            that.isUpload = false;
            that.$Toast(that.$t('setting.realName.IDCartRule4'));
            return;
          }
          that.uploadImgHandle(_file);
        }
        that.$refs['uploadImg'].click();
      }
    },
    async uploadImgHandle(file){
      
      let observable = await uploadQiniu(file);
      let next = (response) =>{
          let total = response.total;
          let percent = Math.floor(total.percent)
          this.percent = percent;
      }
      let error = (err) => {
          
      }
      let complete = (res) => {
          this.replaceImg(file, res.hash);
      }
      let subscription  = observable.subscribe(next, error, complete);
    },
    replaceImg(file, hash) {
      this.showImgSrc = URL.createObjectURL(file);
      this.$refs.percent.src = URL.createObjectURL(file);
      this.uploadSrc = hash;
      this.percent = 0;
    },
    handleEnlargeImg() {
      let that = this;
      if (that.uploadSrc) {
        that.showImg = true;
      } else {
        that.handleUploadImg();
      }
    },
    handlePay() {
      let that = this;
      if (!that.uploadSrc) {
        return;
      }
      that.toast = {
        type: 'operate',
        content: that.$t('poptip.orderDetail.confirmPay.content1'),
        // title: that.$t('poptip.orderDetail.confirmPay.title'),
        title: '确认提交',
        // confirm: that.$t('poptip.orderDetail.confirmPay.cancelTitle'),
        confirm: '确认提交',
        // assist: that.$t('poptip.orderDetail.confirmPay.cancel'),
        assist: '暂不提交',
        method: '4'
      };
      that.showToast = true;
    },
    mainClick() {
      this.showToast = false;
      if(!this.toastFlag){
        this.changeOrderStatus(this.toast.method);
      }
      this.toastFlag = false;
    },
    assistClick() {
      this.showToast = false;
    },
    // 加速放币提交凭证/账号
    changeOrderStatus(status) {
      let that = this;
      let opt={};
      if(status){
        // 凭证
        opt = {
          userId: Number((that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)),
          orderId: Number(that.orderId),
          type:'1',
          payVoucher: that.uploadSrc
        };
      }else{
        opt = {
          userId: Number((that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId)),
          orderId: Number(that.orderId),
          type:'2',
          payWay:that.checkAdd.toString(),
          name:that.bankMasge[that.bankABC],
          account:that.confAccount.trim()
        };
      }
      let _status = status;
      that.$axios({
        url: '/version/api/trade/fastRelease',
        method: 'post',
        params: opt
      }).then(function(res) {
        if (res.data.status === 200) {
          // 已经提交过
          if(res.data.code==='004'){
            that.$Toast(res.data.msg);
            that.showToast1=false;
            setTimeout(()=>{
              that.$router.push('/orderDetail/'+that.orderId);
            },2000);
            return;
          }
          that.$Toast('加速成功');
          setTimeout(()=>{
            that.$router.push('/orderDetail/'+that.orderId);
          },2000);
          return;
        }else{
          that.$Toast('提交失败，请稍后再试');
        }
      }).catch(err=>{
        that.$Toast('网络问题，请稍后再试');
      })
    },
    // changeOrderStatus(status) {
    //   let that = this,
    //     opt = {
    //       orderId: that.orderId,
    //       orderStatus: status,
    //       userId: (that.$getCookie('userId') && JSON.parse(decodeURIComponent(that.$getCookie('userId'))).userId),
    //       payPassword: that.password||'',
    //       payVoucher: that.uploadSrc
    //     },
    //     _status = status;
      
    //   that.$axios({
    //     url: 'version/api/trade/updateOrderStatus',
    //     method: 'post',
    //     data: opt
    //   }).then(function(res) {
    //     if (res.data.status === 200) {
    //       that.toastFlag = true;
    //       if (res.data.code === '001') {
    //         that.$Toast(that.$t('poptip.orderDetail.notExists'));
    //         return;
    //       } else if (res.data.code === '002') {
    //         that.$Toast(that.$t('poptip.orderDetail.updateError'));
    //         return;
    //       } else if (res.data.code === '003') {
    //         // that.$Toast(that.$t('poptip.orderDetail.cancel'));
    //         that.toast = {
    //           type: 'operate',
    //           content: that.$t('poptip.orderDetail.cancel'),
    //           title: '',
    //           confirm: that.$t('poptip.orderDetail.iKnow'),
    //           assist: '',
    //           method: '6'
    //         };
    //         that.showToast = true;
    //         return;
    //       } else if (res.data.code === '004') {
    //         // that.$normalToast(that.$t('poptip.orderDetail.notCancel'));
    //         that.toast = {
    //           type: 'operate',
    //           content: that.$t('poptip.orderDetail.notCancel'),
    //           title: '',
    //           confirm: that.$t('poptip.orderDetail.iKnow'),
    //           assist: '',
    //           method: '6'
    //         };
    //         that.showToast = true;
    //         return;
    //       } else if (res.data.code === '005') {
    //         that.$normalToast(that.$t('poptip.orderDetail.passwordError'));
    //         return;
    //       } else if (res.data.code === '006') {
    //         that.$normalToast(that.$t('poptip.orderDetail.updatedStatus'));
    //         that.showDetailPopup = false;
    //         // that.getDetail();
    //         return;
    //       }
    //       that.toastFlag = false;
    //       if (_status === '3') {
    //         that.$Toast(that.$t('poptip.orderDetail.cancelsuccess'));
    //       } else if (_status === '4') {
    //         that.$Toast(that.$t('poptip.orderDetail.overPayOrder'));
    //       } else if (_status === '5') {
    //         that.$Toast(that.$t('poptip.orderDetail.releaseSuccess'));
    //         that.showDetailPopup = false;
    //       }
    //       that.$loginRoute('/orderDetail/' + that.orderId);
    //     }
    //   })
    // },
    // 选择支付方式
    handleCliSele(data){
      this.dataSelech=[];
      if(this.$route.params.payway==='1'){
        this.checkAdd=data;
      }
      
      this.confAccount='';
      if(data===2){
        this.confAccount=this.dataAccount;
        return;
      }
      if(data===3){
        this.confAccount=this.dataAccount1;
        return;
      }
      if(data===1){
        this.confAccount=this.dataAccount2;
        return;
      }
    },
    // 输入账号验证
    verifyData(){
      // 支付宝
      if(this.checkAdd===2){
        if(/^\s*/g.test(this.dataAccount)){
          this.dataAccount=this.dataAccount.replace(/^\s*/g,"")
        }
        if(this.dataAccount.length>30){
          this.dataAccount=this.dataAccount.slice(0,30)
        }
        this.confAccount=this.dataAccount;
      }
       // 微信
      if(this.checkAdd===3){
        if(/^\s*/g.test(this.dataAccount1)){
          this.dataAccount1=this.dataAccount1.replace(/^\s*/g,"")
        }
        if(this.dataAccount1.length>30){
          this.dataAccount1=this.dataAccount1.slice(0,30)
        }
        this.confAccount=this.dataAccount1;
      }
       // 银行卡
      if(this.checkAdd===1){
        if(/^\s*/g.test(this.dataAccount2)){
          this.dataAccount2=this.dataAccount2.replace(/^\s*/g,"")
        }
        if(/[^\d]/g.test(this.dataAccount2)){
          this.dataAccount2=this.dataAccount2.replace(/[^\d]/g,'');
        }
        if(this.dataAccount2.length>20){
          this.dataAccount2=this.dataAccount2.slice(0,20)
        }
        this.confAccount=this.dataAccount2;
      }
      // if(this.confAccount.length){
        this.searchAjax();
      // }
    },
    // 线下付款提交
    handlePayData(){
      if(this.confAccount){
        if(this.checkAdd !== 1){
          this.showNeunIf=false;
          this.showToast1=true;
          return;
        }
        this.bankAjax(1);
      }
    },
    // 提交银行卡数据
    mainClick1(){
      this.showToast1=false;
      this.changeOrderStatus()
    },
    // 微信/支付宝失焦
    bankAjax1(){
      // if(this.confAccount){
        setTimeout(()=>{
          this.showNeunIf=false;
      },100)
      // }
    },
    // 银行卡失焦
    bankAjax(data){
      this.timer2=setTimeout(() => {
        this.showNeunIf=false;
        if(this.checkAdd !== 1) return; 
        if(this.confAccount){
          this.$axios({
            baseURL: 'https://ccdcapi.alipay.com/',
            url: 'validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo='+this.confAccount+'&cardBinCheck=true'
          }).then((res) =>{
            this.bankABC=res.data.bank;
            if(!res.data.validated){
              this.mainWord="请输入正确的银行卡号";
              this.showToast12=true;
              this.timerset=setTimeout(()=>{
                this.showToast12=false;
              },2000)
            }
            if(data===1 && res.data.validated){
              // 银行卡信息获取成功，弹出提交框
              this.showToast1=true;
            }
          })
        }
      },100)
    },
    // 选中下拉菜单的值
    selectCheck(data){
      this.confAccount=data;
      this.showNeunIf=false;
      if(this.checkAdd===2){
        this.dataAccount=this.confAccount;
        return;
      }
      if(this.checkAdd===3){
        this.dataAccount1=this.confAccount;
        return;
      }
      if(this.checkAdd===1){
        this.dataAccount2=this.confAccount;
        return;
      }
    },
    // 账号搜索
    searchAjax(){
      let opt={
        userId:Number((this.$getCookie('userId') && JSON.parse(decodeURIComponent(this.$getCookie('userId'))).userId)),
        payWay:this.checkAdd.toString(),
        input:this.confAccount
      }
      this.$axios({
        url: '/version/api/trade/searchPayWay',
        method: 'get',
        params: opt
      }).then(res=>{
        this.dataSelech=res.data.data.slice(0,5);
      })
    },
    // 账号输入框聚焦
    showFocusNeunIf(){
      this.showNeunIf=true;
      this.searchAjax();
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-voucher {
  .voucher-poptip {
    margin: 33px 0;
    padding: 31px 30px 36px 23px;
    width: 749px;
    // height: 240px;
    background-color: #fff;
    text-align: left;
    font-size: 24px;
    line-height: 40px;
    color: #3b3b3b;
    .poptip-header {
      margin-bottom: 20px;
      color: #ff5e5e;
      & > img {
        width: 31px;
        height: 31px;
        vertical-align: middle;
      }
    }
  }
  .click-voucher {
    width: 750px;
    height: 758px;
    background-color: #fff;
    .click-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 186px;
      width: 268px;
      height: 274px;
      border: solid 3px #e5e5e5;
      .normal-img {
        width: 62px;
        height: 62px;
      }
      .upload-img {
        width: 268px;
        height: 274px;
        display: block;
        object-fit: cover;
      }
      .custom-progress {
        display: inline-block;
        width: 120px;
        height: 120px;
      }
    }
    .click-title{
      color: #3e80ca;
    }
    & > p {
      margin-top: 100px;
      height: 34px;
      line-height: 34px;
      font-size: 34px;
      color: #3b3b3b;
    }
  }
  .voucher-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 34px;
    color: #fff;
    background-color: #bfbfbf;
  }
  .voucher-footer-active {
    background-color: #3e80ca;
  }
  .detail-shade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(98, 98, 98, .3);
    z-index: 1000;
    & > img {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 627px;
      height: auto;
    }
    .popup-detail {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 717px;
      height: 560px;
      background-color: #fff;
      border-radius: 25px;
      .popup-detail-header {
        margin: 29px 27px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > span {
          height: 50px;
          line-height: 50px;
          font-size: 50px;
          color: #262626;
          font-weight: bold;
        }
        & > img {
          width: 31px;
          height: 31px;
        }
      }
    }
    .popup-detail-poptip {
      margin: 0 30px;
      height: 25px;
      line-height: 25px;
      font-size: 24px;
      color: #d87675;
      text-align: left;
      & > img {
        margin-right: 19px;
        width: 34px;
        height: 34px;
        vertical-align: middle;
      }
      & > span {
        vertical-align: middle;
      }
    }
    .popup-detail-pd {
      margin: 45px 0;
      padding: 46px 30px;
      height: 28px;
      line-height: 28px;
      border: solid 1PX #dcdcdc;
      border-right-color: transparent;
      border-left-color: transparent;
      text-align: left;
      box-sizing: content-box;
      & > span {
        margin-right: 63px;
        font-size: 28px;
        color: #575757;
      }
      & > input {
        font-size: 24px;
        color: #aaa;
        border: none;
        outline: none;
      }
    }
    .popup-detail-rd {
      margin: 0 30px;
      height: 42px;
      line-height: 42px;
      font-size: 24px;
      color: #626262;
      text-align: left;
      & > p {
        margin-left: 10px;
        display: inline-block;
        vertical-align: super;
        & > span {
          color: #3e80ca;
        }
      }
    }
    .confirm {
      margin: 44px 70px;
      width: 579px;
      height: 89px;
      line-height: 89px;
      text-align: center;
      background-color: #3e80ca;
      color: #fff;
      border-radius: 10px;
      font-size: 34px;
    }
  }
}
.tilte{
  background-color: white;
  color: rgb(32,32,37);
  font-size: 45px;
  text-align: left;
  padding: 34px 0;
  padding-left: 26px;
  border-bottom: 1px solid rgb(220,220,220);
}
.p-Wrod{
  margin-left: 26px;
  margin-right: 10px;
  color: rgb(151,151,151);
  font-size: 24px;
  padding-bottom: 130px;
  .tit-hea{
    text-align: left;
    margin-top: 33px;
    margin-bottom: 30px;
  }
  .wrod-wra{
    display: flex;
    line-height: 36px;
    padding-bottom: 10px;
    // margin-top: 30px;
    span{
      padding-right: 5px;
      color: red;
      position: relative;
      top: 6px;
    }
    div{
      line-height: 50px;
      text-align: left;
    }
  }
}
.click-mas{
  background-color: white;
  font-size: 28px;
  color: rgb(87,87,87);
  overflow: hidden;
  p{
    text-align: left;
    padding-left: 26px;
    margin-top: 55px;
    margin-bottom: 48px;
  }
  .cli-box{
    display: flex;
    justify-content: space-around;
    margin-bottom: 51px;
    div{
      height: 70px;
      width: 200px;
      border: 2px solid rgb(160,160,160);
      border-radius: 10px;
      line-height: 70px;
    }
    .addBlue{
      border: 2px solid rgb(62,128,202);
      background-color: #3e80ca;
      color: white;
    }
    .addCCC{
      color: rgba(160,160,160,.5);
      border: 2px solid rgba(160,160,160,.5);
    }
  }
}
.munAdd{
  background-color: white;
  margin-top: 23px;
  font-size: 28px;
  overflow: hidden;
  // position: relative;
  p{
    text-align: left;
    margin-left: 26px;
    margin-top: 37px;
    margin-bottom: 27px;
  }
  .input-deta{
    border-top: 1px solid rgb(220,220,220);
    margin: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 118px;
    input{
      margin-left: 12px;
      flex: 1;
      border: none;
    }
    span{
      margin-right: 12px;
      margin-left: 10px;
    }
  }
}
.fot-wr{
  color: rgb(170,170,170);
  font-size: 24px;
  margin-top: 21px;
  margin-bottom:100px; 
  text-align: left;
  margin-left: 26px;
}
.menu-up{
  position: absolute;
  top: 700px;
  border: 1px solid rgb(220,220,220);
  width: 95%;
  overflow-x: auto;
  // max-height: 300px;
  margin-left: 2.5%;
  z-index: 100;
  background-color: white;
  font-size: 28px;
  .menu-detail{
    display: flex;
    justify-content: space-between;
    margin: 0 33px;
    margin-top: 40px;
  }
  .menu-detail:last-child{
    margin-bottom: 40px;
  }
}
</style>

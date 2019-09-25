// const socket = {
//   initWebSocket() { //初始化weosocket 

//     const wsuri = 'wss://i.cg.net/wi/ws'; //ws地址
//     this.websock = new WebSocket(wsuri);
//     this.websocket.onopen = this.websocketonopen;

//     this.websocket.onerror = this.websocketonerror;

//     this.websock.onmessage = this.websocketonmessage;
//     this.websock.onclose = this.websocketclose;
//   },

//   websocketonopen() {
//     
//   },
//   websocketonerror(e) { //错误
//     
//   },
//   websocketonmessage(e) { //数据接收 
//     
//     const redata = JSON.parse(e.data);
//     //注意：长连接我们是后台直接1秒推送一条数据， 
//     //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
//     //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
//     
//   },

//   websocketsend(agentData) { //数据发送 
//     this.websock.send(agentData);
//   },

//   websocketclose(e) { //关闭 
//     
//   }
// }
// export { socket }

// demo2示例2-------

// data(){
//     return{
//         websock: null,
//         reconnectData:null,
//         lockReconnect:false,    //避免重复连接，因为onerror之后会立即触发 onclose
//         timeout:10000,          //10s一次心跳检测
//         timeoutObj:null,
//         serverTimeoutObj:null,
//     }
// },
// created(){
//     this.initWebSocket();
// },
// methods:{
//     initWebSocket(){
//         console.log('启动中')
//         let wsurl = '你的websockt url';
//         this.websock = new WebSocket(wsurl);
//         this.websock.onopen = this.websocketonopen;          //连接成功
//         this.websock.onmessage = this.websocketonmessage;    //广播成功
//         this.websock.onerror = this.websocketonerror;        //连接断开，失败
//         this.websock.onclose = this.websocketclose;          //连接关闭
//     },             //初始化weosocket
//     websocketonopen(){
//         console.log('连接成功')
//         this.heatBeat();
//     },           //连接成功
//     websocketonerror(){
//         console.log('连接失败')
//         this.reconnect();
//     },          //连接失败
//     websocketclose(){
//         console.log('断开连接');
//         this.reconnect();
//     },            //各种问题导致的 连接关闭
//     websocketonmessage(data){
//         this.heatBeat();      //收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
//         let msgData = JSON.parse(data);
//     },    //数据接收
//     websocketsend(data){
//         this.websock.send(JSON.stringify(data));
//     },         //数据发送
//     reconnect(){
//         if(this.lockReconnect){       //这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
//             return
//         }
//         this.lockReconnect = true;
//         this.reconnectData && clearTimeout(this.reconnectData);
//         this.reconnectData = setTimeout(()=>{
//             this.initWebSocket();
//             this.lockReconnect = false;
//         },5000)
//     },                 //socket重连
//     heatBeat(){
//         this.timeoutObj && clearTimeout(this.timeoutObj);
//         this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
//         this.timeoutObj = setTimeout(()=>{
//             this.websocketsend({type:'心跳检测'})   //根据后台要求发送
//             this.serverTimeoutObj = setTimeout(()=> {
//                 this.websock.close();       //如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
//             }, 5000);
//         }, this.timeout)
//     },                  //心跳检测
// },
// destroyed() {
//     this.lockReconnect = true;
//     this.websock.close()                   //离开路由之后断开websocket连接
//     clearTimeout(this.reconnectData);      //离开清除 timeout
//     clearTimeout(this.timeoutObj);         //离开清除 timeout
//     clearTimeout(this.serverTimeoutObj);   //离开清除 timeout
// }
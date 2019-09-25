<template>
  <div ref="charts" id="container"></div>
</template>

<script>
import Highcharts from "highcharts";
import { getTradesList } from "../views/transaction/request.js";
function activeLastPointToolip(chart) {
  var points = chart.series[0].points;
  chart.tooltip.refresh(points[points.length - 1]);
}
export default {
  data() {
    return {
      chart: null,
      initData: null,
      websock: null
    };
  },
  created() {
    this.initWebSocket("wss://i.qsq.com/wi/ws");
  },
  computed: {
    symbol() {
      return this.$route.params.icon;
    }
  },
  watch: {
    symbol() {
      if (this.websock) {
        this.websock.close();
        this.initWebSocket("wss://i.qsq.com/wi/ws");
        this.getTradesHandle();
      }
    }
  },
  mounted() {
    this.getTradesHandle();
  },
  methods: {
    getTradesHandle() {
      let start = 0;
      // let start = + new Date().setTime()-(30*60*1000);
      let limit = 30;
      let symbol = this.symbol || "xbtc_usdt";
      getTradesList(symbol, { start, limit }).then(res => {
        if (res.data.status === 200) {
          this.initData = res.data.data.reverse();
          this.initData = this.initData.map(item => {
            return {
              x: item[0],
              y: item[item.length - 1]
            };
          });
          Highcharts.setOptions({
            global: {
              useUTC: false
            }
          });
          this.initChart(this.initData);
        }
      });
    },
    initChart(data) {
      const _that = this;
      if (!data) {
        (function() {
          // 生成随机值
          var datatest = [],
            time = new Date().getTime(),
            i;
          for (i = -19; i <= 0; i += 1) {
            datatest.push({
              x: time + i * 1000,
              y: Math.random()
            });
          }
          data = datatest;
        })();
      }
      let container = this.$refs.charts;
      this.chart = Highcharts.chart(container, {
        chart: {
          type: "area",
          marginRight: 50,
          spacingRight: 100,
          events: {
            load: function() {
              let series = this.series[0],
                chart = this;
              activeLastPointToolip(chart);
              let timeFlag = 0;
              _that.websock.onmessage = function(e) {
                let resdata = JSON.parse(e.data);
                if (resdata["type"] === `${_that.symbol}.candle.M1`) {
                  if (timeFlag !== resdata.data[0]) {
                    timeFlag = resdata.data[0];
                    let x = resdata.ts, // 当前时间
                      y = resdata.data[resdata.data.length - 1]; // 收盘价
                    series.addPoint([x, y], true, true);
                    activeLastPointToolip(chart);
                  } else {
                    let x = timeFlag, // 当前时间
                      y = resdata.data[resdata.data.length - 1]; // 收盘价
                    series.animate = false;
                    series.removePoint(29, false);
                    series.addPoint([x, y], true, false);
                    activeLastPointToolip(chart);
                  }
                  // activeLastPointToolip(chart);
                }
              };
            }
          }
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, Highcharts.getOptions().colors[0]],
                [
                  1,
                  Highcharts.Color(Highcharts.getOptions().colors[0])
                    .setOpacity(0)
                    .get("rgba")
                ]
              ]
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },
        title: {
          text: null
        },
        xAxis: {
          type: "datetime"
        },
        yAxis: {
          title: {
            text: null
          },
          opposite: true,
          crosshair: true,
          offset: -24
        },
        credits: {
          enabled: false
        },
        tooltip: {
          crosshair: {
            width: 3,
            color: "green"
          },
          formatter: function() {
            return Highcharts.numberFormat(this.y, 2);
          }
        },
        legend: {
          enabled: false
        },
        series: [
          {
            name: "随机数据",
            data: data,
            marker: false
          }
        ]
      });
    },
    initWebSocket(wsurl) {
      this.websock = new WebSocket(wsurl);
      this.websock.onopen = this.websocketonopen; //连接成功
      // this.websock.onmessage = this.websocketonmessage; //广播成功
      this.websock.onerror = this.websocketonerror; //连接断开，失败
      this.websock.onclose = this.websocketclose; //连接关闭
    }, //初始化weosocket
    websocketonopen() {
      let symbol = this.symbol || "xbtc_usdt";
      this.websocketsend({
        event: "subscribe",
        channel: `${symbol}.candle.M1`
      });
    }, //连接成功
    websocketonerror() {
      // console.log("连接失败");
    }, //连接失败
    websocketclose() {
      // console.log("断开连接");
    }, //各种问题导致的 连接关闭
    //数据发送
    websocketsend(data) {
      this.websock.send(JSON.stringify(data));
    }
  },
  beforeDestroy() {
    this.cahrt && this.chart.destroy();
    this.websock && this.websock.close();
  }
};
</script>

<style lang="less" scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>
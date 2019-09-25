<template>
  <div class="progress">
    <canvas ref="progress-canvas"></canvas>
    <p class="progress-poptip" v-text="percent+'%'"></p>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newValue) {
      this.drawProgress(newValue);
    }
  },
  methods: {
    drawProgress(percent) {
      let canvas = this.$refs['progress-canvas'];
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      let ctx = canvas.getContext('2d'),
        width = canvas.clientWidth,
        height = canvas.clientHeight,
        normalLineWidth = 5,
        activeLineWidth = 6,
        radius = width > height ? Math.floor((height - activeLineWidth) / 2) : Math.floor((width - activeLineWidth) / 2);
      function drawNormalCircle() {
        ctx.save();
        ctx.strokeStyle = 'rgb(234, 238, 242)';
        ctx.lineWidth = normalLineWidth;
        ctx.beginPath();
        ctx.arc(radius + activeLineWidth / 2, radius + activeLineWidth / 2, radius, 0, Math.PI*2, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
      function drawActiveCircle(percent) {
        ctx.save();
        ctx.strokeStyle = 'rgb(45, 183, 245)';
        ctx.lineWidth = activeLineWidth;
        ctx.beginPath();
        ctx.arc(radius + activeLineWidth / 2, radius + activeLineWidth / 2, radius, -Math.PI/2, (Math.PI*2/100)*percent-Math.PI/2, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
      function reDraw(percent) {
        if (radius > 0) {
          ctx.clearRect(0, 0, width, height);
          drawNormalCircle();
          drawActiveCircle(percent);
        }
      }
      reDraw(percent);
    }
  }
}
</script>

<style lang="scss" scoped>
.progress {
  position: relative;
  width: 100%;
  height: 100%;
  & > canvas {
    width: 100%;
    height: 100%;
  }
  .progress-poptip {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    transform: translateY(40%);
  }
}
</style>

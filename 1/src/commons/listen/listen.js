export function pullToRefresh(ele) {
  window.addEventListener('touchmove', function(e) {
    e.preventDefault();
  })
  ele.prototype.touchEventStart = function() {
    var that = this;
    return function(e) {
      if (that.is) {}
    }
  }
}

export function longPress(ele, handleLongPress, handleClcikPress) {
  let timeOutEvent = null,
    longPress = false;

  ele.addEventListener('touchstart', function(e) {
    clearTimeout(timeOutEvent);
    timeOutEvent = null;

    timeOutEvent = setTimeout(function() {
      longPress = true;
      clearTimeout(timeOutEvent);
      timeOutEvent = null;
      handleLongPress(e.target.dataset.title, e.target.dataset.name, e.target.dataset.unit);
    }, 300);
  })

  ele.addEventListener('touchmove', function(e) {
    clearTimeout(timeOutEvent);
    timeOutEvent = null;
  })

  ele.addEventListener('touchend', function(e) {
    clearTimeout(timeOutEvent);
    timeOutEvent = null;
    if (!longPress && e.target.dataset.title)
      handleClcikPress(e.target.dataset.title, e.target.dataset.name);
    longPress = false;
  })
}

/**
 * 行情页面专用滑动事件
 * @param {*} ele 监听对象
 * @param {*} handleMove 滑动事件
 * @param {*} handleClick 点击事件
 */
export function touchMove(ele, handleMove, handleClick) {
  let startPoint = {x: 0, y: 0},
    endPoint = {x: 0, y: 0},
    movingDirection = 0,
    isMove = true,
    isWork = false;
  ele.addEventListener('touchstart', function(e) {
    if (!isWork && e.target.dataset.login !== 'login') {
      isWork = true;
      startPoint = {x:e.changedTouches[0].screenX, y: e.changedTouches[0].screenY};
      if (e.target.dataset.name) {
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
    if (!isWork && e.target.dataset.login !== 'login') {
      isWork = true;
      e.target.dataset.item !== 'MODIFY' && e.preventDefault();
      endPoint = {x:e.changedTouches[0].screenX, y: e.changedTouches[0].screenY};
      movingDirection = endPoint.x > startPoint.x ? 1 : (endPoint.x < startPoint.x ? -1 : 0);// 1:收起抽屉，0：保持不变，-1：弹出抽屉
      if (isMove) {
        if (movingDirection) {
          handleMove(e.target.dataset.name, movingDirection);
        } else {
          e.target.dataset.item !== 'MODIFY' && handleClick(e.target.dataset.name);
        }
      }
      isMove = true;
      isWork = false;
    }
  })
}
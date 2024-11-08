function loadJSON(type) {
    var urls = {
        'basic': 'https://gh-proxy.com/https://raw.githubusercontent.com/Snoopy1866/LiTiaotiao-Custom-Rules/main/BasicRules.json',
        'all': 'https://gh-proxy.com/https://raw.githubusercontent.com/Snoopy1866/LiTiaotiao-Custom-Rules/main/AllRules.json',
        'basic_backup': 'https://cdn.jsdelivr.net/gh/Snoopy1866/LiTiaotiao-Custom-Rules/BasicRules.json',
        'all_backup': 'https://cdn.jsdelivr.net/gh/Snoopy1866/LiTiaotiao-Custom-Rules/AllRules.json'
    };
    var url = urls[type];
    var ruleName = type === 'basic' ? '基础规则' : type === 'all' ? '全部规则' : type === 'basic_backup' ? '基础规则备份' : '全部规则备份';

    var ruleType = document.getElementById('rule-type');
    ruleType.innerHTML = `<b>当前选择的是<span class="highlight">${ruleName}</span></b>`;

    var cachedData = localStorage.getItem(url);
    var cacheTime = localStorage.getItem(url + '-time');
    var now = new Date().getTime();
    if (cachedData && cacheTime && (now - cacheTime < 10 * 60 * 1000)) {
        var diff = Math.round((now - cacheTime) / 1000);
        var size = Math.round(cachedData.length / 1024);
        console.log(`从缓存中加载数据：${ruleName}，已缓存时间：${diff}秒，大小：${size}KB`);
        document.getElementById('json-text').value = cachedData;
    } else {
        console.log(`请求数据：${ruleName}`);
        fetch(url)
            .then(response => {
                console.log(`响应状态码：${response.status}`);
                return response.text();
            })
            .then(data => {
                localStorage.setItem(url, data);
                localStorage.setItem(url + '-time', now);
                var size = Math.round(data.length / 1024);
                console.log(`缓存数据：${ruleName}，大小：${size}KB`);
                document.getElementById('json-text').value = data;
            });
    }

if (type === 'basic' || type === 'all') {
    var backupButton = document.createElement('button');
    backupButton.innerHTML = type === 'basic' ? '基础规则（JsDelivr）' : '全部规则（JsDelivr）';
    backupButton.className = 'backup'; 
    backupButton.onclick = function() {
        loadJSON(type + '_backup');
    };
    ruleType.appendChild(backupButton);
    }
}

function copyText() {
    var text = document.getElementById('json-text');
    text.select();
    document.execCommand('copy');

    var message = document.getElementById('copy-message');
    message.textContent = '文本已成功复制到剪贴板中！';

    setTimeout(function() {
        message.textContent = '';
    }, 8000);
}

window.addEventListener('beforeunload', function() {
    localStorage.clear();
});

// https://github.com/ColdDay/click-colorful
(function (win, doc) {
  "use strict";
  var defaultParams = {
    colors: ['#eb125f', '#6eff8a', '#6386ff', '#f9f383'],
    size: 10,
    maxCount: 30
  }
  function colorBall(params) {
    this.params = Object.assign({}, defaultParams, params)
  }
  function getOneRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function _run(ball) {
    var randomXFlag = Math.random() > 0.5
    var randomYFlag = Math.random() > 0.5
    var randomX = parseInt(Math.random() * 160);
    var randomY = parseInt(Math.random() * 160);
    if (randomXFlag) {
      randomX = randomX * -1;
    }
    if (randomYFlag) {
      randomY = randomY * -1
    }
    var transform = 'translate3d(' + randomX + 'px,' + randomY + 'px, 0) scale(0)';
    ball.style.webkitTransform = transform;
    ball.style.MozTransform = transform;
    ball.style.msTransform = transform;
    ball.style.OTransform = transform;
    ball.style.transform = transform;
  }
  colorBall.prototype.fly = function (x, y, playCount, loopTimer) {
    if (!loopTimer) loopTimer = 300
    var ballElements = []
    var fragment = document.createDocumentFragment()

    var ballNum = this.params.maxCount;
    if (playCount) {
      ballNum = ballNum * playCount;
    }
    var loop = 0
    for (var i = 0; i < ballNum; i++) {
      var curLoop = parseInt(i / this.params.maxCount)
      var ball = doc.createElement('i');
      ball.className = 'color-ball ball-loop-' + curLoop;
      var blurX = Math.random() * 10
      if (Math.random() > 0.5) blurX = blurX * -1
      var blurY = Math.random() * 10
      if (Math.random() > 0.5) blurY = blurY * -1
      ball.style.left = (x) + 'px';
      ball.style.top = (y) + 'px';
      ball.style.width = this.params.size + 'px';
      ball.style.height = this.params.size + 'px';
      ball.style.position = 'fixed';
      ball.style.borderRadius = '1000px';
      ball.style.boxSizing = 'border-box';
      ball.style.zIndex = 9999;
      ball.style.opacity = 0;
      if (curLoop === 0) ball.style.opacity = 1;
      ball.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
      ball.style.webkitTransform = 'translate3d(0px, 0px, 0px) scale(1)';
      ball.style.transition = 'transform 1s ' + curLoop * loopTimer / 1000 + 's ease-out';
      ball.style.webkitTransition = 'transform 1s ' + curLoop * loopTimer / 1000 + 's ease-out';
      ball.style.backgroundColor = getOneRandom(this.params.colors);
      fragment.appendChild(ball);
      ballElements.push(ball)
      if (curLoop !== loop) {
        (function (num) {
          setTimeout(function () {
            var loopBalls = document.getElementsByClassName('ball-loop-' + num)
            for (var j = 0; j < loopBalls.length; j++) {
              loopBalls[j].style.opacity = 1
            }
            if (num === loop) {
              _clear(ballElements)
            }
          }, num * loopTimer + 30)
        })(curLoop)
        loop = curLoop
      }
    }

    doc.body.appendChild(fragment);
    !playCount && _clear(ballElements)
    setTimeout(function () {
      for (var i = 0; i < ballElements.length; i++) {
        _run(ballElements[i])
      }
    }, 10)
  }
  function _clear(balls) {
    setTimeout(function () {
      for (var i = 0; i < balls.length; i++) {
        doc.body.removeChild(balls[i])
      }
    }, 1000)

  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = colorBall;
  };
  if (typeof define === 'function') define(function () {
    return colorBall;
  });
  win.colorBall = colorBall;
})(window, document)

window.addEventListener(
  "mouseup",
  function (e) {
    var color = new colorBall();
    color.fly(e.clientX, e.clientY);
  },
)

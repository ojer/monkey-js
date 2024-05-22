// ==UserScript==
// @name        就不登录-bilibili
// @namespace   github.com/ojer
// @match       https://www.bilibili.com/video/**
// @run-at      document-end
// @author      ojer
// @version     1.06
// @description  关闭播放 60 秒后的登录框并继续播放
// @license     MIT
// @grant       none
// ==/UserScript==

unsafeWindow.dataScreen = undefined
unsafeWindow.biliScriptActive = 1
unsafeWindow.foo = 1
let nIntervId = 0

const callback = (mutationsList) => {
  const typeChildList = 'childList'
  const loginDiaClass = 'bili-mini-mask'
  mutationsList.forEach(({
    type,
    addedNodes
  }) => {
    if (type !== typeChildList) {
      return
    }

    for (const addedNode of addedNodes) {
      if (!addedNode instanceof HTMLElement) {
        return
      }
      if (!addedNode.classList) {
        return
      }
      if (!addedNode.classList.contains(loginDiaClass)) {
        return
      }
      unsafeWindow.foo = 0
      document.querySelector('.bili-mini-close-icon').click()
      setTimeout(() => {
        switch(unsafeWindow.dataScreen){
          case 'full':
            // document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-full').click()
            // break
          case 'web':
            document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-web').click()
            break
          case 'wide':
            document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-wide').click()
            break
          case 'normal':
            break
          default:
        }
        if (unsafeWindow.biliScriptActive === 1) {
          unsafeWindow.player.play()
          unsafeWindow.biliScriptActive = 0
        }
        unsafeWindow.foo = 1
      }, 500)
      break
    }
  })
}

const intervalCallback = () => {
  const container = document.querySelector('#bilibili-player .bpx-player-container.bpx-state-paused')
  const video = document.querySelector('#bilibili-player video')
  if (!container || !video) {
    return
  }
  new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutations) => {
      unsafeWindow.biliScriptActive = 1
    })
  }).observe(video, {
    attributeFilter: ['src']
  })

  new MutationObserver((mutationsList) => {
    mutationsList.forEach(({target, oldValue }) => {
      setTimeout(() => {
        if (unsafeWindow.foo === 1) {
          unsafeWindow.dataScreen = target.dataset.screen
        }
      },300)
    })
  }).observe(container, {
    attributeFilter: ['data-screen'],
    attributeOldValue: true
  })
  clearInterval(nIntervId)
}

nIntervId = setInterval(intervalCallback, 500)

setTimeout(() => {
  new MutationObserver(callback).observe(document.body, {
    childList: true
  })
}, 55e3)


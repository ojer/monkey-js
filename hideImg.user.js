// ==UserScript==
// @name        HideImg
// @license     MIT
// @namespace   ojer
// @match       *://*/*
// @version     1.42
// @author      ojer
// @description 隐藏图片
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addElement
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addValueChangeListener
// @require     https://unpkg.com/@violentmonkey/shortcut@1.4.1/dist/index.js
// ==/UserScript==

let hImg = undefined
const { register } = VM.shortcut
const HI_STATUS = 'HI_STATUS'
const dataId = 'vm-hide-img'

const captionKey = 'Hide/Show Img(Ctrl+Shift+I)'

class Himg {
  state
  stateOn
  stateOff

  constructor(on) {
    this.stateOn = new StateOn(this)
    this.stateOff = new StateOff(this)
    this.setState(on)
  }

  setState(on) {
    this.state = on ? this.stateOn : this.stateOff
  }

  switchMode() {
    this.state.switchMode()
  }
}

class State {
  msg(context) {
    const div = document.createElement('div')
    div.innerText = context
    div.setAttribute(
      'style',
      `
      padding: 5px 20px;
      color: #FFF;
      background: #303133;
      border: solid 1px #909399;
      border-radius: 5px;
      z-index: 9999999;
      position: fixed;
      top: 30px;
      right: 50%;
      transform: translateX(50%);
      `
    )
    document.body.prepend(div)
    setTimeout(() => {
      try {
        div.remove()
      } catch (ignore) {}
    }, 1500)
  }
}

class StateOn extends State {
  hImg
  constructor(hImg) {
    super()
    this.hImg = hImg
  }

  switchMode() {
    const content = `* { background-image: url("data:,") !important; } img,video{ visibility: hidden !important; }`
    const ele = GM_addElement(document.head, 'style', content)
    ele.setAttribute('data-id', dataId)
    super.msg('Img Hide')
  }
}

class StateOff extends State {
  hImg
  constructor(hImg) {
    super()
    this.hImg = hImg
  }

  switchMode() {
    document.querySelectorAll('style[data-id="' + dataId + '"]').forEach((e) => e.remove())
    super.msg('Img Show')
  }
}

const updateVal = () => {
  GM_setValue(HI_STATUS, !GM_getValue(HI_STATUS))
}

GM_addValueChangeListener(HI_STATUS, (name, oldValue, newValue, remote) => {
  hImg.setState(newValue)
  hImg.switchMode()
})

GM_registerMenuCommand(captionKey, updateVal)

register('c-s-i', () => {
  updateVal()
})

hImg = new Himg(GM_getValue(HI_STATUS, undefined))
hImg.switchMode()

if (0 || window.location.href.includes('www.baidu.com/s?')) {
  new MutationObserver((mutationsList, observer) => {
    if (!document.querySelector('style[data-id="' + dataId + '"]') && GM_getValue(HI_STATUS)) {
      console.log('observer check')
      hImg.switchMode()
    }
  }).observe(document.body, {
    childList: true
  })
}

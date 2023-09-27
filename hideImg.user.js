// ==UserScript==
// @name        HideImg
// @namespace   ojer
// @match       *://*/*
// @version     1.0
// @author      ojer
// @description 隐藏图片
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addValueChangeListener
// @require     https://unpkg.com/@violentmonkey/shortcut@1.4.1/dist/index.js
// ==/UserScript==

const { register } = VM.shortcut

const styleHide = 'visibility: hidden !important;'

const dataKey = 'HI_IS_HIDE'
const captionHideKey = 'HideImg (Ctrl+Shift+I)'
const captionShowKey = 'ShowImg (Ctrl+Shift+I)'

const hide = () => {
  regMenu(true)
  document.querySelectorAll('img,video').forEach((item) => {
    item.style = item.getAttribute('style') + ';' + styleHide
  })
}

const show = () => {
  regMenu(false)
  document.querySelectorAll('img,video').forEach((item) => {
    let style = item.getAttribute('style')
    if (style) {
      item.style = style.replaceAll(styleHide, '')
    }
  })
}

const listenerId = GM_addValueChangeListener(dataKey, (name, oldValue, newValue, remote) => {
  console.log(oldValue, newValue)
  if (oldValue && !newValue) {
    show()
  } else if (!oldValue && newValue) {
    hide()
  }
})
const regMenu = (isShow) => {
  GM_unregisterMenuCommand(isShow ? captionHideKey : captionShowKey)
  GM_registerMenuCommand(isShow ? captionShowKey : captionHideKey, () => {
    GM_setValue(dataKey, !isShow)
  })
}

register('c-s-i', () => {
  GM_setValue(dataKey, !GM_getValue(dataKey))
})

const main = () => {
  if (GM_getValue(dataKey, undefined) === undefined) {
    GM_setValue(dataKey, true)
  }
  if (GM_getValue(dataKey)) {
    hide()
  } else {
    show()
  }
}
main()

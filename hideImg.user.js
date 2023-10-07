// ==UserScript==
// @name        HideImg
// @namespace   ojer
// @match       *://*/*
// @version     1.1
// @author      ojer
// @description 隐藏图片
// @description 1.1 隐藏背景图片
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addValueChangeListener
// @require     https://unpkg.com/@violentmonkey/shortcut@1.4.1/dist/index.js
// ==/UserScript==

const { register } = VM.shortcut

const HI_STATUS = 'HI_STATUS'
const HI_STYLE_ID = 'HI_STYLE_ID'

const captionHideKey = 'HideImg (Ctrl+Shift+I)'
const captionShowKey = 'ShowImg (Ctrl+Shift+I)'
const styleHide = 'visibility: hidden !important;'
const styleBkImgHIde = '* {background-image: url("data:,") !important; }'

const hide = () => {
  regMenu(true)
  GM_addStyle(styleBkImgHIde).then((el) => {
    GM_setValue(HI_STYLE_ID, el.getAttribute('id'))
  })
  document.querySelectorAll('img,video').forEach((item) => {
    item.style = item.getAttribute('style') + ';' + styleHide
  })
}

const show = () => {
  regMenu(false)
  try {
    document.getElementById(GM_getValue(HI_STYLE_ID)).remove()
  } catch (ignore) {}
  document.querySelectorAll('img,video').forEach((item) => {
    const style = item.getAttribute('style')
    if (style) {
      item.style = style.replaceAll(styleHide, '')
    }
  })
}

// const listenerId =
GM_addValueChangeListener(HI_STATUS, (name, oldValue, newValue, remote) => {
  if (oldValue && !newValue) {
    show()
  } else if (!oldValue && newValue) {
    hide()
  }
})
const regMenu = (isShow) => {
  GM_unregisterMenuCommand(isShow ? captionHideKey : captionShowKey)
  GM_registerMenuCommand(isShow ? captionShowKey : captionHideKey, () => {
    GM_setValue(HI_STATUS, !isShow)
  })
}

register('c-s-i', () => {
  GM_setValue(HI_STATUS, !GM_getValue(HI_STATUS))
})

const main = () => {
  if (GM_getValue(HI_STATUS, undefined) === undefined) {
    GM_setValue(HI_STATUS, true)
  }
  if (GM_getValue(HI_STATUS)) {
    hide()
  } else {
    show()
  }
}
main()

// ==UserScript==
// @name        HideImg
// @namespace   ojer
// @match       *://*/*
// @version     1.2
// @author      ojer
// @description 隐藏图片
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

const captionHideKey = 'HideImg (Ctrl+Shift+I)'
const captionShowKey = 'ShowImg (Ctrl+Shift+I)'
const styleBkImgHIde = `
* { background-image: url("data:,") !important; }
img,video{ visibility: hidden !important; }
`

const hide = () => {
  regMenu(true)
  GM_addStyle(styleBkImgHIde)
}

const show = () => {
  regMenu(false)
  Array.from(document.querySelectorAll('style'))
    .filter((e) => e.id.startsWith('VMst0.'))
    .forEach((e) => e.remove())
}

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
    GM_setValue(HI_STATUS, false)
  }
  if (GM_getValue(HI_STATUS)) {
    hide()
  } else {
    show()
  }
}
main()

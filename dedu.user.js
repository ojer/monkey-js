// ==UserScript==
// @license     MIT
// @name        dedu
// @namespace   ojer
// @match       https://www.baidu.com/s
// @grant       GM_addElement
// @runat       document-end
// @version     1.31
// @author      ojer
// @description 去除百度搜索结果重定向,去除热榜,去除部分百度系推广
// ==/UserScript==

const dataId = 'vm-ojer-dedu'
const addStyle = () => {
  const content = `
  #content_right{
    display: none !important;
  }

  #content_left > div:not([id]) {
    display: none !important;
  }

  #content_left > div[tpl="short_video"],div[tpl="news-realtime"],div[tpl="bjh_addressing"],div[tpl="recommend_list"] {
    display: none !important;
  }

  #content_left > div[mu^="https://baijiahao.baidu.com/s"] {
    display: none !important;
  }
  `
  const ele = GM_addElement(document.head, 'style', content)
  ele.setAttribute('data-id', dataId)
}

const main = (s) => {
  setTimeout(addStyle())
  setTimeout(() => {
    const left = document.getElementById('content_left')
    if (left) {
      const childrenElements = left.children
      for (var i = childrenElements.length - 1; i > -1; i--) {
        const fc = childrenElements[i]
        if (fc.querySelector('a.m.c-gap-left')) {
          fc.remove()
          continue
        }
        try {
          const href = fc.getAttribute('mu')
          if (href) {
            fc.querySelectorAll('a').forEach((a) => a.setAttribute('href', href))
          }
        } catch (ignore) {}
      }
    }
  }, s)
}

new MutationObserver((mutationsList, observer) => {
  if (!document.querySelector('style[data-id="' + dataId + '"]')) {
    main(800)
  }
}).observe(document.body, {
  childList: true
})

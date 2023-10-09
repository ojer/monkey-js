// ==UserScript==
// @name        dedu
// @namespace   ojer
// @match       https://www.baidu.com/s
// @grant       GM_addStyle
// @runat       document-end
// @version     1.0
// @author      ojer
// @description 去除百度搜索结果重定向,去除热榜,去除部分百度系推广
// ==/UserScript==

const addStyle = () => {
  GM_addStyle(
    `
  /* 热点 */
  #content_right{
    display: none !important;
  }

  /* 推广 */
  #content_left > div:not([id]) {
    display: none !important;
  }


  /* 广告 */
  #content_left > div:has(.c-gap-left) {
    display: none !important;
  }


  /* 视频 */
  #content_left > div[tpl="short_video"],div[tpl="news-realtime"],div[tpl="bjh_addressing"],div[tpl="recommend_list"] {
    display: none !important;
  }

  /* 百家号 */
  #content_left > div[mu^="https://baijiahao.baidu.com/s"] {
    display: none !important;
  }
  `
  )
}

setTimeout(() => {
  addStyle()
  const left = document.getElementById('content_left')
  if (left) {
    const childrenElements = left.children
    for (var i = 0; i < childrenElements.length; i++) {
      const fc = childrenElements[i]
      try {
        const href = fc.getAttribute('mu')
        const h3 = fc.querySelector('h3')
        const a = h3.querySelector('a')
        a.setAttribute('href', href)
      } catch (e) {}
    }
  }
}, 1500)

addStyle()

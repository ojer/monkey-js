// ==UserScript==
// @name        就不登录-bilibili
// @license MIT
// @namespace   github.com/ojer
// @match       https://www.bilibili.com/video/**
// @grant       none
// @version     1.06
// @author      ojer
// @description  关闭播放 60 秒后的登录框并继续播放
// ==/UserScript==

const loginDiaClass = 'bili-mini-mask'

const webFullBtnClass = '.bpx-player-ctrl-btn.bpx-player-ctrl-web'

const observerOptions = {
	childList: true,
	subtree: false
}
let observer = {}
const targetNode = document.body
unsafeWindow.biliScriptActive = 1

setTimeout(() => {
	const videoHeight = document.querySelector('video').offsetHeight
	observer = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				for (const addedNode of mutation.addedNodes) {
					if (addedNode instanceof HTMLElement && addedNode.classList.contains(loginDiaClass)) {
						document.querySelector('.bili-mini-close-icon').click()
						setTimeout(() => {
							const innerHeight = document.querySelector('video').offsetHeight
							if (innerHeight < videoHeight) {
								unsafeWindow.biliScriptActive = 1
								document.querySelector(webFullBtnClass).click()
							}
							if (unsafeWindow.biliScriptActive === 1) {
								// const _timeout = window.setTimeout
								// window.setTimeout = function(handler, timeout, ...args) {
								//  return _timeout.call(window, handler, timeout, ...args);
								// }
								unsafeWindow.player.play()
								unsafeWindow.biliScriptActive = 0
							}
						}, 500)
						//  observer.disconnect()
						break
					}
				}
			}
		}
	})
	observer.observe(targetNode, observerOptions)
}, 55e3)

unsafeWindow.addEventListener('popstate', () => {
	unsafeWindow.biliScriptActive = 1
})

// ==UserScript==
// @name        就不登录-zhihu
// @license MIT
// @namespace   github.com/ojer
// @match       http*://*.zhihu.com/**
// @grant       GM_addStyle
// @version     1.4
// @author      ojer
// @description 关闭登录弹框 
// ==/UserScript==

GM_addStyle(`
	html{
		overflow: scroll !important;
	}

	header.AppHeader {
		display: none !important;
	}
	.Modal-wrapper,.Modal-enter-done{
		display: none !important;
	}
`)



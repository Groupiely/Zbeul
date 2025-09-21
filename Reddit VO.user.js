// ==UserScript==
// @name         Reddit VO
// @namespace   Violentmonkey Scripts
// @version      1.1
// @description  Delete ?tl from Reddit URL
// @author       Groupiely, from Ja_Shi script idea (https://pastebin.com/GkvLgsz9)
// @match        *://*.reddit.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    let url = new URL(window.location.href);
    if (url.searchParams.has('tl')) {
        url.searchParams.delete('tl');
        window.location.replace(url.toString());
    }
})();
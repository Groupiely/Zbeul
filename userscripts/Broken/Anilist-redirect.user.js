// ==UserScript==
// @name         Anilist Redirect to MAL
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Redirect Manga/Anime links from Anilist to MAL
// @author       Groupiely
// @match        *://anilist.co/anime/*
// @match        *://anilist.co/manga/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';
  var currentURL = window.location.href;
  var newURL = currentURL.replace(/anilist\.co\/(anime|manga)\/(\d+)\/.*/, "myanimelist.net/$1/$2");
  if (currentURL != newURL) {
    window.location.replace(newURL);
  }
})();
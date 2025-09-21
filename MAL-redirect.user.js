// ==UserScript==
// @name         MyAnimeList Redirect to Anilist
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Redirect Manga/Anime links from MAL to Anilist
// @author       Groupiely
// @match        *://myanimelist.net/anime/*
// @match        *://myanimelist.net/manga/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';
  var currentURL = window.location.href;
  var newURL = currentURL.replace(/myanimelist\.net\/(anime|manga)\/(\d+)\/.*/, "anilist.co/$1/$2");
  if (currentURL != newURL) {
    window.location.replace(newURL);
  }
})();
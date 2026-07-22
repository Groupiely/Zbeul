// ==UserScript==
// @name         Anilist Streaming Links (Improved)
// @namespace    https://github.com/Groupiely/Zbeul
// @version      1.0.0
// @description  Injects streaming platform links into the Anilist anime page navigation bar.
// @author       Groupiely
// @match        https://anilist.co/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @updateURL    https://raw.githubusercontent.com/Groupiely/Zbeul/main/userscripts/anilist/userscript-pro.user.js
// @downloadURL  https://raw.githubusercontent.com/Groupiely/Zbeul/main/userscripts/anilist/userscript-pro.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ─── Constants ────────────────────────────────────────────────────────────

    const CONTAINER_ID   = 'anilist-streaming-inject';
    const POLL_INTERVAL  = 100;  // ms — DOM readiness polling
    const POLL_MAX       = 60;   // max attempts = 6s timeout
    const URL_CHECK_MS   = 500;  // ms — SPA navigation check

    // More specific selector to avoid matching arbitrary .nav elements on the page
    // Confirmed from live debug: anime tabs are in div.nav inside div.content
    const NAV_SELECTOR   = '.content .nav';

    const GQL_ENDPOINT   = 'https://graphql.anilist.co';

    const GQL_QUERY = `
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                externalLinks {
                    url
                    site
                    icon
                    color
                    type
                }
            }
        }
    `;

    // ─── State ────────────────────────────────────────────────────────────────

    let lastUrl      = location.href;
    let urlCheckId   = null;  // stored so we can stop it if needed
    let domPollId    = null;  // stored so we can cancel an in-progress poll

    // ─── API ──────────────────────────────────────────────────────────────────

    /**
     * Fetches streaming-type external links for a given Anilist anime ID.
     * Returns an array of link objects, or an empty array on failure.
     * @param {number} animeId
     * @returns {Promise<Array>}
     */
    async function fetchStreamingLinks(animeId) {
        let response;
        try {
            response = await fetch(GQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: GQL_QUERY,
                    variables: { id: parseInt(animeId, 10) },
                }),
            });
        } catch (networkError) {
            console.warn('[AnilistStreaming] Network error:', networkError);
            return [];
        }

        // Explicit HTTP status check before trying to parse JSON
        if (!response.ok) {
            console.warn(`[AnilistStreaming] API returned HTTP ${response.status}`);
            return [];
        }

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            console.warn('[AnilistStreaming] Failed to parse API response:', parseError);
            return [];
        }

        const links = data?.data?.Media?.externalLinks;
        if (!Array.isArray(links)) return [];

        return links.filter(link => link.type === 'STREAMING');
    }

    // ─── UI ───────────────────────────────────────────────────────────────────

    /**
     * Builds and injects the streaming links container into the nav bar.
     * Silently does nothing if the container already exists or nav is missing.
     * @param {Array} links
     */
    function injectLinks(links) {
        if (!links.length) return;

        // Idempotency guard
        if (document.getElementById(CONTAINER_ID)) return;

        const nav = document.querySelector(NAV_SELECTOR);
        if (!nav) return;

        const container = document.createElement('div');
        container.id = CONTAINER_ID;
        container.setAttribute('aria-label', 'Streaming platforms');
        Object.assign(container.style, {
            display:    'flex',
            alignItems: 'center',
            gap:        '20px',
            marginLeft: '32px',
        });

        for (const link of links) {
            container.appendChild(buildLinkElement(link));
        }

        nav.appendChild(container);
    }

    /**
     * Builds a single styled anchor element for a streaming platform.
     * @param {{ url: string, site: string, icon: string|null, color: string|null }} link
     * @returns {HTMLAnchorElement}
     */
    function buildLinkElement(link) {
        const brandColor = link.color || '#3db4f2';

        const a = document.createElement('a');
        a.href   = link.url;
        a.target = '_blank';
        a.rel    = 'noopener noreferrer';
        a.title  = `Watch on ${link.site}`;
        Object.assign(a.style, {
            display:        'flex',
            alignItems:     'center',
            textDecoration: 'none',
            color:          '#fff',
            fontSize:       '1.3rem',
            fontWeight:     '500',
            transition:     'color 0.2s ease',
        });

        a.addEventListener('mouseenter', () => { a.style.color = brandColor; });
        a.addEventListener('mouseleave', () => { a.style.color = '#fff'; });

        if (link.icon) {
            const img = document.createElement('img');
            img.src    = link.icon;
            img.alt    = link.site; // accessibility
            img.width  = 18;
            img.height = 18;
            Object.assign(img.style, {
                marginRight: '7px',
                borderRadius: '3px',
                // Prevents broken image icons from breaking the layout
                objectFit: 'contain',
            });
            a.appendChild(img);
        }

        const label = document.createElement('span');
        label.textContent = link.site;
        a.appendChild(label);

        return a;
    }

    // ─── Core logic ───────────────────────────────────────────────────────────

    /**
     * Cancels any in-progress DOM poll to avoid stale operations.
     */
    function cancelPoll() {
        if (domPollId !== null) {
            clearInterval(domPollId);
            domPollId = null;
        }
    }

    /**
     * Extracts the anime ID from the current URL, then polls until the nav
     * is ready, fetches links, and injects them.
     * Cancels itself if navigation changes mid-flight (race condition guard).
     */
    function run() {
        cancelPoll(); // cancel any previous pending run

        const match = location.pathname.match(/^\/anime\/(\d+)/);
        if (!match) return;

        const animeId   = match[1];
        const targetUrl = location.href;
        let attempts    = 0;

        domPollId = setInterval(async () => {
            // Guard: stop if user navigated away before nav was ready
            if (location.href !== targetUrl) {
                cancelPoll();
                return;
            }

            if (!document.querySelector(NAV_SELECTOR)) {
                attempts++;
                if (attempts >= POLL_MAX) {
                    console.warn('[AnilistStreaming] Nav element not found after timeout.');
                    cancelPoll();
                }
                return;
            }

            // Nav is ready — stop polling and fetch
            cancelPoll();

            const links = await fetchStreamingLinks(animeId);

            // Final race condition guard after the async fetch
            if (location.href === targetUrl) {
                injectLinks(links);
            }
        }, POLL_INTERVAL);
    }

    // ─── SPA Navigation Detection ─────────────────────────────────────────────

    // A single persistent interval to detect Vue/Nuxt SPA route changes.
    // We keep the reference so it could be cleared on page unload if needed.
    urlCheckId = setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;

            // Clean up previous injection
            const old = document.getElementById(CONTAINER_ID);
            if (old) old.remove();

            run();
        }
    }, URL_CHECK_MS);

    // Clean up on page unload to be a good citizen
    window.addEventListener('unload', () => {
        clearInterval(urlCheckId);
        cancelPoll();
    });

    // ─── Entry point ──────────────────────────────────────────────────────────

    run();

})();

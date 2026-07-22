// ==UserScript==
// @name         Anilist Streaming Links
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds streaming platform icons to the top of Anilist anime pages.
// @author       Antigravity
// @match        https://anilist.co/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    const query = `
    query ($id: Int) {
      Media (id: $id) {
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

    async function fetchStreamingLinks(animeId) {
        try {
            const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: { id: parseInt(animeId) }
                })
            });
            const data = await response.json();
            if (data?.data?.Media?.externalLinks) {
                // Return only links of type STREAMING
                return data.data.Media.externalLinks.filter(link => link.type === 'STREAMING');
            }
        } catch (e) {
            console.error('Anilist Streaming Links Script: Error fetching data:', e);
        }
        return [];
    }

    function injectLinks(links) {
        if (!links || links.length === 0) return;

        // Prevent adding multiple instances
        if (document.getElementById('custom-anilist-streaming-container')) return;

        // Confirmed from live debug: anime tabs are in div.nav inside div.content
        const nav = document.querySelector('.content .nav');
        if (!nav) return;

        const container = document.createElement('div');
        container.id = 'custom-anilist-streaming-container';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '25px';
        container.style.marginLeft = '40px'; // Add some space after "Social"

        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.style.display = 'flex';
            a.style.alignItems = 'center';
            a.style.textDecoration = 'none';
            // Use white text to match the mockup
            a.style.color = '#fff';
            a.style.fontSize = '1.3rem';
            a.style.fontWeight = '500';
            a.style.transition = 'color 0.2s';
            
            // Hover effect: change text to the platform's brand color
            a.onmouseenter = () => a.style.color = link.color || '#3db4f2';
            a.onmouseleave = () => a.style.color = '#fff';

            if (link.icon) {
                const img = document.createElement('img');
                img.src = link.icon;
                img.style.width = '18px';
                img.style.height = '18px';
                img.style.marginRight = '8px';
                img.style.borderRadius = '2px';
                a.appendChild(img);
            }

            const span = document.createElement('span');
            span.innerText = link.site;
            a.appendChild(span);

            container.appendChild(a);
        });

        // Append to the end of the navigation bar
        nav.appendChild(container);
    }

    async function run() {
        const match = location.pathname.match(/^\/anime\/(\d+)/);
        if (match) {
            const animeId = match[1];
            const targetUrl = location.href;
            // Wait for the DOM elements to appear (handles SPA loading times)
            let attempts = 0;
            const checkDOM = setInterval(async () => {
                // Wait for the nav element, since that's where we insert the links
                if (document.querySelector('.content .nav')) {
                    clearInterval(checkDOM);
                    const links = await fetchStreamingLinks(animeId);
                    // Prevent race condition: check if we are still on the same page
                    if (location.href === targetUrl) {
                        injectLinks(links);
                    }
                }
                attempts++;
                if (attempts > 50) clearInterval(checkDOM); // Timeout after 5 seconds
            }, 100);
        }
    }

    // Since Anilist is an SPA (Nuxt/Vue), the URL changes without a full page reload.
    // We use a lightweight interval to check for URL changes. This is much more 
    // performant than observing all DOM mutations on document.body.
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            const oldContainer = document.getElementById('custom-anilist-streaming-container');
            if (oldContainer) oldContainer.remove();
            run();
        }
    }, 500);

    // Initial trigger
    run();

})();

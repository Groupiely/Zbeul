// ==UserScript==
// @name        AniList: MAL external link
// @namespace   your-namespace
// @version     1.0
// @description Adds a "MAL" button with a link to the corresponding MyAnimeList page on AniList.
// @author      Groupiely
// @match       https://anilist.co/anime/*
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// ==/UserScript==

(function () {
    'use strict';

    function convertAniListNameToMALName(aniListName) {
        return aniListName.replace(/ /g, '_');
    }

    function addMALButton(aniListID, malID, malName) {
        const externalLinksSection = document.querySelector('.external_links');
        if (externalLinksSection) {
            const malButton = document.createElement('a');
            malButton.href = `https://myanimelist.net/anime/${malID}/${malName}`;
            malButton.textContent = 'MAL';
            malButton.classList.add('button'); // You might want to add styling to match AniList buttons

            const listItem = document.createElement('li');
            listItem.appendChild(malButton);
            externalLinksSection.appendChild(listItem);
        }
    }

    function fetchMALID(aniListID, aniListNameRomaji) {
        // Utilisation de l'API AniList pour récupérer les liens externes,
        // qui incluent parfois le lien MAL.
        const query = `
            query ($id: Int) {
                Media(id: $id, type: ANIME) {
                    externalLinks {
                        site
                        url
                    }
                }
            }
        `;

        const variables = {
            id: aniListID
        };

        GM_xmlhttpRequest({
            url: 'https://graphql.anilist.co',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: JSON.stringify({ query: query, variables: variables }),
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.data && data.data.Media && data.data.Media.externalLinks) {
                        const malLink = data.data.Media.externalLinks.find(link => link.site === 'MyAnimeList');
                        if (malLink) {
                            // Extraire l'ID et le nom de l'URL MAL
                            const malURLParts = malLink.url.split('/');
                            const malID = malURLParts[4];
                            const malName = malURLParts[5];
                            if (malID) {
                                addMALButton(aniListID, malID, malName || convertAniListNameToMALName(aniListNameRomaji));
                                return; // Exit la fonction si l'ID MAL est trouvé via l'API
                            }
                        }
                    }
                    // Si l'ID MAL n'est pas trouvé dans les liens externes,
                    // on pourrait potentiellement essayer une recherche (plus complexe et moins fiable).
                    // Pour cette version simple, on s'arrête ici si on ne trouve pas le lien direct.
                    const aniListNameForMAL = convertAniListNameToMALName(aniListNameRomaji);
                    // Si on voulait tenter une recherche (non inclus dans cette version de base):
                    // console.warn("MyAnimeList link not found in AniList data. Consider implementing a search function.");
                    // En attendant, on ajoute un bouton avec un lien basé sur le nom AniList (moins précis)
                    const currentURLParts = window.location.pathname.split('/');
                    const aniListIDFromURL = currentURLParts[2];
                    const aniListNameFromURL = currentURLParts[3];
                    if (aniListIDFromURL && aniListNameFromURL) {
                        addMALButton(aniListIDFromURL, '', convertAniListNameToMALName(aniListNameFromURL));
                    }
                } catch (error) {
                    console.error("Error processing AniList API response:", error);
                }
            },
            onerror: function (error) {
                console.error("Error fetching AniList data:", error);
            }
        });
    }

    // Observer les changements dans le DOM pour s'assurer que la section des liens externes est chargée
    const observer = new MutationObserver((mutations) => {
        const externalLinksSection = document.querySelector('.external_links');
        if (externalLinksSection && externalLinksSection.children.length > 0) {
            observer.disconnect(); // Arrêter l'observation une fois la section trouvée

            const currentURLParts = window.location.pathname.split('/');
            const aniListID = parseInt(currentURLParts[2]);
            const aniListNameRomaji = currentURLParts[3];

            if (aniListID && aniListNameRomaji) {
                fetchMALID(aniListID, aniListNameRomaji);
            }
        }
    });

    // Commencer l'observation du body ou d'un élément parent qui contient la section des liens externes
    observer.observe(document.body, { childList: true, subtree: true });

})();
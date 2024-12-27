// ==UserScript==
// @name         Redgifs Blacklist + QoL
// @namespace    https://gist.github.com/hazushi3
// @version      1.2
// @description  Filtr postów na stronie redgifs.com po wymienionych w skrypcie tagach, auto włączanie dźwięku pozostałym i wyłączenie ukrytym.
// @author       hazushi3, reworked by jelonek1
// @match        https://www.redgifs.com/*
// @exclude      https://www.redgifs.com/watch/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const blacklist = ["*trans*", "*dick*", "male*", "CBT", "*ladyboy*", "*piss*", "*pee*", "3D", "*femboy*", "*gay*"];
    const regexPatterns = blacklist.map(pattern => new RegExp(`^${pattern.replace(/\*/g, ".*")}$`, "i"));

    // Funkcja do sprawdzania, czy post zawiera zablokowane tagi
    function containsBlacklistedTags(tagTexts) {
        return regexPatterns.some(regex => tagTexts.some(tag => regex.test(tag)));
    }

    // Funkcja do obsługi pojedynczego posta
    function processPost(parentDiv) {
        if (parentDiv.parsed) return; // Jeśli post został już przetworzony, pomijamy

        const tags = parentDiv.querySelectorAll('.tagButton .text');
        const tagTexts = Array.from(tags, tag => tag.textContent.trim().toLowerCase());

        const anyTagPresent = containsBlacklistedTags(tagTexts);

        // Wyłączanie dźwięku dla postów na czarnej liście
        const soundButton = parentDiv.querySelector(".SoundButton");
        if (anyTagPresent && soundButton && soundButton.ariaLabel === "Sound On") {
            soundButton.click();
        }

        // Włączanie dźwięku dla dozwolonych postów
        if (!anyTagPresent && soundButton && soundButton.ariaLabel === "Sound Off") {
            soundButton.click();
        }

        if (anyTagPresent) {
            parentDiv.parsed = true;

            // Ukrycie wideo
            const video = parentDiv.querySelector('.GifPreview > video');
            if (video) {
                video.style.display = "none";
                video.remove();
            }

            // Tworzenie klikalnego obrazu
            const img = parentDiv.querySelector('.GifPreview img');
            if (img) {
                const anchor = document.createElement("a");
                anchor.href = `https://www.redgifs.com/watch/${parentDiv.id.substring(4)}`;
                anchor.target = "_blank";
                anchor.appendChild(img.cloneNode(true));
                img.parentNode.replaceChild(anchor, img);
            }
        }
    }

    // Funkcja główna
    function checkAndHidePosts() {
        const parentDivs = document.querySelectorAll('.GifPreview');
        parentDivs.forEach(processPost);
    }

    // Obserwowanie zmian DOM
    const observer = new MutationObserver(checkAndHidePosts);
    observer.observe(document.body, { childList: true, subtree: true });

    // Pierwsze wywołanie
    window.addEventListener('load', checkAndHidePosts);
})();

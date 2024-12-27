// ==UserScript==
// @name         Redgifs Blacklist + QoL
// @namespace    https://gist.github.com/hazushi3
// @version      1.2 (anty-homo-i-LPG)
// @description  Filtr postów na stronie redgifs.com po wymienionych w skrypcie tagach, auto włączanie dźwięku pozostałym i wyłączenie ukrytym.
// @author       hazushi3, reworked by jelonek1
// @match        https://www.redgifs.com/*
// @exclude      https://www.redgifs.com/watch/*
// @grant        none
// @updateURL    https://gist.github.com/jelonek1/113013fb930101082ee8a764d9f279e6/raw/160e1d6836bb4b22402995d289cf040e9ef728f7/redgifs-blacklist.user.js
// ==/UserScript==

(function() {
    'use strict';
    const blacklist = ["*trans*", "*dick*", "male*", "CBT", "*ladyboy*", "*piss*", "*pee*", "3D", "*femboy*", "*gay*"]; //example tags, it's not case senstive, use * for wildcard
    const regexPatterns = blacklist.map(pattern => new RegExp(`^${pattern.replace(/\*/g, ".*")}$`, "i")); //support wildcard

    function checkAndHidePosts() {
        const parentDivs = document.querySelectorAll('.GifPreview');//find all posts
        parentDivs.forEach(parentDiv => { //loop through all divs from above
            const tags = parentDiv.querySelectorAll('.tagButton .text'); //look for divs containg tags
            const tagTexts = new Set();
            tags.forEach(tag => { //look through all divs and add them to array tagTexts
                tagTexts.add(tag.textContent.trim().toLowerCase());
            });
            const anyTagPresent = regexPatterns.some(regex => { // check does any of the tag appears in tagsTexts
                return [...tagTexts].some(tag => regex.test(tag));
            });
            if (anyTagPresent && parentDiv.classList.contains('GifPreview_isActive') && (parentDiv.children[3].firstChild.children[2].firstChild.ariaLabel == "Sound On")){ //if post contains blacklisted tags and is currenlty shown and is the sound on
                document.getElementsByClassName("SoundButton")[0].click() //clicks the sound button to turn it off
            }
            if ((!parentDiv.parsed) && parentDiv.classList.contains('GifPreview_isActive') && (parentDiv.children[3].firstChild.children[2].firstChild.ariaLabel == "Sound Off")){ //check is the post not parsed and is it currently show and is the sound off
                document.getElementsByClassName("SoundButton")[0].click() //clicks it to unmute sound
            }
            if (anyTagPresent && (!parentDiv.parsed)) {
                parentDiv.parsed = true //mark a post as already done, this way it will not spam it nonstop

                parentDiv.children[1].firstChild.style.display = "none" //hideo video
                parentDiv.children[1].firstChild.children[1].remove() //remove video, one of these two is prob not needed but if it works it works and icbb to check it
                let img = parentDiv.children[0].children[0]; // find background images
                let anchor = document.createElement("a"); // create <a> tag
                anchor.href = `https://www.redgifs.com/watch/${parentDiv.id.substring(4)}` //make <a> tag clickable
                let image = img.cloneNode(true) //clones original background image
                anchor.appendChild(image) //appends background to immage
                anchor.target = "_blank"; //makes URL open in new tab
                img.parentNode.replaceChild(anchor, img) //replace background image with clickable background image
            }

        });
    }
    window.addEventListener('load', checkAndHidePosts);
    setInterval(checkAndHidePosts, 20);
})();

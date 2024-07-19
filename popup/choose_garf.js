/**
 * CSS to hide everything on the page.
 * except for garf.
 */

var browser = window.browser || window.chrome;
const hidePage = `body > :not(.garfify-image){ display: none; }`;

/**
 * Listen for clicks on the buttons, 
 * send appropriate message to content script.
 */

function listenForClicks(){
    document.addEventListener("click", (e) => {
        function garfNameToUrl(){
            return browser.runtime.getURL(`garfs/garf${getRandomInt()}.jpg`);
        }

        /**
         * Insert page hide into active tab
         * get garf url
         * send message to content script in active tab.
         */
        function garfify(tabs){
            browser.tabs.insertCSS({code:hidePage})
            .then(() => {
                const url = garfNameToUrl();
                browser.tabs.sendMessage(tabs[0].id,
                    { command: "garfify", garfURL: url }
                );
            });
        }
        
        /** 
        * remove page hiding css
        * sent a reset message to content script in active tab. 
        */
        function reset(tabs){
            browser.tabs.removeCSS({code: hidePage})
            .then(() => {
                browser.tabs.sendMessage(tabs[0].id,
                    { command:"reset" }
                );
            });
        }

        /** 
        * log error in console
        */
        function reportError(error){
            console.error(`Could not garfify: ${error}`);
        }

        /** 
        * get active tab
        * then call "garfify()" or "reset()". 
        */

        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")){
            //ignore clicks that are not within popup div.
            return;
        }

        if(e.target.type === "reset"){
            browser.tabs
            .query({ active: true, currentWindow: true})
            .then(reset)
            .catch(reportError);
        } else{
            browser.tabs
            .query({ active: true, currentWindow: true})
            .then(garfify)
            .catch(reportError);
        }
    });
}

/**
 * get random garf by int
 */
function getRandomInt(){
    return randInt = Math.floor(Math.random() * 3)
}


/** 
* There was an error executing
* Display error popup.
*/
function reportScriptError(error){
    document.querySelector("#popup-content")
    .classList.add("hidden");

    document.querySelector("#error-content")
    .classList.remove("hidden");

    console.error(`Failed to execute content script: ${error.message}`);
}

/** 
 * when popup loads, inject content script into active tab.
 * add a click handler
 * handle error if injection fails. 
*/
browser.tabs
    .executeScript({ file: "/content_scripts/garfify.js" })
    .then(listenForClicks)
    .catch(reportScriptError);
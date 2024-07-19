(() => {
    /** 
     * set global guard variable
     * check if the script is injected into the same page
     * it will do nothing next time.
    */
   if (window.hasRun){ return; }
   window.hasRun = true;

   /** 
    * given a url to a beast image, remove all existing garfs
    * create and style a garf image node.
    * insert into the dom.
   */

   function insertGarf(garfURL){
    removeExistingGarfs();
    const garfImg = document.createElement("img");
    garfImg.setAttribute("src", garfURL);
    garfImg.style.height = "100vh";
    garfImg.className = "garfify-image";
    document.body.appendChild(garfImg);
   }

   /**
    * Remove existing garfs
    */
   function removeExistingGarfs() {
    const existingGarfs = document.querySelectorAll(".garfify-image");
    for (const garf of existingGarfs){
        garf.remove();
    }
   }

   /** 
    * Listen for messages from bg script.
    * call "insertGarf()" or "removeExistingGarfs()".
    */
   browser.runtime.onMessage.addListener((message) => {
    if(message.command == "garfify"){
        console.log(message);
        insertGarf(message.garfURL);
    } else if (message.command == "reset") {
        removeExistingGarfs();
    }
   });
})();
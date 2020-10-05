recipeScraper = require('./RecipeScraper/scrapers/index');

let getRecipe = document.getElementById('get-recipe');

let pageHtml = '';

getRecipe.onclick = async function(element) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {
        if (pageHtml == '') {
            return;
        }
        let url = tabs[0].url;
        // use `url` here inside the callback because it's asynchronous!
        let recipe = await recipeScraper(url, pageHtml).catch(error => {
            console.log(error.message);
            // => "Site not yet supported"
          });
        if (recipe) {
            {
                var ingredientsTable = document.getElementById("ingredients-table");
                document.getElementById("ingredients-table-div").style.display = "block";
                ingredientsTable.removeChild(ingredientsTable.getElementsByTagName("tbody")[0]);
                let tbody = document.createElement("tbody");
                for (index in recipe.ingredients) {
                    if (recipe.ingredients[index].trim().length == 0) {
                        continue;
                    }
                    var td = tbody.insertRow().insertCell();
                    td.classList.add("mdl-data-table__cell--non-numeric");
                    td.style="word-wrap:break-word";
                    td.appendChild(document.createTextNode(recipe.ingredients[index]));
                }
                ingredientsTable.appendChild(tbody);
            }

            {
                var instructionsTable = document.getElementById("instructions-table");
                document.getElementById("instructions-table-div").style.display = "block";
                instructionsTable.removeChild(instructionsTable.getElementsByTagName("tbody")[0]);
                let tbody = document.createElement("tbody");
                for (index in recipe.instructions) {
                    if (recipe.instructions[index].trim().length == 0) {
                        continue;
                    }
                    var td = tbody.insertRow().insertCell();
                    td.classList.add("mdl-data-table__cell--non-numeric");
                    td.style="word-wrap:break-word";
                    td.appendChild(document.createTextNode(recipe.instructions[index]));
                }
                instructionsTable.appendChild(tbody);
            }
      }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        pageHtml = request.source;
    }
});

function onWindowLoad() {
    chrome.tabs.executeScript(null, {
            file: "getPagesSource.js"
        }, function() {
            // If you try and inject into an extensions 
            // page or the webstore/NTP you'll get an error
            if (chrome.runtime.lastError) {
                console.log(
                    chrome.runtime.lastError.message);
            }
        });
}

window.onload = onWindowLoad;

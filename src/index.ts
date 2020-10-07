const recipeScraper = require('./RecipeScraper/scrapers/index');
const $ = require("cash-dom");

let getTableRowFromString = function (str : string) {
    // Needs to be `table` to properly parse html correctly.
    let wrapper= document.createElement('table');
    wrapper.innerHTML = str;
	return wrapper.getElementsByTagName('tbody')[0].firstChild;
};

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        let pageHtml = request.source;
        chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {
            let url = tabs[0].url;
            let recipe = await recipeScraper(url, pageHtml).catch((error : any)  => {
                console.log(error.message);
                });
            if (recipe) {
                $("#html-loader")
                    .removeClass("mdc-linear-progress--indeterminate")
                    .addClass("mdc-linear-progress--closed");
                
                $("body").minHeight = "286px";
   
                document.getElementById("copy_to_clipboard").style.display = "block";

                {
                    let ingredientsTable = document.getElementById("ingredients-table");
                    document.getElementById("ingredients-table-div").style.display = "block";
                    ingredientsTable.removeChild(ingredientsTable.getElementsByTagName("tbody")[0]);
                    let tbody = document.createElement("tbody");
                    tbody.classList.add("mdc-data-table__content");
                    for (let index in recipe.ingredients) {
                        if (recipe.ingredients[index].trim().length == 0) {
                            continue;
                        }
                        tbody.appendChild(getTableRowFromString(String.raw`
                        <tr data-row-id="u${index}" class="mdc-data-table__row">
                            <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                                <div class="mdc-checkbox mdc-data-table__row-checkbox">
                                    <input type="checkbox" class="mdc-checkbox__native-control" aria-labelledby="u${index}"/>
                                    <div class="mdc-checkbox__background">
                                    <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                                        <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                    </div>
                                    <div class="mdc-checkbox__ripple"></div>
                                </div>
                            </td>
                            <td id="ingredient-cell" class="mdc-data-table__cell">${recipe.ingredients[index].trim()}</td>
                        </tr>
                        `));
                    }
                    ingredientsTable.appendChild(tbody);
                }
    
                {
                    let instructionsTable = document.getElementById("instructions-table");
                    document.getElementById("instructions-table-div").style.display = "block";
                    instructionsTable.removeChild(instructionsTable.getElementsByTagName("tbody")[0]);
                    let tbody = document.createElement("tbody");
                    tbody.classList.add("mdc-data-table__content");
                    for (let index in recipe.instructions) {
                        if (recipe.instructions[index].trim().length == 0) {
                            continue;
                        }
                        tbody.appendChild(getTableRowFromString(String.raw`
                        <tr data-row-id="u${index}" class="mdc-data-table__row">
                            <td id="instructions-cell" class="mdc-data-table__cell">${recipe.instructions[index].trim()}</td>
                        </tr>
                        `));
                    }
                    instructionsTable.appendChild(tbody);
                }
            }
        });
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

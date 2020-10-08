import Recipe from 'RecipeScraper/helpers/recipe-schema';

const recipeScraper = require('./RecipeScraper/scrapers/index');
const $ = require("cash-dom");

/* 
Creates an tr Element with MDC-web classes containing a checkbox and the 
ingredient text.
*/
function getIngredientRow(ingredient: string, index: string) : Element {
    return $(String.raw`
    <table><tbody>
    <tr data-row-id="u${index}" class="mdc-data-table__row">
        <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
            <div class="mdc-checkbox mdc-data-table__row-checkbox">
                <input type="checkbox" 
                       class="mdc-checkbox__native-control" 
                       aria-labelledby="u${index}"/>
                <div class="mdc-checkbox__background">
                <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                    <path class="mdc-checkbox__checkmark-path" 
                          fill="none" 
                          d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                </svg>
                <div class="mdc-checkbox__mixedmark"></div>
                </div>
                <div class="mdc-checkbox__ripple"></div>
            </div>
        </td>
        <td 
            id="ingredient-cell" 
            class="mdc-data-table__cell">${ingredient}</td>
    </tr></tbody></table>
    `).find("tr")[0];
}

/* 
Creates an tr Element with MDC-web classes containing the instruction text.
*/
function getInstructionRow(instruction : string, index : string) : Element {
    return $(String.raw`
    <table><tbody>
    <tr data-row-id="u${index}" class="mdc-data-table__row">
        <td 
            id="instructions-cell" 
            class="mdc-data-table__cell">${instruction}</td>
    </tr></tbody></table>
    `).find("tr")[0];
}

/*
Show the recipe on the popup or an error message if the recipe could not
be parsed.
*/
function showRecipie(recipe : Recipe | undefined) : void {
    $("#html-loader").hide();
    
    if (!recipe) {
        // TODO(sturdyplum) add the error message.
        return;
    }

    $("#ingredients-table-div").show();
    $("#instructions-table-div").show();
    $("#copy_to_clipboard").show();

    let ingredientsBody = $("#ingredients-table").find("tbody")[0];
    for (let index in recipe.ingredients) {
        ingredientsBody
            .append(getIngredientRow(recipe.ingredients[index].trim(), index));
    }

    let instructionsBody = $("#instructions-table").find("tbody")[0];
    for (let index in recipe.instructions) {
        instructionsBody
            .append(getInstructionRow(recipe.instructions[index].trim(), index));
    }
}

/* Listener for html of tab. */
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        let pageHtml = request.source;
        chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {
            let url = tabs[0].url;
            let recipe = await recipeScraper(url, pageHtml).catch((error : any)  => {
                console.log(error.message);
                });

            showRecipie(recipe);
        });
    }
});

/* Copies text to clipboard. */
function copyToClipboard(str:string) : void {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

/* Runs script to extract html from tab. */
function onWindowLoad() {
    /* Set up onclick to copy contents of selected ingredients to clipboard. */
    document.getElementById("copy_to_clipboard").onclick = function(){
        let ingredientsText = "";
        $("#ingredients-table")
            .find("tbody")
            .find("tr")
            .each((i : number, el : Element) => {
                if($(el).find("input")[0].checked) {
                    ingredientsText += 
                        $(el)
                            .find("#ingredient-cell")
                            .text() 
                        + "\n\n";
                }
            });
        copyToClipboard(ingredientsText.trim());
    }

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

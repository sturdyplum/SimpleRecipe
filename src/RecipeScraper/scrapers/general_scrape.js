// This scrapper does its best to get the recipe information from random sites that are not fully supported.
const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");

function processString(str) {
    return str.replace(/\s+/g, ' ').trim();
}

const generalScrape = (url, html) => {
  const Recipe = new RecipeSchema();
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html);

    let ingredientRegex = new RegExp('.*ngredient.*');
    let instructionRegex = new RegExp('(.*(I|i)nstruction.*|.*(S|s)tep.*|.*(D|d)irection*.|.*(M|m)ethod*.)');
    
    $("body")
        .find("li")
        .each((i, el) => {
            if (!ingredientRegex.test($(el).attr('class')) && !ingredientRegex.test($(el).attr('id'))) {
                return;
            }
            let elText = $(el).text();
            if (elText.length) {
                Recipe.ingredients.push(processString(elText));
            }
        });

    if(!Recipe.ingredients.length) {
        $("body")
        .find("ul, ol, div").each((i, el) => {
            if (!ingredientRegex.test($(el).attr('class')) && !ingredientRegex.test($(el).attr('id'))) {
                return;
            }
            $(el).find("li").each((i, li_el) => {
                let elText = $(li_el).text();
                if (elText.length) {
                    Recipe.ingredients.push(processString(elText));
                }
            });
        });
    }

    $("body")
        .find("li")
        .each((i, el) => {
            if (!instructionRegex.test($(el).attr('class')) && !instructionRegex.test($(el).attr('id'))) {
                return;
            }
            let elText = $(el).text();
            if (elText.length) {
                Recipe.instructions.push(processString(elText));
            }
        });

    if(!Recipe.instructions.length) {
        $("body")
        .find("ul, ol, div").each((i, el) => {
            if (!instructionRegex.test($(el).attr('class')) && !instructionRegex.test($(el).attr('id'))) {
                return;
            }
            $(el).find("li").each((i, li_el) => {
                let elText = $(li_el).text();
                if (elText.length) {
                    Recipe.instructions.push(processString(elText));
                }
            });
        });
    }

    // Remove ingredients that got into instructions
    Recipe.instructions = Recipe.instructions.filter((instruction)=>{
        return !Recipe.ingredients.find(ingredient => ingredient == instruction);
    });

    console.log(Recipe.ingredients);
    console.log(Recipe.instructions);
     
    if (
        !Recipe.ingredients.length ||
        !Recipe.instructions.length
    ) {
        reject(new Error("Site is not fully supported. Attempted to use general scraper but failed."));
    } else {
        resolve(Recipe);
    }
  });
};

module.exports = generalScrape;

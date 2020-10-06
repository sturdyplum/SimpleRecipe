// This scrapper does its best to get the recipe information from random sites that are not fully supported.
const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");

const generalScrape = (url, html) => {
  const Recipe = new RecipeSchema();
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html);

    let ingredientRegex = new RegExp('.*ngredient.*');
    let instructionRegex = new RegExp('(.*(I|i)nstruction.*|.*(S|s)tep.*|.*(D|d)irection*.|.*(M|m)ethod*.)');
    
    $("body")
        .find("li")
        .each((i, el) => {
            if (!ingredientRegex.test($(el).attr('class'))) {
                return;
            }
            let elText = $(el).text();
            if (elText.length) {
                Recipe.ingredients.push(elText.trim());
            }
        });

    if(!Recipe.ingredients.length) {
        $("body")
        .find("ul, ol, div").each((i, el) => {
            if (!ingredientRegex.test($(el).attr('class'))) {
                return;
            }
            $(el).find("li").each((i, li_el) => {
                let elText = $(li_el).text();
                if (elText.length) {
                    Recipe.ingredients.push(elText.trim());
                }
            });
        });
    }

    console.log()

    $("body")
        .find("li")
        .each((i, el) => {
            if (!instructionRegex.test($(el).attr('class'))) {
                return;
            }
            let elText = $(el).text();
            if (elText.length) {
                Recipe.instructions.push(elText.trim());
            }
        });

    if(!Recipe.instructions.length) {
        $("body")
        .find("ul, ol, div").each((i, el) => {
            if (!instructionRegex.test($(el).attr('class'))) {
                return;
            }
            $(el).find("li").each((i, li_el) => {
                let elText = $(li_el).text();
                if (elText.length) {
                    Recipe.instructions.push(elText.trim());
                }
            });
        });
    }

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

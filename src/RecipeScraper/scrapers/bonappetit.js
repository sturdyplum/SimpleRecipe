const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");

const bonAppetit = (url, html) => {
  const Recipe = new RecipeSchema();
  return new Promise((resolve, reject) => {
    if (!url.includes("bonappetit.com/recipe/")) {
      reject(new Error("url provided must include 'bonappetit.com/recipe/'"));
    } else {
      
        const $ = cheerio.load(html);

        Recipe.image = $("meta[property='og:image']").attr("content");
        Recipe.name = $("a.top-anchor").text();

        $(".ingredients")
          .find("h3, li")
          .each((i, el) => {
            let elText = $(el).text();
            if (elText.length) {
              Recipe.ingredients.push(elText);
            }
          });

        $(".steps-wrapper")
          .find("h4, p")
          .each((i, el) => {
            Recipe.instructions.push($(el).text());
          });

        Recipe.servings = $(".recipe__header__servings").text();
        console.log(Recipe);
        if (
          !Recipe.name ||
          !Recipe.ingredients.length ||
          !Recipe.instructions.length
        ) {
          reject(new Error("No recipe found on page"));
        } else {
          resolve(Recipe);
        }
      }
  });
};

module.exports = bonAppetit;

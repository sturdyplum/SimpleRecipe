const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");

const bbcGoodFood = (url, html) => {
  const Recipe = new RecipeSchema();
  return new Promise((resolve, reject) => {
    if (!url.includes("bbcgoodfood.com/recipes/")) {
      reject(new Error("url provided must include 'bbcgoodfood.com/recipes/'"));
    } else {
      const $ = cheerio.load(html);

      Recipe.image = $("meta[property='og:image']").attr("content");
      Recipe.name = $(".masthead__title ").text();

      $(".recipe-template__ingredients")
        .children("section")
        .children("ul")
        .children("li")
        .each((i, el) => {
          $(el)
            .find("p, h2, span")
            .remove();
          Recipe.ingredients.push($(el).text());
      });

      $(".recipe-template__method-steps")
        .children("div")
        .children("ul")
        .children("li")
        .each((i, el) => {
          $(el)
          .find("span")
          .remove();
        Recipe.instructions.push($(el).text());
      });

      Recipe.time.prep = $(".recipe-details__cooking-time-prep")
        .children("span")
        .text();
      Recipe.time.cook = $(".recipe-details__cooking-time-cook")
        .children("span")
        .text();

      Recipe.servings = $(".recipe-details__text[itemprop=recipeYield]")
        .text()
        .trim();
      if (!Recipe.name) {
        reject(new Error("No name"));
      }
      if (!Recipe.ingredients.length) {
        reject(new Error("No ingredients"));
      }
      if (!Recipe.instructions.length) {
        reject(new Error("No instructions"));
      }
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

module.exports = bbcGoodFood;

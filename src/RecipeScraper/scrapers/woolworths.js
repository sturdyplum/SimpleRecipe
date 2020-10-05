const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");

const urlRe = /\/(\d\d\d\d)\//;
const instructionsIndexRe = /(?:\d.)(.*)/;
const instructionsTipRe = /(Tip:)(.*)/i;

const woolworths = (url , html) => {
  const Recipe = new RecipeSchema();
  return new Promise((resolve, reject) => {
    if (!url.includes("woolworths.com.au/shop/recipedetail/")) {
      reject(
        new Error(
          "url provided must include 'woolworths.com.au/shop/recipedetail/'"
        )
      );
    } else if (!urlRe.test(url)) {
      reject(new Error("No recipe found on page"));
    } else {
      const recipeId = urlRe.exec(url)[1];
      recipeJsonUrl = `https://www.woolworths.com.au/apis/ui/recipes/${recipeId}`;
      const $ = cheerio.load(html);

      Recipe.image = html.ImageFilename;
      $(".recipeDetailContainer-ingredient").each((i,el)=>{
        Recipe.ingredients.push( $(el)
        .text()
        .trim());
      });

      $(".recipeDetailContainer-instructions").each((i,el)=>{
        Recipe.instructions.push( $(el)
        .text()
        .trim());
      });

      if (!Recipe.ingredients.length) {
        reject(new Error("No ingredients"));
      }
      if (!Recipe.instructions.length) {
        reject(new Error("No instructions"));
      }
      if (
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

module.exports = woolworths;

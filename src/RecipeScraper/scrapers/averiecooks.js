const request = require("request");
const cheerio = require("cheerio");

const RecipeSchema = require("../helpers/recipe-schema");

const averieCooks = (url, html) => {
  const Recipe = new RecipeSchema();
  return new Promise((resolve, reject) => {
    if (!url.includes("averiecooks.com")) {
      reject(new Error("url provided must include 'averiecooks.com'"));
    } else {
          const $ = cheerio.load(html);

          Recipe.image = $("meta[property='og:image']").attr("content");
          Recipe.name = $(".post-title")
            .text();

          $(".mv-create-ingredients")
            .children("ul")
            .children("li")
            .each((i, el) => {
              Recipe.ingredients.push(
                $(el)
                  .text()
                  .trim()
                  .replace(/\s\s+/g, " ")
              );
            });

          $(".mv-create-instructions")
            .find("li")
            .each((i, el) => {
              Recipe.instructions.push($(el).text());
            });

          $(".recipe-meta")
            .children("p")
            .each((i, el) => {
              const title = $(el)
                .children("strong")
                .text()
                .replace(/\s*:|\s+(?=\s*)/g, "");
              const value = $(el)
                .text()
                .replace(/[^:]*:/, "")
                .trim();
              switch (title) {
                case "PrepTime":
                  Recipe.time.prep = value;
                  break;
                case "CookTime":
                  Recipe.time.cook = value;
                  break;
                case "TotalTime":
                  Recipe.time.total = value;
                  break;
                case "Yield":
                  Recipe.servings = value;
                  break;
                default:
                  break;
              }
            });

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

module.exports = averieCooks;

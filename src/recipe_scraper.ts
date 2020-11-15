import * as cheerio from 'cheerio';

function processString(str: string) {
  return str.replace(/\s+/g, ' ').trim();
}

export const scrape = async (html: any): Promise<any> => {
  let recipe: any = {
    'ingredients': [],
    'instructions': [],
  };

  return await new Promise((resolve, reject) => {
    const $ = cheerio.load(html);

    let ingredientRegex = new RegExp('.*ngredient.*');
    let instructionRegex = new RegExp('(.*(I|i)nstruction.*|.*(S|s)tep.*|.*(D|d)irection*.|.*(M|m)ethod*.)');

    // Anti regex matchers used for handeling special cases in specific, high value, websites.
    let antiIngredientRegex = new RegExp('.*search-by.*');

    $('body')
      .find('li')
      .each((i: number, el: any) => {
        
        if (!ingredientRegex.test($(el).attr('class') as any) && !ingredientRegex.test($(el).attr('id') as any)) {
          return;
        }
        
        if (antiIngredientRegex.test($(el).attr('class') as any) || antiIngredientRegex.test($(el).attr('id') as any)) {
          return;
        }
        let elText = $(el).text();
        if (elText.length) {
          recipe.ingredients.push(processString(elText));
        }
      });

    if (!recipe.ingredients.length) {
      $('body')
        .find('ul, ol, div').each((i: number, el: any) => {
          
          if (!ingredientRegex.test($(el).attr('class') as any) && !ingredientRegex.test($(el).attr('id') as any)) {
            return;
          }
          if (antiIngredientRegex.test($(el).attr('class') as any) || antiIngredientRegex.test($(el).attr('id') as any)) {
            return;
          }
          $(el).find('li').each((i: number, li_el: any) => {
            let elText = $(li_el).text();
            if (elText.length) {
              recipe.ingredients.push(processString(elText));
            }
          });
        });
    }

    $('body')
      .find('li')
      .each((i, el) => {
        if (!instructionRegex.test($(el).attr('class') as any) && !instructionRegex.test($(el).attr('id') as any)) {
          return;
        }
        let elText = $(el).text();
        if (elText.length) {
          recipe.instructions.push(processString(elText));
        }
      });

    if (!recipe.instructions.length) {
      $('body')
        .find('ul, ol, div').each((i, el) => {
          if (!instructionRegex.test($(el).attr('class') as any) && !instructionRegex.test($(el).attr('id') as any)) {
            return;
          }
          $(el).find('li').each((i, li_el) => {
            let elText = $(li_el).text();
            if (elText.length) {
              recipe.instructions.push(processString(elText));
            }
          });
        });
    }

    // Remove ingredients that got into instructions
    recipe.instructions = recipe.instructions.filter((instruction: any) => {
      return !recipe.ingredients.find((ingredient: any) => ingredient == instruction);
    });

    console.log(recipe.ingredients);
    console.log(recipe.instructions);

    if (!recipe.ingredients.length || !recipe.instructions.length) {
      reject(new Error('Unable to find either the ingredients or instructions.'));
    } else {
      resolve(recipe);
    }
  });
};
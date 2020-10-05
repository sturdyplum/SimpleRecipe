const parseDomain = require("parse-domain");

const domains = {
  "101cookbooks": require("./101cookbooks"),
  allrecipes: require("./allrecipes"),
  averiecooks: require("./averiecooks"),
  bbc: require("./bbc"),
  bbcgoodfood: require("./bbcgoodfood"),
  bonappetit: require("./bonappetit"),
  budgetbytes: require("./budgetbytes"),
  centraltexasfoodbank: require("./centraltexasfoodbank"),
  cookieandkate: require("./cookieandkate"),
  eatingwell: require("./eatingwell"),
  epicurious: require("./epicurious"),
  finecooking: require("./finecooking"),
  food: require("./food"),
  foodandwine: require("./foodandwine"),
  foodnetwork: require("./foodnetwork"),
  gimmesomeoven: require("./gimmesomeoven"),
  kitchenstories: require("./kitchenstories"),
  minimalistbaker: require("./minimalistbaker"),
  myrecipes: require("./myrecipes"),
  omnivorescookbook: require("./omnivorescookbook"),
  seriouseats: require("./seriouseats"),
  simplyrecipes: require("./simplyrecipes"),
  smittenkitchen: require("./smittenkitchen"),
  thepioneerwoman: require("./thepioneerwoman"),
  thespruceeats: require("./thespruceeats"),
  whatsgabycooking: require("./whatsgabycooking"),
  woolworths: require("./woolworths"),
};

const recipeScraper = (url, html) => {
  return new Promise((resolve, reject) => {
    let parse = parseDomain(url);
    if (parse) {
      let domain = parse.domain;
      if (domains[domain] !== undefined) {
        resolve(domains[domain](url, html));
      } else {
        reject(new Error("Site not yet supported"));
      }
    } else {
      reject(new Error("Failed to parse domain"));
    }
  });
};

module.exports = recipeScraper;

# SimpleRecipe
Quickly collect and simply display recipe information on the browser through a google chrome extension.

Many recipe websites are cluttered with irrelevant images, text, and ads. This chrome extension allows you to quickly get the ingredients and instructions and provides a small popup on the top right of the page with this information (It even works when the website has a popup that blocks you from viewing the content).

![Screenshot of extension](https://github.com/sturdyplum/SimpleRecipe/blob/main/images/extension4.png?raw=true)


## General Scrapper
There is a general scrapper that does its best to get the info from all sites.

## How to contribute
1. Adding new cases to the general scrapper. 
2. Writing test
3. Documentation
4. Creating a better logo

## Setup
Do install of dependencies first and make sure to have webpack and webpack-cli install globally.
```
npm install
npm install --global webpack webpack-cli
```

This library requires the scraper library available [here](https://github.com/nalshihabi/recipe-scraper-js). You will have to clone that one locally and then link it within this one:
```
npm link path/to/recipe-scraper-js
```

Then you can use the pack script to pack it for building and packing the extension for use in Chrome.
```
npm run pack
```

To set up in chrome just add as an unpacked extension there.

## Future work
- Convert entire project to TypeScript
- Make it so that the ingredients are selectable and perhaps exportable (send them to email or chat or something)
- Send recipe to cookbook

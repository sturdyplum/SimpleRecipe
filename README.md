# SimpleRecipe
Quickly collect and simply display recipe information on the browser through a google chrome extension.

Many recipe websites are cluttered with irrelevant images, text, and ads. This chrome extension allows you to quickly get the ingredients and instructions and provides a small popup on the top right of the page with this information (It even works when the website has a popup that blocks you from viewing the content).

![Screenshot of extension](https://github.com/sturdyplum/SimpleRecipe/blob/main/images/Extension.png?raw=true)


## Recipe Scrapping 
Most of the fully supported website scrapping code was taken from:
https://github.com/jadkins89/Recipe-Scraper
Unfortunetly there are some issues with chrome extensions that don't allow me to use that repo directly. 

## General Scrapper
There is a general scrapper that does its best to get the info from non supported sites. 


## List of fully supported websites:
- https://www.101cookbooks.com/
- https://www.allrecipes.com/
- https://www.averiecooks.com/
- https://www.bbc.co.uk/
- https://www.bbcgoodfood.com/
- https://www.bonappetit.com/
- https://www.budgetbytes.com/
- https://www.centraltexasfoodbank.org/
- https://cookieandkate.com/
- http://www.eatingwell.com/
- https://www.epicurious.com/
- https://www.finecooking.com/
- https://www.food.com/
- https://www.foodandwine.com/
- https://www.foodnetwork.com/
- http://www.gimmesomeoven.com/
- https://www.kitchenstories.com/
- https://www.minimalistbaker.com/
- https://www.myrecipes.com/
- https://www.omnivorescookbook.com/
- https://www.seriouseats.com/
- https://www.simplyrecipes.com/
- https://smittenkitchen.com/
- https://thepioneerwoman.com/
- https://therealfoodrds.com/
- https://www.thespruceeats.com/
- https://whatsgabycooking.com/
- https://www.woolworths.com.au/

## How to contribute
1. The most useful contributions would be adding new website that can be processed. There is a general parser that is able to parse a large number of sites but having dedicated parsers will always be prefered. 
2. Writing test
3. Documentation
4. Creating a better logo

## Future work
- Convert entire project to TypeScript
- Make it so that the ingredients are selectable and perhaps exportable (send them to email or chat or something)
- Send recipe to cookbook

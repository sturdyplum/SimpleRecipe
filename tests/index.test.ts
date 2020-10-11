const rewire = require("rewire");
const IndexModule = rewire("../src/index.ts");
const $ = require("cash-dom");

test('that ingredient rows are correctly set up.', () => {
    let rowElement : Element 
        = IndexModule.getIngredientRow("test-ingredient", "test-index");

    expect(rowElement.classList.length).toBe(["mdc-data-table__row"]);
    expect(rowElement.tagName).toBe("tr");
    expect(rowElement.getAttribute("data-row-id")).toBe("utest-index");

    let tableData = $(rowElement).find("td");
    expect(tableData.length).toBe(2);
    expect(tableData[0].classList).toBe(["mdc-data-table__cell", "mdc-data-table__cell--checkbox"]);

    expect(tableData[1].classList).toBe(["mdc-data-table__cell"]);
    expect(tableData[1].id()).toBe("ingredient-cell");
    expect(tableData[1].text()).toBe("test-ingredient");
});
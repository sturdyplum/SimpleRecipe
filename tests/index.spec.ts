import {getIngredientRow, getInstructionRow} from "../src/index";
import $ from "cash-dom";

test('that ingredient rows are correctly set up.', () => {
    let rowElement : Element 
        = getIngredientRow("test-ingredient", "test-index");

    expect(rowElement.className.split(' ')).toStrictEqual(["mdc-data-table__row"]);
    expect(rowElement.tagName).toBe("TR");
    expect(rowElement.getAttribute("data-row-id")).toBe("utest-index");

    let tableData = $(rowElement).find("td");
    expect(tableData.length).toBe(2);
    expect(tableData[0]!.className.split(' '))
        .toStrictEqual(["mdc-data-table__cell", "mdc-data-table__cell--checkbox"]);

    expect(tableData[1]!.className.split(' '))
        .toStrictEqual(["mdc-data-table__cell"]);
    expect(tableData[1]!.id).toBe("ingredient-cell");
    expect(tableData[1]!.textContent).toBe("test-ingredient");
}); 

test('that instruction rows are correctly set up.', () => {
    let rowElement : Element 
        = getInstructionRow("test-instruction", "test-index");

    expect(rowElement.className.split(' ')).toStrictEqual(["mdc-data-table__row"]);
    expect(rowElement.tagName).toBe("TR");
    expect(rowElement.getAttribute("data-row-id")).toBe("utest-index");

    let tableData = $(rowElement).find("td");
    expect(tableData.length).toBe(1);
    expect(tableData[0]!.className.split(' '))
        .toStrictEqual(["mdc-data-table__cell"]);
    expect(tableData[0]!.id).toBe("instructions-cell");
    expect(tableData[0]!.textContent).toBe("test-instruction");
}); 
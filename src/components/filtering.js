import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => {
      // Перебираем по именам

      if (!elements[elementName]) return;
      elements[elementName].append(
        // в каждый элемент добавляем опции
        ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
          .map((name) => {
            // используйте name как значение и текстовое содержимое
            // @todo: создать и вернуть тег опции
            const option = document.createElement("option");
            option.value = name; // используем name как значение
            option.textContent = name; // и как текстовое содержимое
            return option;
          }),
      );
    });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (
      action &&
      (action.type === "reset" || action.dataset?.action === "clear")
    ) {
      // Если экшен сбросил всю форму, очищаем объект состояния state вручную
      Object.keys(state).forEach((key) => {
        if (key !== "rowsPerPage" && key !== "page") {
          state[key] = "";
        }
      });
      state.page = 1;
    }

    const { page, rowsPerPage, ...filterState } = state;

    const fromValue = filterState.totalFrom;
    const toValue = filterState.totalTo;

    delete filterState.totalFrom;
    delete filterState.totalTo;

    if (
      (fromValue && fromValue.trim() !== "") ||
      (toValue && toValue.trim() !== "")
    ) {
      filterState.total = [
        fromValue && fromValue.trim() !== ""
          ? parseFloat(fromValue)
          : undefined,
        toValue && toValue.trim() !== "" ? parseFloat(toValue) : undefined,
      ];
    }

    return data.filter((row) => compare(row, filterState));
  };
}

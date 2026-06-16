import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  // @todo: #5.2 - применить компаратор

  const compare = createComparison(
    [],
    [
      rules.searchMultipleFields(
        searchField,
        ["date", "customer", "seller"],
        false,
      ),
    ],
  );

  return (data, state, action) => {
    const query = state[searchField];

    if (!query) {
      return data;
    }
    return data.filter((item) => compare(item, { [searchField]: query }));
  };
}

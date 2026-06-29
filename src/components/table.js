import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

  [...before].reverse().forEach((templateId) => {
    const extension = cloneTemplate(templateId);
    root.container.prepend(extension.container);
    root[templateId] = extension;
  });

  after.forEach((templateId) => {
    const extension = cloneTemplate(templateId);
    root.container.append(extension.container);
    if (templateId === "pagination") {
      root.pagination = extension;
    }
  });

  // @todo: #1.3 —  обработать события и вызвать onAction()

  root.container.addEventListener("change", (e) => {
    onAction();
  });

  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    if (!data || !Array.isArray(data)) return;
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        if (key in row.elements) {
          const element = row.elements[key];
          if (element.tagName === "INPUT" || element.tagName === "SELECT") {
            element.value = item[key];
          } else {
            element.textContent = item[key];
          }
        }
      });
      return row.container;
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}

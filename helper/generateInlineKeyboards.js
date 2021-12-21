export default (data, options) => {
  const buttons = [...data];

  const navigationButtons = [];
  const bottomNavigationButtons = [];

  if (options && options.backLink)
    navigationButtons.push({
      text: "⬅️ Back",
      callback_data: options.backLink,
    });
  
  if (options && options.pages)
    navigationButtons.push({
      text: `📃 Pages ${options.pages.currentPage}/${options.pages.totalPages}`,
      callback_data: `pages`,
    });

  if (options && options.nextLink)
    navigationButtons.push({
      text: "Next ➡️",
      callback_data: options.nextLink,
    });

  buttons.push(navigationButtons);
  
  if (options && options.sendAllFileLink)
    bottomNavigationButtons.push({
      text: "Send all files",
      url: options.sendAllFileLink,
    });

  buttons.push(bottomNavigationButtons);

  return JSON.stringify({ inline_keyboard: buttons });
};

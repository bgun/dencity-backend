var query = { active: true, currentWindow: true };
chrome.tabs.query(query, function (tabs) {
  var currentTab = tabs[0];
  console.log(currentTab);
});
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({ url: "https://web.whatsapp.com/send?text=Hello" });
});

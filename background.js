

// chrome.tabs.onUpdated.addListener((tabId, tab) =>{
//     if(tab.url && tab.url.includes("stu-gate.qu.edu.sa")){

//     }
// });

let pageContent = '';


// chrome.browserAction.onClicked.addListener(function(tab) {
//     alert('working?');
// });


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === 'getContent') {
        let pageContent = request.content;

        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                    // Send message to the newly created tab
                    chrome.tabs.sendMessage(tabId, { action: 'insertContent', content: pageContent });
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            });
        });
    }
});

// chrome.action.onClicked.addListener(async (tab) => {
//   if (!tab.url) return;

//   const allowedSites = [
//     "stu-gate.qu.edu.sa",
//     "eduservices.uqu.edu.sa",
//     "uqu.edu.sa"
//   ];

//   const isAllowed = allowedSites.some(site =>
//     tab.url.includes(site)
//   );

//   if (!isAllowed) {
//     await chrome.action.setPopup({
//       tabId: tab.id,
//       popup: "popup.html"
//     });

//     // Trigger popup by re-click requirement
//     return;
//   }

//   await chrome.action.setPopup({
//     tabId: tab.id,
//     popup: ""
//   });

//   chrome.tabs.create({
//     url: "https://example.com"
//   });
// });

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setPopup({ popup: "popup.html" });
});

// chrome.action.onClicked.addListener(() => {
//   // This will NEVER fire if popup exists
// });
// chrome.action.onClicked.addListener(function(activeTab){
    
//     chrome.tabs.create({ url: "index.html" });
//     chrome.tabs.sendMessage(activeTab.id, { action: 'getContent' }, (response) => {
//         console.log(response.content);
//     });
    
    
// });
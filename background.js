


let pageContent = '';


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


chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setPopup({ popup: "popup.html" });
});

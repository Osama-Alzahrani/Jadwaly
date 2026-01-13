

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
chrome.action.onClicked.addListener(function(activeTab){
    
    chrome.tabs.create({ url: "index.html" });
    chrome.tabs.sendMessage(activeTab.id, { action: 'getContent' }, (response) => {
        console.log(response.content);
    });
    
    
});
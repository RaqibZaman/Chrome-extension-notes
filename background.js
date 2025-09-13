// chrome.sidePanel.setPanelBehavior({
//     openPanelOnActionClick: true
// }).catch((error) => console.error(error));

// chrome.action.onClicked.addListener((tab) => {
//     chrome.action.openPopup();
// //   chrome.scripting.executeScript({
// //     target: {tabId: tab.id},
// //     files: ['content.js']
// //   });
// });

// console.log("testing");
// try {
//     // On page change
//     chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//         //if(changeInfo.status == 'complete'){
//             chrome.scripting.executeScript({
//                 files: ['content.js'],
//                 target: {tabId: tab.id}
//             });
//         //}
//     });
// } catch(e) {
//     console.log(e);
// }

// manifest.json <= added webNavigation permission
// when URL changes, notify tab (content.js)
// const lastUrlByTab = new Map();     // keep track of multiple tabs in chrome, check which tab has the url-changed

// chrome.webNavigation.onHistoryStateUpdated.addListener(({tabId, url}) => {
//     if (lastUrlByTab.get(tabId) === url){   // compare tab url with changed url
//         return; // skip on duplication
//     }
//     lastUrlByTab.set(tabId, url); // build map on success for future reference
//     //console.log(typeof{tabId});
//     console.log("Background.js");
//     console.log(url);
//     chrome.tabs.sendMessage(tabId, {type: "URL_CHANGED", aurl: url});
// });

const lastUrlByTab = new Map(); // map the url for each tab- like an array for each tab. Good because now I can run the script per each tab
const debounceTimers = new Map();
const DEBOUNCE_MS = 250;

chrome.webNavigation.onHistoryStateUpdated.addListener(({tabId, url}) => {
    // If url is the same as before, skip... maybe runs on refresh???
    if (lastUrlByTab.get(tabId) === url) {
        return;
    }

    // Update the last observed URL per tab
    lastUrlByTab.set(tabId, url);

    // Clear any existing timer for this tab - so once debounceTimer has _ _, should not run again?
    // prevents previous timer function to fire, theoretically preventing multiple messages
    // and preventing stale messages to fire I suppose...
    if (debounceTimers.has(tabId)) {
        clearTimeout(debounceTimers.get(tabId));
    }

    // Set a new debounce timer
    const timerId = setTimeout(() => {
        // sends only the latest URL after debounce period
        chrome.tabs.sendMessage(tabId, {type: "URL_CHANGED", aurl: url});

        // cleanup
        debounceTimers.delete(tabId);
    }, DEBOUNCE_MS);

    debounceTimers.set(tabId, timerId);
});
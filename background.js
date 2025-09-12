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
const lastUrlByTab = new Map();     // keep track of multiple tabs in chrome, check which tab has the url-changed

chrome.webNavigation.onHistoryStateUpdated.addListener(({tabId, url}) => {
    if (lastUrlByTab.get(tabId) === url){   // compare tab url with changed url
        return; // skip on duplication
    }
    lastUrlByTab.set(tabId, url); // build map on success for future reference
    //console.log(typeof{tabId});
    console.log("Background.js");
    console.log(url);
    chrome.tabs.sendMessage(tabId, {type: "URL_CHANGED", aurl: url});
});
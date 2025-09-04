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
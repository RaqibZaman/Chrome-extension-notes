// dynamically make buttons using private data
function generateButtons(jsonFile, groupId){
    fetch(chrome.runtime.getURL(jsonFile))
    .then(response => response.json())
    .then(data => {
        const dyBtnGrp = document.getElementById(groupId);
        data.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'btnbox';

            for (const [key, val] of Object.entries(group)) {
                const btn = document.createElement('button');
                btn.className = 'cpy';
                btn.innerHTML = key;
                btn.setAttribute('data-text', val);
                
                btn.addEventListener('click', () => {
                let str = btn.getAttribute('data-text');
                navigator.clipboard.writeText(str)
                    .then(() => {
                        const preTxt = btn.innerHTML;
                        btn.innerHTML = "Copied!";
                        setTimeout(() => {
                            btn.innerHTML = preTxt;
                        }, 1000);
                    })
                    .catch(err => console.error("copy failed", err));
                });

                groupDiv.appendChild(btn);
            }

            dyBtnGrp.appendChild(groupDiv);
        });

        const hr = document.createElement('hr');
        dyBtnGrp.parentNode.insertBefore(hr, dyBtnGrp.nextElementSibling);
    });
}

generateButtons('private.json', 'dynamic-btn-group-private');
generateButtons('public.json', 'dynamic-btn-group-public');

// fetch(chrome.runtime.getURL('private.json'))
// .then(response => response.json())
// .then(data => {
//     const dyBtnGrp = document.getElementById('dynamic-btn-group');
//     data.forEach(group => {
//         const groupDiv = document.createElement('div');
//         groupDiv.className = 'btnbox';

//         for (const [key, val] of Object.entries(group)) {
//             const btn = document.createElement('button');
//             btn.className = 'cpy';
//             btn.innerHTML = key;
//             btn.setAttribute('data-text', val);
//             groupDiv.appendChild(btn);
//         }

//         dyBtnGrp.appendChild(groupDiv);
//     });

//     // copy link/text from buttons to clipboard
//     document.querySelectorAll('.cpy').forEach((btnX) => {
//         btnX.addEventListener('click', () => {
//             let str = btnX.getAttribute('data-text');

//             navigator.clipboard.writeText(str)
//                 .then(() => {
//                     const preTxt = btnX.innerHTML;
//                     btnX.innerHTML = "Copied!";
//                     setTimeout(() => {
//                         btnX.innerHTML = preTxt;
//                     }, 1000);
//                 })
//                 .catch(err => console.error("copy failed", err));
//         });
//     });
    
// });


const notepad = document.getElementById('notepad');
const download_btn = document.getElementById('download');

// Load Notes
chrome.storage.local.get("note", (data) => {
    notepad.value = data.note || "";
});

notepad.addEventListener('input', () => {
    chrome.storage.local.set({ note: notepad.value });
});


// Download Notes
download_btn.addEventListener("click", () => {
    const blob = new Blob([notepad.value], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "my-notes.txt";
    a.click();

    URL.revokeObjectURL(url);   // memory management
});
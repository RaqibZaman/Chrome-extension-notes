// DOM references
const notepad = document.getElementById('notepad');
const download_btn = document.getElementById('downloadNotesBtn');
const copy_note_btn = document.getElementById('copyNotesBtn');
const clear_note_btn = document.getElementById('clearNotesBtn');
const todayIs = new Date().getDay();

// dynamically make buttons using private data
function generateButtons(jsonFile, groupId){
    fetch(chrome.runtime.getURL(jsonFile))
    .then(response => response.json())
    .then(data => {
        const dyBtnGrp = document.getElementById(groupId);
        data.forEach(group => {
            // box setup
            const groupDiv = document.createElement('div');
            groupDiv.className = 'btnbox';
            if (group.id) {
                groupDiv.id = "box_" + group.id;
            }

            if (group.label != '') {
                const grpLabel = document.createElement('h3');
                grpLabel.innerHTML = group.label;
                grpLabel.className = 'btn-grp-label';
                dyBtnGrp.append(grpLabel);
            }

            if (group.descr != '') {
                const description = document.createElement('p');
                description.innerHTML = group.descr;
                description.className = 'btn-grp-label';
                dyBtnGrp.append(description);
            }
            
            // setup for buttons in box
            for (const [key, val] of Object.entries(group.buttons)) {
                const btn = document.createElement('button');
                btn.className = 'cpy-gen';
                btn.innerHTML = key;
                btn.setAttribute('data-text', val);

                // job board
                if (group.id == "job-brds"){
                    btn.classList.add("job-brds");

                    if (key === "Un employ ment"){
                        //btn.classList.add("yellBrdr");
                        // if today is monday
                        if (todayIs === 1){
                            btn.classList.add("yellBrdr");
                        }
                    }

                    if (key === "Music"){
                        btn.classList.add("bluBrdr");
                    }
                    
                    // open link
                    btn.addEventListener('click', () => {
                        window.open(val, '_blank');
                    });
                }

                // add to notepad
                else if (group.id == "notepadBtns"){
                    btn.setAttribute('id', group.id);
                    btn.addEventListener('click', () => {
                        let str = btn.getAttribute('data-text');
                        notepad.value += str + "\n";
                    });
                }

                // copy to clipboard
                else {
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
                }
                
                

                groupDiv.appendChild(btn);
            }

            dyBtnGrp.appendChild(groupDiv);
        });

        // seperate notepad from buttons
        const hr = document.createElement('hr');
        dyBtnGrp.parentNode.insertBefore(hr, dyBtnGrp.nextElementSibling);
    });
}

// These are for hard-coded buttons, not dynamically generated
document.querySelectorAll('.cpy').forEach((btnX) => {
    btnX.addEventListener('click', () => {
        let str = btnX.getAttribute('data-text');

        navigator.clipboard.writeText(str)
            .then(() => {
                const preTxt = btnX.innerHTML;
                btnX.innerHTML = "Copied!";
                setTimeout(() => {
                    btnX.innerHTML = preTxt;
                }, 1000);
            })
            .catch(err => console.error("copy failed", err));
    });
});

generateButtons('private.json', 'dynamic-btn-group-private');
generateButtons('public.json', 'dynamic-btn-group-public');
generateButtons('notepad.json', 'dynamic-btn-group-notepad');

// Load Notes
chrome.storage.local.get("note", (data) => {
    notepad.value = data.note || "";
});

// update local storage???
notepad.addEventListener('input', () => {
    chrome.storage.local.set({ note: notepad.value });
});

// Copy Notes to Clipboard
copy_note_btn.addEventListener("click", () => {
    let notes = notepad.value;
    navigator.clipboard.writeText(notes)
        .then(() => {
            const preTxt = copy_note_btn.innerHTML;
            copy_note_btn.innerHTML = "Copied!";
            setTimeout(() => {
                copy_note_btn.innerHTML = preTxt;
            }, 1000);
        })
        .catch(err => console.error("copy failed", err));
});

// Clear Notes
clear_note_btn.addEventListener("click", () => {
    notepad.value = "";
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

chrome.action.openPopup();

//   async function getCurrentTab() {
//     let queryOptions = { active: true, lastFocusedWindow: true };
//     // `tab` will either be a `tabs.Tab` instance or `undefined`.
//     let [tab] = await chrome.tabs.query(queryOptions);
//     console.log(tab.title);
//     return tab;
//   }

//   console.log("testing");
//   console.log(getCurrentTab());
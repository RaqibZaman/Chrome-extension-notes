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
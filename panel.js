const notepad = document.getElementById('notepad');
const download_btn = document.getElementById('download');

// Load saved notes???
chrome.storage.local.get("note", (data) => {
    notepad.value = data.note || "";
});

// Save note on change
notepad.addEventListener("input", () => {
    chrome.storage.local.set({ note: notepad.value});
});

download_btn.addEventListener("click", () => {
    const blob = new Blob([notepad.value], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "my-notes.txt";
    a.click();

    URL.revokeObjectURL(url);   // memory management
});
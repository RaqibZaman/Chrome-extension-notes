const notepad = document.getElementById('notepad');
const download_btn = document.getElementById('download');
const notesWrapper = document.getElementById('notes-wrapper');

const NUM_NOTES = 2;

for (let i=0; i < NUM_NOTES; i++){
    makeNoteBlock(i);
}

function makeNoteBlock(index) {
    

}

// Load saved notes???
chrome.storage.local.get("note", (data) => {
    notepad.value = data.note || "";
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
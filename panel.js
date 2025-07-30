// copy link buttons

document.querySelectorAll('.cpy').forEach((btnX) => {
    btnX.addEventListener('click', () => {
        const id = btnX.id;
        let str = '';

        if (id === 'linkedin') {
            str = "https://www.linkedin.com/in/raqibzaman/";
        } else if (id === 'github') {
            str = "https://github.com/RaqibZaman";
        } else if (id === 'website') {
            str = "https://www.therevisionist.org/software-engineering/";
        }

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
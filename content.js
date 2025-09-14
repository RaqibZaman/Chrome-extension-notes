// trigger: manifest.json => content_scripts
// I should be able to interact with the webpage DOM from here
// 
console.log("✅ content.js injected:");
console.log(Date());
console.log("URL href", location.href);
console.log("URL origin", location.origin);
console.log("URL hostname", location.hostname);
console.log("URL pathname", location.pathname);
console.log("hello world!");
console.log("hello world!");

// another note: I need the content.js to re-execute upon url refresh. Maybe an listener or something I might need to change in manifest...

// use addEventListener to check for page load
// load: takes longer, but all resources finish loading
// DOMContentLoaded: faster, fires onces the DOM tree is parsed.
// document.addEventListener("DOMContentLoaded", () => {
//     console.log("DOMContentLoaded: ", Date());
// });


// I need a live expression to check what is selected/clicked. So I know what id to refer to when automating
// USE:::: document.activeElement


// the issues is that because a lot of websites are SPAs and use url redirects without refreshing the page bc of client side rendering (CSR), through multiple urls, this listener may trigger twice after going to the "next page" once.
// to fix this, I'll use setTime to conditionally run the inner function after .25 seconds
// let runScript = true;
chrome.runtime.onMessage.addListener((m) => {
    // I need to wait before checking the DOM
    // if (runScript) {
    //     runScript = false;
    //     setTimeout(() => {
    //         runScript = !runScript;
    //     }, 250);
        if (m?.type === "URL_CHANGED") {
            console.log(m.aurl);
            console.log("testing123");
            console.log(Date());
            // looks like I can choose the url script will be active by hostname as primary factor
            if (location.hostname === "us.smartapply.indeed.com"){
                console.log("pass!");
                // check if the script is on the right page
                console.log(location.href);
                // collect the divs by indeed id
                const divs = document.querySelectorAll('div[id^="q_"]');
                console.log(divs);
                divs.forEach(div => {
                    const inputs = div.querySelectorAll('input');
                    console.log(`${div.id} inputs: `, inputs);
                });
                hardCode();
            }
            


            // replicate user click 

        }

    // }
});

function hardCode() {
    if (location.href === 'https://us.smartapply.indeed.com/beta/indeedapply/form/resume-selection-module/resume-selection'){
        setTimeout(() => {
            document.querySelector('[data-testid="resume-selection-file-resume-radio-card-input"]').click();
            document.querySelector('[data-testid="continue-button"]').click();
            console.log("hardCode");
        }, 2000);
    }
}

// in a div, find the input elements and associated label, auto populate information, need to store information, use functions and don't try to hard-code please.
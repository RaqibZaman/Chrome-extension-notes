// trigger: manifest.json => content_scripts
// I should be able to interact with the webpage DOM from here
// 
console.log("✅ content.js injected:");
console.log("URL href", location.href);
console.log("URL origin", location.origin);
console.log("URL hostname", location.hostname);
console.log("URL pathname", location.pathname);
console.log("hello world!");
console.log("hello world!");

// looks like I can choose where the script will be active by hostname as primary factor
if (location.hostname === "us.smartapply.indeed.com"){
    console.log("pass!");
    // collect the divs by indeed id
    const divs = document.querySelectorAll('div[id^="q_"]');
    console.log(divs);
}

// another note: I need the content.js to re-execute upon url refresh. Maybe an listener or something I might need to change in manifest...
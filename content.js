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
        if (m?.type === "URL_CHANGED") {
            console.log(m.aurl);
            console.log("testing123");
            console.log(Date());
            // looks like I can choose the url script will be active by hostname as primary factor
            if (location.hostname === "us.smartapply.indeed.com"){
                console.log("pass!");
                console.log(location.href); // check page
                
                // global check for inputs
                const inputs = document.querySelectorAll('input');
                console.log(inputs);

                hardCode();
                indeed_module_querySelect(); // by div id "q_"
            } else if (location.hostname === "www.dice.com"){
                handleDice();
            }


        }

});

function handleDice(retries = 3) {
    console.log("dice1");
    if (location.href.includes("www.dice.com/job-detail/")){
        console.log("dice2");
        setTimeout(() => {
            try {
                const btn = document.querySelector("#applyButton").querySelector("apply-button-wc").shadowRoot.querySelector("button");
                
                if (btn) {
                    // click if its easy apply
                    if (btn.textContent.trim().toLowerCase() === "easy apply"){
                        btn.click();
                    } else {
                        throw new Error("Btn not found");   // damn dynamic content
                    }
                    
                } else {
                    throw new Error("Btn not found");
                }
            } catch (err) {
                if (retries > 1){
                    handleDice(retries - 1);
                }
            }
        }, 1200);
    }
}

function hardCode() {
    if (location.href === 'https://us.smartapply.indeed.com/beta/indeedapply/form/resume-selection-module/resume-selection'){
        setTimeout(() => {
            document.querySelector('[data-testid="resume-selection-file-resume-radio-card-input"]').click();
            document.querySelector('[data-testid="continue-button"]').click();
            console.log("hardCode");
        }, 400);
    }
}

function indeed_module_querySelect(){
    console.log('hello!');
    // collect the divs by indeed id "q_"
    // note that if there are no divs in with id format q_, you will not get anything
    const divs = document.querySelectorAll('div[id^="q_"]');
    divs.forEach(div => {
        const inputs = div.querySelectorAll('input');
        console.log(`${div.id} inputs: `, inputs);
        
    });

    
    // find label with attribute for="x"
    const labelsWithForAtt = document.querySelectorAll('label[for]');
    console.log("labelForVals: ", labelsWithForAtt);
    // go through each label, get associated input element with id="x"
    labelsWithForAtt.forEach(label => {
        const LabelForVal = label.getAttribute('for');
        const LabelText = label.innerHTML;
        console.log("forVal", LabelForVal);
        console.log("label text", LabelText);
        // if the inner html of label matches what we have, even partially, fill in value to associated input
        const input = document.getElementById(LabelForVal)
        console.log("Associated Input: ", input);

        // check if input is text type
        if (input.type == "text"){
            // check if forVal matches
            if (LabelText in formFill.text){
                input.value = formFill.text[LabelText];
            }
        }



    });
}

// "hard" test data
const formFill = {
    text: {
        "Job title": "Full Stack Developer",
        "Company": "Customer Value Partners (CVP)"
    }
};
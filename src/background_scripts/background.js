const browser = require('webextension-polyfill');

async function toggleLabel(tabId) {
    const currentTab =
    tabId === undefined
        ? (await browser.tabs.query({
            active: true,
            currentWindow: true
        }))[0]
        : await browser.tabs.get(tabId);

    try {
        await browser.tabs.executeScript(currentTab.id, {
            file: '/label.js',
            runAt: 'document_start',
            matchAboutBlank: true
        });
    } catch(e) {
        console.log(e);
    }
    
}
browser.browserAction.onClicked.addListener(() => {
    toggleLabel();
});

browser.commands.onCommand.addListener(command => {
    switch(command) {
        case 'toggleLabel':
            console.log("Toggle Label command!");
            toggleLabel();
            break;
        default:
            console.log(`Unknown command: ${command}`);
    }
});
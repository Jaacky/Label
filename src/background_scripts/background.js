const browser = require('webextension-polyfill');

browser.browserAction.onClicked.addListener(() => {
    console.log("Browser action, label clicked!");
});

// browser.commands.onCommand.addListener(command => {
//     switch(command) {
//         case 'toggleLabel':
//             console.log("Toggle Label command!");
//         default:
//             console.log(`Unknown command: ${command}`);
//     }
// });

console.log("hello from background");
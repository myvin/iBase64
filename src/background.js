chrome.contextMenus.create({
    id: 'iBase64',
    title: chrome.i18n.getMessage('contextMenusTitle'),
    contexts: ['selection', 'editable']
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
        action: 'click'
    })
});
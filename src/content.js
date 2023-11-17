// https://github.com/sindresorhus/copy-text-to-clipboard
// https://github.com/marcelodolza/iziToast
// https://github.com/miguelmota/is-base64/blob/master/is-base64.js#L15
// var regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'click':
            decodeEncodeSelection();
            break
        default:
            break
    }
});

const Base64 = {
    decode(str) {
        return decodeURIComponent(escape(window.atob(str)));
    },
    encode(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    },
    isBase64(str) {
        const regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
        if (!regex.test(str)) {
            return false;
        }
        try {
            this.decode(str);
        } catch (error) {
            // Malformed UTF-8 data
            return false;
        }
        return true;
    },
    decodeOrEncode(str) {
        return this.isBase64(str) ? this.decode(str) : this.encode(str);
    }
}

const replaceBetween = (str, start, end, content) => {
    return `${str.substring(0, start)}${content}${str.substring(end)}`;
}

const decodeEncodeSelection = () => {
    const sel = window.getSelection();
    if (sel.anchorNode === sel.focusNode) {
        if (sel.isCollapsed) {
            try {
                var el = sel.anchorNode.childNodes[sel.extentOffset];
            } catch (error) {
                iziToast.error({
                    title: chrome.i18n.getMessage('Error'),
                    position: 'topCenter',
                    message: chrome.i18n.getMessage('retryToSelect'),
                });
                return;
            }
            if (~['TEXTAREA', 'INPUT'].indexOf(el.nodeName)) {
                copyTextToClipboard(Base64.decodeOrEncode(el.value.substring(el.selectionStart, el.selectionEnd)));
                iziToast.success({
                    title: chrome.i18n.getMessage('success'),
                    position: 'topCenter',
                    message: chrome.i18n.getMessage('copiedToClipboard'),
                });
                return;
            }
        }

        if (sel.anchorNode.nodeName === '#text') {
            let start = sel.anchorOffset;
            let end = sel.extentOffset;
            if (end < start) {
                start = sel.extentOffset;
                end = sel.anchorOffset;
            }
            copyTextToClipboard(Base64.decodeOrEncode(sel.anchorNode.textContent.substring(start, end)));
            iziToast.success({
                title: chrome.i18n.getMessage('success'),
                position: 'topCenter',
                message: chrome.i18n.getMessage('copiedToClipboard'),
            });
            return;
        }
    }


    copyTextToClipboard(Base64.decodeOrEncode(sel.toString()));
    iziToast.success({
        title: chrome.i18n.getMessage('success'),
        position: 'topCenter',
        message: chrome.i18n.getMessage('copiedToClipboard'),
    });
}
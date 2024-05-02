class Utils {
    stripHtml(html) {
         let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }
}

const utils = new Utils();
export default utils;
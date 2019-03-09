export default class BrowserUtil {
  /**
   * Returns whether or not the browser being used is the one of the input param. Does this by checking the user agent string
   * for the presence of the input browser type
   *
   * @param browser: Type of browser, E.g. 'safari', 'chrome', 'firefox'
   */
  isBrowser(browser: string): boolean {
    /*
        ua is a string representing browser information
          e.g. "mozilla/5.0 (macintosh; intel mac os x 10_13_6) applewebkit/605.1.15 (khtml, like gecko) version/12.0.3 safari/605.1.15"
     */
    const ua = navigator.userAgent.toLowerCase();

    // Chrome browser includes chrome & safari in its user agent. Safari browser will not include chrome though
    if (browser.toLowerCase() === 'safari') {
      if (ua.indexOf('safari') !== -1) {
        if (ua.indexOf('chrome') > -1) {
          return false;
        } else {
          return true;
        }
      }
    }

    // If not safari, just check for the presence of the browser string
    if (ua.indexOf(browser) > -1) {
      return true;
    }
    return false;
  }
}




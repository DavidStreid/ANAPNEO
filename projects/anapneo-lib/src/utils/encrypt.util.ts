export default class EncryptUtil {
  encrypt(input): string {
    // TODO - encrypt
    // creates base-64 encoded ASCII string
    return window.btoa( input );
  }
}

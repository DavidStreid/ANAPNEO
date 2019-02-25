export default class LoggerUtil {
  private debugEnabled = true;
  private logEnabled = true;

  log(msg: string): void {
    if ( this.logEnabled ) {
      console.log( msg );
    }
  }

  debug( msg: string ): void {
    if ( this.debugEnabled ) {
      console.log(msg);
    }
  }
}

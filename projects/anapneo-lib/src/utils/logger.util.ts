export default class LoggerUtil {
  private debugEnabled: boolean = true;
  private logEnabled: boolean = true;

  log(msg: string): void {
    if( this.logEnabled ){
      console.log( msg );
    }
	}

  debug( msg: string ) : void {
    if( this.debugEnabled ) {
      console.log(msg);
    }
  }
}

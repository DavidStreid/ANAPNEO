export default class DateUtil {
  getHumanReadableDate(date: Date): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const day = date.getDate();
    const month = monthNames[ date.getMonth() ];
    const year = date.getFullYear();

    return(`${month} ${day}, ${year}`);
  }

  getMonthString(monthNum: number): string {
    const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

    const idx = monthNum - 1;

    if( idx < 0 || idx > 11 ){
      return 'invalid';
    }

    const month = monthNames[idx];
    return month;
  }
}

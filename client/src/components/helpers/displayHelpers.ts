export class ConvertDate {
  private static monthArr = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec"
  ];

  static international (dateString: string | undefined) {
    if (!dateString) {
      return "Not Available";
    }
    const { year, month, day } = this.convertISO(dateString);
    return `${year}-${this.convertMonth(month)}-${day}`;
  }

  static military (date: string) {

  }

  private static convertISO (dateString: string) {
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    }
  }
  private static convertMonth (month: number) {
    return this.monthArr[month];
  }
}
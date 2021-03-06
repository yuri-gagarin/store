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

export const trimString = (text: string, toIndex: number): string  => {
  return text.slice(0, toIndex) + "...";
};

export const setDefaultImage = (images: IStoreImgData[] | IStoreImgData[] | IProductImgData[] | string | undefined): string => {
  const defaultImage = "https://react.semantic-ui.com/images/wireframe/image.png";
  // handle undefined //
  if (!images) {
    return defaultImage;
  }
  if (images && typeof images === "string") {
    return images;
  } else if (Array.isArray(images) && images.length > 0) {
    return  images[0].url ? images[0].url : defaultImage;
  } else {
    return defaultImage;
  }
};

export const capitalizeString = (text: string): string => {
  return text[0].toUpperCase() + text.slice(1);
};


type ImageJPEG = {
  readonly type: "image/jpeg";
}
type ImagePNG = {
  readonly type: "image/png";
}
type PlainTXT = {
  readonly type: "plain/txt";
}
type FileType = ImageJPEG | ImagePNG | PlainTXT;

class MockFile {
  
  static create(name: string, size: number, mimeType: FileType): File {
    const fileType: string = mimeType.type;
    let fileName: string = name;

    switch (mimeType.type) {
      case "image/jpeg": {
        fileName = fileName + ".jpeg";
        break;
      }
      case "image/png": {
        fileName = fileName + ".png";
        break;
      }
      case "plain/txt": {
        fileName = fileName + ".txt";
        break;
      }
    }

    const blob = new Blob([this.range(size)], { type: fileType });
    const file = new File([blob], fileName, { lastModified: Date.now() });
    return file;
  }
  private static range(size: number): string {
    let output: string = "";
    for (let i = 0; i < size; i++) {
      output += "a";
    }
    return output;
  }
}

export default MockFile;
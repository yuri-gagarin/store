interface IGenericUploadCtrl {
  uploadFile(req: any, res: any, next: any): void;
  deleteFile(req: any, res: any, next: any): void;
}

class StoreImageUploadController implements IGenericUploadCtrl {
  uploadFile (): void {

  }
  deleteFile (): void {

  }
}

export default StoreImageUploadController;
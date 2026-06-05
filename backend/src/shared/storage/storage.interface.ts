export interface StorageServiceInterface {
  uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
  deleteFile(fileKey: string): Promise<void>;
}

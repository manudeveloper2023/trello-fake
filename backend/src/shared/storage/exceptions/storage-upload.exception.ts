export class StorageUploadException extends Error {
  constructor(
    message = 'Failed to upload file to storage',
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'StorageUploadException';
  }
}

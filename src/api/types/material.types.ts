export type FileNodeType = 'folder' | 'file';

export interface FileNode {
  id: string;
  communityId: string;
  parentId: string | null;
  name: string;
  type: FileNodeType;
  mimeType?: string;
  size?: number;
  downloadCount?: number;
  children?: FileNode[];
  createdAt: string;
}

export interface MaterialDownload {
  id: string;
  fileId: string;
  encryptedBlob: ArrayBuffer;
  decryptionKey: string;
}

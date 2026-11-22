import api from '../client';
import type { FileNode, MaterialDownload } from '../types';

export const materialsApi = {
  getTree: async (communityId: string): Promise<FileNode[]> => {
    const { data } = await api.get<FileNode[]>(`/api/communities/${communityId}/materials`);
    return data;
  },

  downloadFile: async (fileId: string): Promise<MaterialDownload> => {
    const { data } = await api.get<MaterialDownload>(`/api/materials/${fileId}/download`);
    return data;
  },

  uploadFile: async (communityId: string, parentId: string | null, file: File): Promise<FileNode> => {
    const form = new FormData();
    form.append('file', file);
    if (parentId) form.append('parentId', parentId);
    const { data } = await api.post<FileNode>(
      `/api/communities/${communityId}/materials/upload`,
      form,
    );
    return data;
  },

  createFolder: async (communityId: string, name: string, parentId?: string): Promise<FileNode> => {
    const { data } = await api.post<FileNode>(
      `/api/communities/${communityId}/materials/folder`,
      { name, parentId },
    );
    return data;
  },
};


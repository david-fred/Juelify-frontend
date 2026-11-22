import api from '../client';
import type {
  Post,
  Comment,
  CreatePostPayload,
  PaginatedResponse,
} from '../types';

export const feedApi = {
  getPosts: async (params: {
    communityId: string;
    cursor?: string;
    severity?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PaginatedResponse<Post>> => {
    const { data } = await api.get<PaginatedResponse<Post>>('/api/posts', { params });
    return data;
  },

  getPost: async (postId: string): Promise<Post> => {
    const { data } = await api.get<Post>(`/api/posts/${postId}`);
    return data;
  },

  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await api.post<Post>('/api/posts', payload);
    return data;
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const { data } = await api.get<Comment[]>(`/api/posts/${postId}/comments`);
    return data;
  },

  addComment: async (postId: string, body: string, parentId?: string): Promise<Comment> => {
    const { data } = await api.post<Comment>(`/api/posts/${postId}/comments`, {
      body,
      parentId,
    });
    return data;
  },

  trackView: async (postId: string): Promise<void> => {
    await api.post(`/api/posts/${postId}/view`);
  },
};


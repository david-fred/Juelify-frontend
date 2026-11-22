import type { User } from './auth.types';

export type Severity = 'urgent' | 'important' | 'general';
export type PostType = 'announcement' | 'poll' | 'contribution' | 'question';

export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  author: User;
  title: string;
  body: string;
  type: PostType;
  severity: Severity;
  isPinned: boolean;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  body: string;
  parentId: string | null;
  replies: Comment[];
  createdAt: string;
}

export interface CreatePostPayload {
  communityId: string;
  title: string;
  body: string;
  type: PostType;
  severity: Severity;
}

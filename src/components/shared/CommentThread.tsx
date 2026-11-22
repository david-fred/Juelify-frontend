import { useState } from 'react';
import type { Comment } from '@/api/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentThreadProps {
  comments: Comment[];
  onReply: (postId: string, body: string, parentId?: string) => void;
  postId: string;
  depth?: number;
}

export function CommentThread({ comments, onReply, postId, depth = 0 }: CommentThreadProps) {
  return (
    <div className={depth > 0 ? 'ml-6 border-l-2 border-surface-border pl-4' : ''}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          postId={postId}
          depth={depth}
        />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
  postId,
  depth,
}: {
  comment: Comment;
  onReply: (postId: string, body: string, parentId?: string) => void;
  postId: string;
  depth: number;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply(postId, replyText, comment.id);
    setReplyText('');
    setShowReply(false);
  };

  return (
    <div className="py-3">
      <div className="flex items-start gap-3">
        <Avatar name={comment.author.fullName} src={comment.author.avatarUrl} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{comment.author.fullName}</span>
            <span className="text-xs text-text-muted">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">{comment.body}</p>

          {depth < 3 && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 mt-1.5 text-xs text-text-muted hover:text-brand-400 transition"
            >
              <Reply size={12} />
              Reply
            </button>
          )}

          {showReply && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-surface-overlay border border-surface-border rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
              />
              <Button size="sm" onClick={handleSubmitReply}>
                <MessageSquare size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Recursive nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <CommentThread
          comments={comment.replies}
          onReply={onReply}
          postId={postId}
          depth={depth + 1}
        />
      )}
    </div>
  );
}


"use client";
import { useEffect, useState } from "react";
import supabase from "../supabase/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  likes: number;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  profiles: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
  user_has_liked?: boolean;
}

interface ArticleCommentProps {
  articleId: string;
}

export default function ArticleComment({ articleId }: ArticleCommentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchComments();
  }, [articleId]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

const fetchComments = async () => {
  setLoading(true);
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (
        full_name,
        email,
        avatar_url
      )
    `)
    .eq("article_id", articleId)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    setLoading(false);
    return;
  }

  // Fetch replies for each comment
  const commentsWithReplies = await Promise.all(
    (data || []).map(async (comment) => {
      const replies = await fetchReplies(comment.id);
      const userHasLiked = user ? await checkIfLiked(comment.id, user.id) : false;
      return { ...comment, replies, user_has_liked: userHasLiked };
    })
  );

  setComments(commentsWithReplies);
  setLoading(false);
};

const fetchReplies = async (parentId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (
        full_name,
        email,
        avatar_url
      )
    `)
    .eq("parent_comment_id", parentId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching replies:", error);
    return [];
  }

  // Check if user has liked each reply
  const repliesWithLikes = await Promise.all(
    (data || []).map(async (reply) => {
      const userHasLiked = user ? await checkIfLiked(reply.id, user.id) : false;
      return { ...reply, user_has_liked: userHasLiked };
    })
  );

  return repliesWithLikes;
};


const checkIfLiked = async (commentId: string, userId: string) => {
  const { data } = await supabase
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(data);
};


  const handleSubmitComment = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: user.id,
      content: newComment.trim(),
    });

    if (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } else {
      setNewComment("");
      toast.success("Comment posted successfully!");
      fetchComments();
    }
    setSubmitting(false);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!replyContent.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: user.id,
      content: replyContent.trim(),
      parent_comment_id: parentId,
    });

    if (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply");
    } else {
      setReplyContent("");
      setReplyTo(null);
      toast.success("Reply posted successfully!");
      fetchComments();
    }
    setSubmitting(false);
  };

const handleEditComment = async (commentId: string) => {
  if (!editContent.trim()) return;

  const updatePromise = async () => {
    const { error } = await supabase
      .from("comments")
      .update({ content: editContent.trim(), is_edited: true })
      .eq("id", commentId);

    if (error) throw error;
  };

  toast.promise(updatePromise(), {
    loading: "Updating comment...",
    success: () => {
      setEditingId(null);
      setEditContent("");
      fetchComments();
      return "Comment updated successfully!";
    },
    error: "Failed to edit comment"
  });
};


const handleDeleteComment = async (commentId: string) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="font-semibold text-gray-900">Delete Comment?</p>
      <p className="text-sm text-gray-600">Are you sure you want to delete this comment? This action cannot be undone.</p>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            toast.dismiss(t.id);

            // Wrap deletion inside an async function returning a Promise
            const deletePromise = async () => {
              const { error } = await supabase
                .from("comments")
                .delete()
                .eq("id", commentId);

              if (error) throw error;
            };

            toast.promise(deletePromise(), {
              loading: "Deleting comment...",
              success: () => {
                fetchComments();
                return "Comment deleted successfully!";
              },
              error: "Failed to delete comment",
            });
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: "top-center",
  });
};

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Find comment in either main comments or replies
    let comment = comments.find((c) => c.id === commentId);
    if (!comment) {
      // Search in replies
      for (const c of comments) {
        const reply = c.replies?.find((r) => r.id === commentId);
        if (reply) {
          comment = reply;
          break;
        }
      }
    }
    
    if (!comment) return;

    // Prevent users from liking their own comments
    if (comment.user_id === user.id) {
      toast.error("You cannot like your own comment");
      return;
    }

    if (comment.user_has_liked) {
      // Unlike
      await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);

      await supabase
        .from("comments")
        .update({ likes: Math.max(0, comment.likes - 1) })
        .eq("id", commentId);
    } else {
      // Like
      await supabase.from("comment_likes").insert({
        comment_id: commentId,
        user_id: user.id,
      });

      await supabase
        .from("comments")
        .update({ likes: comment.likes + 1 })
        .eq("id", commentId);
    }

    fetchComments();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const CommentCard = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isOwner = user?.id === comment.user_id;
    const displayName = comment.profiles?.full_name || comment.profiles?.email?.split("@")[0] || "Anonymous";

    return (
      <div className={`${isReply ? "ml-12 mt-4" : "mb-6"}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          {/* User Info */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-semibold shrink-0">
              {displayName[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">{displayName}</span>
                <span className="text-gray-500 text-sm">
                  {formatDate(comment.created_at)}
                  {comment.is_edited && " (edited)"}
                </span>
              </div>

              {/* Comment Content */}
              {editingId === comment.id ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={editContent}
                    autoFocus
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="px-4 py-1.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-gray-800 whitespace-pre-wrap wrap-break-word">{comment.content}</p>
              )}
            </div>
          </div>

      {/* Actions */}
          {editingId !== comment.id && (
            <div className="flex items-center gap-4 mt-3 text-sm">
              <button
                onClick={() => handleLikeComment(comment.id)}
                disabled={isOwner}
                className={`flex items-center gap-1 transition-colors ${isOwner ? "text-gray-400 cursor-not-allowed" : comment.user_has_liked ? "text-blue-900 font-semibold" : "text-gray-600 hover:text-blue-900"}`}
              >
                <Heart size={18} className={comment.user_has_liked ? "fill-red-600 text-red-600" : ""}/>
                <span>{comment.likes}</span>
              </button>

              {!isReply && !isOwner && <button onClick={() => setReplyTo(comment.id)} className="text-gray-600 hover:text-blue-900 font-medium">Reply</button>}
              {isOwner && (
                <>
                  <button onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }} className="text-gray-600 hover:text-blue-900 font-medium">Edit</button>
                  <button onClick={() => handleDeleteComment(comment.id)} className="text-red-600 hover:text-red-700 font-medium">Delete</button>
                </>
              )}
            </div>
          )}

          {/* Reply Input */}
             {replyTo === comment.id && (
            <div className="mt-4 ml-12 space-y-2">
              <textarea
                autoFocus
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-gray-900"
                rows={3}
              />
              <div className="flex gap-2">
                <button onClick={() => handleSubmitReply(comment.id)} disabled={submitting} className="px-4 py-1.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium disabled:opacity-50">
                  {submitting ? "Posting..." : "Reply"}
                </button>
                <button onClick={() => { setReplyTo(null); setReplyContent(""); }} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentCard key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Toaster position="top-center" />
      
        {/* Comments Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comments ({comments.length})</h2>
        <div className="h-1 w-20 bg-blue-900 rounded"></div>
      </div>
  {/* New Comment Box */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Share your thoughts..." : "Sign in to comment"}
          disabled={!user}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
          rows={4}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-500">{!user && "Please sign in to comment"}</span>
          <button
            onClick={handleSubmitComment}
            disabled={!user || !newComment.trim() || submitting}
            className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)}
        </div>
      )}
    </div>
  );
}
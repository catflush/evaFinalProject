import { useState, useEffect } from 'react';
import { FaThumbsUp, FaComment, FaTrash, FaImage } from 'react-icons/fa';
import { useUser } from '../context/useUser';
import { usePosts } from '../context/PostContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PostCard = ({ post }) => {
  const { user } = useUser();
  const { likePost, addComment, deletePost } = usePosts();
  const [commentInput, setCommentInput] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (post?.image) {
      const url = getImageUrl(post.image);
      setImageUrl(url);
      
      // Test if the image exists
      if (url) {
        fetch(url, { method: 'HEAD' })
          .then(response => {
            if (!response.ok) {
              console.error('Image not found:', url);
              setImageError(true);
            }
          })
          .catch(error => {
            console.error('Error checking image:', error);
            setImageError(true);
          });
      }
    }
  }, [post]);

  if (!post) {
    console.error('Post is undefined');
    return null;
  }

  const handleLike = async () => {
    try {
      await likePost(post._id);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      await addComment(post._id, commentInput);
      setCommentInput('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleImageError = (e) => {
    console.error('Error loading image:', e);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {post.author.firstName?.[0] || 'U'}
            </div>
          </div>
          <div>
            <h3 className="font-bold">
              {post.author.firstName} {post.author.lastName}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <p className="mt-4">{post.content}</p>
        {post.image && !imageError && (
          <div className="relative mt-4">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-primary"></div>
              </div>
            )}
            <img
              src={getImageUrl(post.image)}
              alt="Post content"
              className={`w-full h-64 object-cover rounded-lg ${imageLoading ? 'hidden' : ''}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </div>
        )}
        {imageError && (
          <div className="mt-4 p-4 bg-error/10 text-error rounded-lg">
            Failed to load image
          </div>
        )}
        <div className="flex items-center justify-between border-t border-base-200 pt-4">
          <button
            onClick={handleLike}
            className={`btn btn-ghost btn-sm ${post.likes?.includes(user?._id) ? 'text-primary' : ''}`}
            aria-label={post.likes?.includes(user?._id) ? 'Unlike post' : 'Like post'}
          >
            <FaThumbsUp className="mr-2" />
            {post.likes?.length || 0} Likes
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="btn btn-ghost btn-sm"
            aria-label={showComments ? 'Hide comments' : 'Show comments'}
          >
            <FaComment className="mr-2" />
            {post.comments?.length || 0} Comments
          </button>
        </div>
        {showComments && (
          <div className="mt-4 border-t border-base-200 pt-4">
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write a comment..."
                  className="input input-bordered flex-1"
                  aria-label="Comment input"
                />
                <button type="submit" className="btn btn-primary btn-sm" aria-label="Submit comment">
                  Post
                </button>
              </div>
            </form>
            <div className="space-y-4">
              {post.comments?.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <span>{comment.author?.firstName?.[0] || 'U'}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-base-200 rounded-lg p-3">
                      <p className="font-semibold">
                        {comment.author?.firstName || 'Unknown'} {comment.author?.lastName || 'User'}
                      </p>
                      <p className="text-sm">{comment.content || 'No content'}</p>
                    </div>
                    <p className="text-xs text-base-content/70 mt-1">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;

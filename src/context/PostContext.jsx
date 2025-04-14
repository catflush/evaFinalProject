import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from './useUser';
import { toast } from 'react-toastify';

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/posts`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch posts');
      }

      const data = await response.json();
      console.log('Fetched posts:', data);
      
      // Ensure image URLs are properly constructed
      const postsWithFullImageUrls = data.map(post => ({
        ...post,
        image: post.image ? (post.image.startsWith('http') ? post.image : `${API_URL}${post.image}`) : null
      }));
      
      setPosts(postsWithFullImageUrls);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token, API_URL]);

  const createPost = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Log the form data for debugging
      console.log('Creating post with formData:', {
        content: formData.get('content'),
        hasImage: formData.has('image'),
        imageName: formData.get('image')?.name
      });

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      // Log the response for debugging
      console.log('Server response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Get the response text first to check if it's JSON
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let newPost;
      try {
        newPost = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned invalid response format');
      }

      if (!response.ok) {
        throw new Error(newPost.message || 'Failed to create post');
      }

      // Ensure the image URL is properly constructed
      if (newPost.image) {
        newPost.image = `${API_URL}${newPost.image}`;
      }
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast.success('Post created successfully! 🎉');
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message);
      toast.error(error.message || 'Failed to create post. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token, API_URL]);

  const likePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like post');
      }

      const updatedPost = await response.json();
      console.log('Liked post:', updatedPost);
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === postId ? updatedPost : post)
      );
    } catch (error) {
      console.error('Error liking post:', error);
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token, API_URL]);

  const addComment = useCallback(async (postId, content) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const updatedPost = await response.json();
      console.log('Added comment:', updatedPost);
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === postId ? updatedPost : post)
      );
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token, API_URL]);

  const deletePost = useCallback(async (postId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }

      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token, API_URL]);

  const updatePost = useCallback(async (postId, postData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('content', postData.content);
      if (postData.image) {
        formData.append('image', postData.image);
      }

      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post');
      }

      const updatedPost = await response.json();
      setPosts(prevPosts => 
        prevPosts.map(post => post._id === postId ? updatedPost : post)
      );
      toast.success('Post updated successfully');
      return updatedPost;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token, API_URL]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, fetchPosts]);

  const value = useMemo(() => ({
    posts,
    loading,
    error,
    createPost,
    likePost,
    addComment,
    deletePost,
    updatePost,
    fetchPosts
  }), [
    posts,
    loading,
    error,
    createPost,
    likePost,
    addComment,
    deletePost,
    updatePost,
    fetchPosts
  ]);

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContext; 
import { createContext, useContext, useState, useCallback } from 'react';
import { useUser } from './useUser';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const WorkshopContext = createContext();

export const useWorkshops = () => {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshops must be used within a WorkshopProvider');
  }
  return context;
};

export const WorkshopProvider = ({ children }) => {
  const { user } = useUser();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all workshops with optional filters
  const getWorkshops = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const response = await fetch(`${API_URL}/workshops?${queryParams}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch workshops');
      }
      const data = await response.json();
      setWorkshops(data.data || []);
      return data;
    } catch (error) {
      console.error('Error fetching workshops:', error);
      setError(error.message);
      toast.error(error.message);
      return { data: [], total: 0, page: 1, pages: 1 };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get upcoming workshops
  const getUpcomingWorkshops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/workshops/upcoming`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch upcoming workshops');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching upcoming workshops:', error);
      setError(error.message);
      toast.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get hosted workshops
  const getHostedWorkshops = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/workshops/hosted`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch hosted workshops');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching hosted workshops:', error);
      setError(error.message);
      toast.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Get a single workshop
  const getWorkshop = useCallback(async (workshopId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/workshops/${workshopId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch workshop');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching workshop:', error);
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new workshop
  const createWorkshop = useCallback(async (workshopData, attachments = []) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      
      // Add workshop data
      Object.keys(workshopData).forEach(key => {
        if (workshopData[key] !== undefined && workshopData[key] !== null) {
          if (Array.isArray(workshopData[key])) {
            workshopData[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (workshopData[key] instanceof Date) {
            formData.append(key, workshopData[key].toISOString());
          } else {
            formData.append(key, workshopData[key]);
          }
        }
      });

      // Add attachments
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await fetch(`${API_URL}/workshops`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create workshop');
      }

      const data = await response.json();
      setWorkshops(prev => [...prev, data.data]);
      toast.success('Workshop created successfully');
      return data.data;
    } catch (error) {
      console.error('Error creating workshop:', error);
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Update a workshop
  const updateWorkshop = useCallback(async (workshopId, workshopData, attachments = []) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      
      // Add workshop data
      Object.keys(workshopData).forEach(key => {
        if (workshopData[key] !== undefined && workshopData[key] !== null) {
          if (Array.isArray(workshopData[key])) {
            workshopData[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (workshopData[key] instanceof Date) {
            formData.append(key, workshopData[key].toISOString());
          } else {
            formData.append(key, workshopData[key]);
          }
        }
      });

      // Add attachments
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await fetch(`${API_URL}/workshops/${workshopId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update workshop');
      }

      const data = await response.json();
      setWorkshops(prev => prev.map(workshop => 
        workshop._id === workshopId ? data.data : workshop
      ));
      toast.success('Workshop updated successfully');
      return data.data;
    } catch (error) {
      console.error('Error updating workshop:', error);
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Delete a workshop
  const deleteWorkshop = useCallback(async (workshopId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/workshops/${workshopId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete workshop');
      }

      setWorkshops(prev => prev.filter(workshop => workshop._id !== workshopId));
      toast.success('Workshop deleted successfully');
    } catch (error) {
      console.error('Error deleting workshop:', error);
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Register for a workshop
  const registerForWorkshop = useCallback(async (workshopId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/workshops/${workshopId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register for workshop');
      }

      const data = await response.json();
      setWorkshops(prev => prev.map(workshop => 
        workshop._id === workshopId ? data.data : workshop
      ));
      toast.success('Successfully registered for workshop');
      return data.data;
    } catch (error) {
      console.error('Error registering for workshop:', error);
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Cancel workshop registration
  const cancelRegistration = useCallback(async (workshopId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/workshops/${workshopId}/register`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel workshop registration');
      }

      const data = await response.json();
      setWorkshops(prev => prev.map(workshop => 
        workshop._id === workshopId ? data.data : workshop
      ));
      toast.success('Workshop registration cancelled successfully');
      return data.data;
    } catch (error) {
      console.error('Error canceling workshop registration:', error);
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const value = {
    workshops,
    loading,
    error,
    getWorkshops,
    getUpcomingWorkshops,
    getHostedWorkshops,
    getWorkshop,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    registerForWorkshop,
    cancelRegistration
  };

  return (
    <WorkshopContext.Provider value={value}>
      {children}
    </WorkshopContext.Provider>
  );
};

export default WorkshopProvider; 
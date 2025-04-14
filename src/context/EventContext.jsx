import { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useUser } from './useUser';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("API URL is required, are you missing a .env file?");
}

const EventContext = createContext();

export { EventContext };

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Helper function to ensure data is an array
  const ensureArray = useCallback((data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  }, []);

  // Save event to user's list
  const saveEvent = useCallback(async (eventId) => {
    if (!user?._id) {
      toast.error('Please login to save events');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${user._id}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ eventId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save event');
      }

      await response.json(); // Consume the response
      setSavedEvents(prev => [...prev, eventId]);
      toast.success('Event saved successfully');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Remove event from user's list
  const unsaveEvent = useCallback(async (eventId) => {
    if (!user?._id) {
      toast.error('Please login to manage saved events');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${user._id}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove event');
      }

      setSavedEvents(prev => prev.filter(id => id !== eventId));
      toast.success('Event removed from saved events');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check if an event is saved
  const isEventSaved = useCallback((eventId) => {
    return savedEvents.includes(eventId);
  }, [savedEvents]);

  // Get all saved events
  const getSavedEvents = useCallback(async () => {
    if (!user?._id) {
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/users/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch saved events');
      }

      const data = await response.json();
      const userEvents = data.data.events || [];
      setSavedEvents(userEvents.map(event => event._id));
      return userEvents;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch events');
      }
      const data = await response.json();
      setEvents(ensureArray(data));
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      setEvents([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [ensureArray]);

  // Create new event
  const createEvent = useCallback(async (eventData, files = []) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      
      // Add event data fields
      Object.keys(eventData).forEach(key => {
        formData.append(key, eventData[key]);
      });
      
      // Set host as the logged-in user's full name
      formData.append('host', `${user?.firstName} ${user?.lastName}`.trim());
      
      // Add files if any
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData, // FormData automatically sets the correct Content-Type
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const responseData = await response.json();
      const newEvent = responseData.data || responseData;
      setEvents(prev => [...ensureArray(prev), newEvent]);
      toast.success('Event created successfully');
      return newEvent;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ensureArray, user]);

  // Update event
  const updateEvent = useCallback(async (eventId, eventData, files = []) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      
      // Add event data fields
      Object.keys(eventData).forEach(key => {
        formData.append(key, eventData[key]);
      });
      
      // Add files if any
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData, // FormData automatically sets the correct Content-Type
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }

      const responseData = await response.json();
      const updatedEvent = responseData.data || responseData;
      setEvents(prev => ensureArray(prev).map(event => 
        event._id === eventId ? updatedEvent : event
      ));
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ensureArray, user]);

  // Delete event
  const deleteEvent = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }

      setEvents(prev => ensureArray(prev).filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ensureArray, user]);

  // Delete attachment from event
  const deleteAttachment = useCallback(async (eventId, attachmentId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/events/${eventId}/attachments/${attachmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete attachment');
      }

      const responseData = await response.json();
      const updatedEvent = responseData.data || responseData;
      setEvents(prev => ensureArray(prev).map(event => 
        event._id === eventId ? updatedEvent : event
      ));
      toast.success('Attachment deleted successfully');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [ensureArray]);

  // Get single event (aliased as getEventById for consistency)
  const getEvent = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/events/${eventId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch event');
      }

      const responseData = await response.json();
      return responseData.data || responseData;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get hosted events for the current user
  const getHostedEvents = useCallback(async () => {
    if (!user?._id) {
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/events/hosted`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch hosted events');
      }

      const data = await response.json();
      return ensureArray(data);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, ensureArray]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    events: ensureArray(events),
    savedEvents,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    deleteAttachment,
    getEvent,
    getEventById: getEvent, // Alias for consistency
    saveEvent,
    unsaveEvent,
    isEventSaved,
    getSavedEvents,
    getHostedEvents
  }), [
    events,
    savedEvents,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    deleteAttachment,
    getEvent,
    saveEvent,
    unsaveEvent,
    isEventSaved,
    getSavedEvents,
    getHostedEvents,
    ensureArray
  ]);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
}; 
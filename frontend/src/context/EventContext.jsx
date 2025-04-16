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

      await response.json();
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
      // Transform events to include full image URLs
      const eventsWithFullUrls = ensureArray(data.data).map(event => ({
        ...event,
        imageUrl: event.imageUrl ? `${API_URL}${event.imageUrl}` : null
      }));
      setEvents(eventsWithFullUrls);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [ensureArray]);

  // Create new event
  const createEvent = useCallback(async (eventData, imageFile) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      const requiredFields = ['title', 'description', 'date', 'time', 'type'];
      const missingFields = requiredFields.filter(field => !eventData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const formData = new FormData();
      
      // Add event data fields
      Object.keys(eventData).forEach(key => {
        // Convert date to ISO string if it's a Date object
        const value = eventData[key] instanceof Date 
          ? eventData[key].toISOString() 
          : eventData[key];
        // Skip image-related fields as they're handled separately
        if (!['image', 'imageUrl', 'currentImage'].includes(key)) {
          formData.append(key, value);
        }
      });
      
      // Set host as the logged-in user's full name
      formData.append('host', `${user?.firstName} ${user?.lastName}`.trim());
      
      // Add image if present
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const responseData = await response.json();
      const newEvent = responseData.data;
      
      // Ensure the image URL is properly set
      if (newEvent.imageUrl) {
        newEvent.imageUrl = `${API_URL}${newEvent.imageUrl}`;
      }
      
      // Update the events list
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
      return newEvent;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get single event
  const getEvent = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/events/${eventId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch event');
      }
      const data = await response.json();
      // Transform event to include full image URL
      const eventWithFullUrl = {
        ...data.data,
        imageUrl: data.data.imageUrl ? `${API_URL}${data.data.imageUrl}` : null
      };
      return eventWithFullUrl;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update event
  const updateEvent = useCallback(async (eventId, eventData, imageFile) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      
      // Add event data fields
      Object.keys(eventData).forEach(key => {
        // Convert date to ISO string if it's a Date object
        const value = eventData[key] instanceof Date 
          ? eventData[key].toISOString() 
          : eventData[key];
        // Skip image-related fields as they're handled separately
        if (!['image', 'imageUrl', 'currentImage'].includes(key)) {
          formData.append(key, value);
        }
      });
      
      // Add image if present
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }

      const responseData = await response.json();
      const updatedEvent = responseData.data;
      
      // Ensure the image URL is properly set
      if (updatedEvent.imageUrl) {
        updatedEvent.imageUrl = `${API_URL}${updatedEvent.imageUrl}`;
      }
      
      // Update the events list
      setEvents(prev => prev.map(event => 
        event._id === eventId ? updatedEvent : event
      ));
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

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

  // Get upcoming events
  const getUpcomingEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/events/upcoming`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch upcoming events');
      }
      const data = await response.json();
      return ensureArray(data.data);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [ensureArray]);

  // Get hosted events
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
      return ensureArray(data.data);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [ensureArray, user]);

  const value = useMemo(() => ({
    events,
    savedEvents,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    saveEvent,
    unsaveEvent,
    isEventSaved,
    getSavedEvents,
    getUpcomingEvents,
    getHostedEvents,
    getEvent
  }), [
    events,
    savedEvents,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    saveEvent,
    unsaveEvent,
    isEventSaved,
    getSavedEvents,
    getUpcomingEvents,
    getHostedEvents,
    getEvent
  ]);

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 
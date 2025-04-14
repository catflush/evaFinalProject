import { useEffect, useState } from 'react';
import { useEvents } from '../context/EventContext';
import { TiPlus } from 'react-icons/ti';
import { toast } from 'react-toastify';
import EventModal from '../components/EventModal';
import EventCard from '../components/EventCard';

const EventsPage = () => {
  const { events, loading, error, fetchEvents, deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete event');
      }
    }
  };

  const openCreateModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleModalSuccess = () => {
    fetchEvents();
  };

  if (loading && !events.length) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error && !events.length) {
    return (
      <div className="p-4">
        <div className="alert alert-error">
          <p>{error}</p>
          <button className="btn btn-sm" onClick={fetchEvents}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <button 
          className="btn btn-primary"
          onClick={openCreateModal}
        >
          <TiPlus className="h-5 w-5 mr-1" />
          Create Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={selectedEvent}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default EventsPage; 
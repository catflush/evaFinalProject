import { TiPencil, TiTrash, TiCalendar, TiTime, TiUser, TiStar, TiTicket } from 'react-icons/ti';
import { format, isValid, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useUser } from '../context/useUser';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaHeart, FaRegHeart, FaImage } from 'react-icons/fa';

const EventCard = ({ event, onEdit, onDelete, onUnsave, showHostActions = false, showSaveButton = true, showBookButton = true }) => {
  const navigate = useNavigate();
  const { saveEvent, unsaveEvent, isEventSaved } = useEvents();
  const { user } = useUser();
  const [isSaved, setIsSaved] = useState(isEventSaved(event._id));
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Check if the current user is the host of this event
  const isHost = user && `${user.firstName} ${user.lastName}`.trim() === event.host;

  useEffect(() => {
    // Reset image states when event changes
    setImageLoaded(false);
    setImageError(false);
  }, [event]);

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on action buttons
    if (e.target.closest('.card-actions') || e.target.closest('.booking-btn') || e.target.closest('.save-btn')) {
      return;
    }
    // Check if event ID exists before navigation
    if (event._id) {
      navigate(`/events/${event._id}`);
    } else {
      console.error('Event ID is undefined');
    }
  };

  const handleBooking = (e) => {
    e.stopPropagation();
    navigate(`/booking/${event._id}`);
  };

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    if (isSaved) {
      await unsaveEvent(event._id);
      setIsSaved(false);
      // Call onUnsave if provided
      if (onUnsave) {
        onUnsave();
      }
    } else {
      await saveEvent(event._id);
      setIsSaved(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setIsDeleting(true);
        await onDelete(event._id);
      } catch (error) {
        console.error('Failed to delete event:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const isImageFile = (mimetype) => {
    return mimetype && mimetype.startsWith('image/');
  };

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'badge-success';
      case 'intermediate':
        return 'badge-warning';
      case 'expert':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'PPP') : 'Date not available';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  // Get the first image attachment if available
  const getFirstImageAttachment = () => {
    if (!event.attachments || event.attachments.length === 0) return null;
    return event.attachments.find(att => isImageFile(att.mimetype));
  };

  const firstImage = getFirstImageAttachment();

  return (
    <div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Card Image */}
      <div className="relative h-48 overflow-hidden">
        {firstImage && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            )}
            <img 
              src={`${import.meta.env.VITE_API_URL}/${firstImage.path}`} 
              alt={firstImage.filename} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="w-full h-full bg-base-200 flex items-center justify-center">
            <FaImage className="h-12 w-12 text-base-content/30" />
          </div>
        )}
        {showSaveButton && (
          <button 
            className={`btn btn-circle btn-sm absolute top-2 right-2 z-10 ${isSaved ? 'btn-error' : 'btn-ghost bg-base-100/80 hover:bg-base-100'}`}
            onClick={handleSaveToggle}
          >
            {isSaved ? <FaHeart className="h-4 w-4" /> : <FaRegHeart className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="card-body flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-lg md:text-xl line-clamp-1">{event.title}</h2>
          <div className="text-lg font-bold text-primary whitespace-nowrap ml-2">
            ${typeof event.price === 'number' ? event.price.toFixed(2) : '0.00'}
          </div>
        </div>
        
        <p className="text-base-content/70 line-clamp-2 text-sm md:text-base">{event.description}</p>
        
        <div className="space-y-1 md:space-y-2 mt-2 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <TiCalendar className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <TiTime className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="truncate">{event.time || 'Time not specified'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <TiUser className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="truncate">{event.host || 'Host not specified'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <div className={`badge badge-sm md:badge-md ${
            event.type === 'workshop' ? 'badge-primary' : 
            event.type === 'talks' ? 'badge-secondary' : 'badge-accent'
          }`}>
            {event.type || 'Type not specified'}
          </div>
          
          <div className={`badge badge-sm md:badge-md ${getLevelBadgeColor(event.level)} gap-1`}>
            <TiStar className="h-3 w-3" />
            {event.level || 'Level not specified'}
          </div>
        </div>

        <div className="card-actions justify-between mt-4 pt-2 border-t border-base-200">
          <div className="flex gap-2">
            {/* Only show edit/delete buttons if user is the host and showHostActions is true */}
            {(isHost && showHostActions) && (
              <>
                <button 
                  className="btn btn-sm btn-circle btn-ghost text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(event);
                  }}
                >
                  <TiPencil className="h-4 w-4" />
                </button>
                <button 
                  className="btn btn-sm btn-circle btn-ghost text-error"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
          
          <div className="flex gap-2">
            {showBookButton && (
              <button 
                className="btn btn-sm btn-primary booking-btn"
                onClick={handleBooking}
              >
                <TiTicket className="h-4 w-4 mr-1" />
                Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 
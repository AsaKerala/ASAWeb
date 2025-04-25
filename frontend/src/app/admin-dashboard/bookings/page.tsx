'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { bookingsApi } from '@/lib/api';

interface RoomBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  createdAt: string;
}

interface EventBooking {
  id: string;
  eventName: string;
  organizerName: string;
  organization: string;
  email: string;
  venueSpace: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<'rooms' | 'events'>(
    tabParam === 'events' ? 'events' : 'rooms'
  );
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [eventBookings, setEventBookings] = useState<EventBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'rooms') {
        const response = await bookingsApi.getRoomBookings();
        setRoomBookings(response.data?.docs || []);
      } else {
        const response = await bookingsApi.getEventBookings();
        setEventBookings(response.data?.docs || []);
      }
    } catch (err) {
      console.error(`Error fetching ${activeTab} bookings:`, err);
      setError(`Failed to load ${activeTab} bookings. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Change tab and update URL query parameter
  const handleTabChange = (tab: 'rooms' | 'events') => {
    setActiveTab(tab);
    router.push(`/admin-dashboard/bookings?tab=${tab}`, { scroll: false });
  };
  
  useEffect(() => {
    fetchBookings();
  }, [activeTab]);
  
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Facility Booking Management</h1>
        <p className="text-zinc-600 mt-1">
          View and manage all room and event bookings
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-zinc-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => handleTabChange('rooms')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rooms'
                ? 'border-hinomaru-red text-hinomaru-red'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
            }`}
          >
            Room Bookings
          </button>
          <button
            onClick={() => handleTabChange('events')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'events'
                ? 'border-hinomaru-red text-hinomaru-red'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
            }`}
          >
            Event Venue Bookings
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-hinomaru-red/20 border-t-hinomaru-red rounded-full animate-spin"></div>
          <p className="mt-4 text-zinc-600">Loading bookings...</p>
        </div>
      ) : (
        <>
          {/* Room Bookings Table */}
          {activeTab === 'rooms' && (
            <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Room Bookings</h2>
                <p className="text-sm text-zinc-500">{roomBookings.length} bookings found</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Guest Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Room Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Check-out
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Request Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {roomBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm text-zinc-500">
                          No room bookings found.
                        </td>
                      </tr>
                    ) : (
                      roomBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-zinc-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                            {booking.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {booking.roomType === 'twin' ? 'Twin Room' : 'Suite Room'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {formatDate(booking.checkIn)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {formatDate(booking.checkOut)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {formatDate(booking.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/admin-dashboard/bookings/room/${booking.id}`}
                              className="text-hinomaru-red hover:text-hinomaru-red-dark"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Event Bookings Table */}
          {activeTab === 'events' && (
            <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Event Venue Bookings</h2>
                <p className="text-sm text-zinc-500">{eventBookings.length} bookings found</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Organizer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-200">
                    {eventBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm text-zinc-500">
                          No event bookings found.
                        </td>
                      </tr>
                    ) : (
                      eventBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-zinc-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
                            {booking.eventName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {booking.organizerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {(() => {
                              switch (booking.venueSpace) {
                                case 'auditorium':
                                  return 'Golden Jubilee Hall';
                                case 'nishimura':
                                  return 'Nishimura Hall';
                                case 'yamamoto':
                                  return 'Yamamoto Hall';
                                case 'classroom':
                                  return 'Classroom';
                                case 'boardroom':
                                  return 'Boardroom';
                                case 'multiple':
                                  return 'Multiple Spaces';
                                default:
                                  return booking.venueSpace;
                              }
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {formatDate(booking.startDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700">
                            {formatDate(booking.endDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/admin-dashboard/bookings/event/${booking.id}`}
                              className="text-hinomaru-red hover:text-hinomaru-red-dark"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { bookingsApi, EventBookingData } from '@/lib/api';

export default function BookEventPage() {
  const [formData, setFormData] = useState<EventBookingData>({
    eventName: '',
    organizerName: '',
    organization: '',
    email: '',
    phone: '',
    eventType: 'conference',
    attendees: '10-50',
    venueSpace: 'auditorium',
    startDate: '',
    endDate: '',
    requirements: '',
    agreeToTerms: false
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      await bookingsApi.submitEventBooking(formData);
      setFormStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      setErrorMessage('There was a problem submitting your booking request. Please try again or contact us directly.');
    }
  };
  
  // Calculate minimum dates for start date (today) and end date (day after start date)
  const today = new Date().toISOString().split('T')[0];
  const minEndDate = formData.startDate || today;
  
  // Success state content
  if (formStatus === 'success') {
    return (
      <div className="min-h-screen bg-zinc-50 pt-16 pb-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-4xl">✓</span>
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-4">Event Booking Request Received</h1>
              <p className="text-lg text-zinc-700">
                Thank you for your interest in hosting an event at the Nippon Kerala Centre.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">What happens next?</h2>
              <ol className="space-y-3 list-decimal pl-5 text-zinc-700">
                <li>Our events team will review your booking request</li>
                <li>You will receive an email confirmation within 48 hours</li>
                <li>If your requested dates and venue are available, we will provide a detailed quote</li>
                <li>Our events manager will arrange a call to discuss your specific requirements</li>
                <li>Once the details are finalized, a formal contract will be sent for signature</li>
              </ol>
            </div>
            
            <div className="border-t border-zinc-200 pt-6 text-center">
              <p className="text-zinc-700 mb-6">
                If you have any questions, please contact our events team at{' '}
                <a href="mailto:events@nkc.org" className="text-hinomaru-red font-medium">
                  events@nkc.org
                </a>{' '}
                or call us at{' '}
                <a href="tel:+919876543210" className="text-hinomaru-red font-medium">
                  +91 9876 543 210
                </a>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/facilities" className="btn-outline">
                  Back to Facilities
                </Link>
                <Link href="/" className="btn-primary">
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Banner Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-16">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Event Booking</h1>
            <p className="text-xl">Host your next event at the Nippon Kerala Centre</p>
          </div>
        </div>
      </section>
      
      {/* Booking Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Event Details</h2>
                
                {formStatus === 'error' && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                    {errorMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Organization Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Organization Information</h3>
                    
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-zinc-700 mb-1">
                        Organization *
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="organizerName" className="block text-sm font-medium text-zinc-700 mb-1">
                          Organizer Name *
                        </label>
                        <input
                          type="text"
                          id="organizerName"
                          name="organizerName"
                          value={formData.organizerName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                      />
                    </div>
                  </div>
                  
                  {/* Event Details */}
                  <div className="space-y-4 pt-4 border-t border-zinc-200">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Event Details</h3>
                    
                    <div>
                      <label htmlFor="eventName" className="block text-sm font-medium text-zinc-700 mb-1">
                        Event Name *
                      </label>
                      <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-zinc-700 mb-1">
                          Event Type *
                        </label>
                        <select
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                        >
                          <option value="conference">Conference</option>
                          <option value="training">Training Program</option>
                          <option value="workshop">Workshop</option>
                          <option value="seminar">Seminar</option>
                          <option value="corporate">Corporate Meeting</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="attendees" className="block text-sm font-medium text-zinc-700 mb-1">
                          Expected Attendees *
                        </label>
                        <select
                          id="attendees"
                          name="attendees"
                          value={formData.attendees}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                        >
                          <option value="10-50">10-50 people</option>
                          <option value="51-100">51-100 people</option>
                          <option value="101-200">101-200 people</option>
                          <option value="201+">201+ people</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="venueSpace" className="block text-sm font-medium text-zinc-700 mb-1">
                        Preferred Venue *
                      </label>
                      <select
                        id="venueSpace"
                        name="venueSpace"
                        value={formData.venueSpace}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                      >
                        <option value="auditorium">Golden Jubilee Hall (Auditorium - capacity 200)</option>
                        <option value="nishimura">Nishimura Hall (Seminar Hall - capacity 80)</option>
                        <option value="yamamoto">Yamamoto Hall (Seminar Hall - capacity 60)</option>
                        <option value="classroom">Classroom (capacity 30)</option>
                        <option value="boardroom">Boardroom (capacity 15)</option>
                        <option value="fullFacility">Full Facility (Multiple Venues)</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-zinc-700 mb-1">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          min={today}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-zinc-700 mb-1">
                          End Date *
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          min={minEndDate}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="requirements" className="block text-sm font-medium text-zinc-700 mb-1">
                        Specific Requirements
                      </label>
                      <textarea
                        id="requirements"
                        name="requirements"
                        rows={4}
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="Please describe any specific requirements, AV needs, catering preferences, setup arrangements, etc."
                        className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red text-zinc-900"
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Terms & Submit */}
                  <div className="pt-4 border-t border-zinc-200">
                    <div className="mb-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            required
                            className="h-4 w-4 text-hinomaru-red focus:ring-hinomaru-red border-zinc-300 rounded text-zinc-900"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="agreeToTerms" className="text-zinc-700">
                            I agree to the {' '}
                            <Link href="/terms" className="text-hinomaru-red hover:text-sakura-700">
                              Terms and Conditions
                            </Link>
                            {' '} and {' '}
                            <Link href="/privacy" className="text-hinomaru-red hover:text-sakura-700">
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full btn-primary flex justify-center items-center"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Submit Event Booking Request'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-8 sticky top-24">
                <h3 className="text-xl font-bold text-zinc-900 mb-4">Venue Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-zinc-900 mb-2">Golden Jubilee Hall</h4>
                    <ul className="text-zinc-700 space-y-1">
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Capacity: 200 people</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Full A/V equipment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Stage and podium</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Multiple setup options</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-zinc-900 mb-2">Seminar Halls</h4>
                    <ul className="text-zinc-700 space-y-1">
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Nishimura Hall (80 people)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Yamamoto Hall (60 people)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Modern presentation equipment</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-zinc-900 mb-2">Other Spaces</h4>
                    <ul className="text-zinc-700 space-y-1">
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>8 Classrooms (30 people each)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Boardroom (15 people)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Dining hall for catering</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-200">
                    <h4 className="text-lg font-medium text-zinc-900 mb-2">Additional Services</h4>
                    <ul className="text-zinc-700 space-y-1">
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Catering options</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Technical support</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>On-site accommodation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Event coordination</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-200">
                    <h4 className="text-lg font-medium text-zinc-900 mb-2">Contact</h4>
                    <p className="text-zinc-700">
                      For immediate assistance with event planning:
                    </p>
                    <p className="mt-2">
                      <a href="tel:+919876543210" className="text-hinomaru-red hover:text-sakura-700 font-medium">
                        +91 9876 543 210
                      </a>
                    </p>
                    <p>
                      <a href="mailto:events@nkc.org" className="text-hinomaru-red hover:text-sakura-700 font-medium">
                        events@nkc.org
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
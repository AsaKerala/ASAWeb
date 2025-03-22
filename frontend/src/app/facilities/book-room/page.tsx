'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BookRoomPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    roomType: 'twin',
    guests: '1',
    checkIn: '',
    checkOut: '',
    specialRequirements: '',
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
      // This would be an API call in a real implementation
      // await api.bookRoom(formData);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      setErrorMessage('There was a problem submitting your booking request. Please try again or contact us directly.');
    }
  };
  
  // Calculate minimum dates for check-in (today) and check-out (day after check-in)
  const today = new Date().toISOString().split('T')[0];
  const minCheckout = formData.checkIn || today;
  
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
              <h1 className="text-3xl font-bold text-zinc-900 mb-4">Booking Request Received</h1>
              <p className="text-lg text-zinc-700">
                Thank you for your interest in staying at the Nippon Kerala Centre.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">What happens next?</h2>
              <ol className="space-y-3 list-decimal pl-5 text-zinc-700">
                <li>Our team will review your booking request</li>
                <li>You will receive an email confirmation within 24 hours</li>
                <li>Payment details and instructions will be included in the confirmation email</li>
                <li>Once payment is received, your booking will be finalized</li>
              </ol>
            </div>
            
            <div className="border-t border-zinc-200 pt-6 text-center">
              <p className="text-zinc-700 mb-6">
                If you have any questions, please contact us at{' '}
                <a href="mailto:bookings@nkc.org" className="text-hinomaru-red font-medium">
                  bookings@nkc.org
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Room Booking</h1>
            <p className="text-xl">Reserve your stay at the Nippon Kerala Centre</p>
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
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Reservation Details</h2>
                
                {formStatus === 'error' && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                    {errorMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
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
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-zinc-700 mb-1">
                          Organization
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Booking Details */}
                  <div className="space-y-4 pt-4 border-t border-zinc-200">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Booking Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="roomType" className="block text-sm font-medium text-zinc-700 mb-1">
                          Room Type *
                        </label>
                        <select
                          id="roomType"
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                        >
                          <option value="twin">Twin Room (2 single beds)</option>
                          <option value="suite">Suite Room (premium)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="guests" className="block text-sm font-medium text-zinc-700 mb-1">
                          Number of Guests *
                        </label>
                        <select
                          id="guests"
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkIn" className="block text-sm font-medium text-zinc-700 mb-1">
                          Check-in Date *
                        </label>
                        <input
                          type="date"
                          id="checkIn"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleChange}
                          min={today}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="checkOut" className="block text-sm font-medium text-zinc-700 mb-1">
                          Check-out Date *
                        </label>
                        <input
                          type="date"
                          id="checkOut"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleChange}
                          min={minCheckout}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="specialRequirements" className="block text-sm font-medium text-zinc-700 mb-1">
                        Special Requirements or Messages
                      </label>
                      <textarea
                        id="specialRequirements"
                        name="specialRequirements"
                        rows={4}
                        value={formData.specialRequirements}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
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
                            className="h-4 w-4 text-hinomaru-red focus:ring-hinomaru-red border-zinc-300 rounded"
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
                        'Submit Booking Request'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-8 sticky top-24">
                <h3 className="text-xl font-bold text-zinc-900 mb-4">Room Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-zinc-900 mb-2">Twin Room</h4>
                    <ul className="text-zinc-700 space-y-1">
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Two single beds</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Private bathroom</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Wi-Fi & TV</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Study desk</span>
                      </li>
                    </ul>
                    <p className="text-hinomaru-red font-medium mt-2">₹2,500 per night</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-zinc-900 mb-2">Suite Room</h4>
                    <ul className="text-zinc-700 space-y-1">
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Premium large room</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Queen-sized bed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Spacious bathroom</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Sitting area</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hinomaru-red mr-2">•</span>
                        <span>Japanese décor</span>
                      </li>
                    </ul>
                    <p className="text-hinomaru-red font-medium mt-2">₹4,000 per night</p>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-200">
                    <h4 className="text-lg font-medium text-zinc-900 mb-2">Contact</h4>
                    <p className="text-zinc-700">
                      For immediate assistance, please contact us:
                    </p>
                    <p className="mt-2">
                      <a href="tel:+919876543210" className="text-hinomaru-red hover:text-sakura-700 font-medium">
                        +91 9876 543 210
                      </a>
                    </p>
                    <p>
                      <a href="mailto:bookings@nkc.org" className="text-hinomaru-red hover:text-sakura-700 font-medium">
                        bookings@nkc.org
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
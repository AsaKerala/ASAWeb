'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

// Define FAQ item type
type FAQItem = {
  question: string;
  answer: string;
};

export default function ContactPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // FAQ data
  const faqs: FAQItem[] = [
    {
      question: 'How can I become a member of ASA Kerala?',
      answer: 'You can join ASA Kerala by filling out the online membership form and submitting the necessary documents for review.'
    },
    {
      question: 'What are the benefits of joining ASA Kerala?',
      answer: 'Members gain access to training programs, networking opportunities, and discounted facility bookings.'
    },
    {
      question: 'How can I register for training programs or internships?',
      answer: 'Registration details are available under the Programs & Events section. You can also contact us directly.'
    },
    {
      question: 'Is accommodation available at NKC for participants?',
      answer: 'Yes, NKC offers accommodation for participants of training programs, conferences, and events.'
    },
    {
      question: 'Can external organizations book NKC facilities for their events?',
      answer: 'Yes, institutions and organizations can book auditoriums, seminar halls, and classrooms for their training and conferences.'
    },
    {
      question: 'Are there any discounts for members on training programs?',
      answer: 'Yes, members receive discounts on training programs, facility bookings, and other events.'
    },
    {
      question: 'How do I get directions to Nippon Kerala Centre?',
      answer: 'You can use the Get Directions button on our website to navigate to our location.'
    },
    {
      question: 'What languages are used in training programs?',
      answer: 'Most training sessions are conducted in English, but some Japanese language programs are available.'
    },
    {
      question: 'How can I collaborate with ASA Kerala for business or research opportunities?',
      answer: 'You can reach out through our contact form or directly contact our office to discuss collaboration opportunities.'
    },
    {
      question: 'Who can I contact for further inquiries?',
      answer: 'You can call or email us using the contact details provided in the Contact Us section.'
    }
  ];
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrorMessage('');
    
    try {
      // Use the correct API URL with backend domain
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/contact`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
      
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send your message. Please try again later.');
    }
  };
  
  // Toggle FAQ accordion
  const toggleAccordion = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-16">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl text md:text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-xl">Get in touch with the ASA Kerala team</p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-black text-center mb-6">Get in Touch</h2>
            <p className="text-center text-zinc-600">
              We would love to hear from you! Whether you have questions about membership, training programs, events, or facility bookings, feel free to reach out to us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h3 className="text-xl font-bold mb-6 text-hinomaru-red">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sakura-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">
                        ASA Kerala, Nippon Kerala Centre,<br />
                        Kalamassery, Kochi, Kerala, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sakura-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-600">+91-484-2970123</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sakura-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">info@asakerala.org</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sakura-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Office Hours</h4>
                      <p className="text-gray-600">Monday - Friday | 9:00 AM - 5:00 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Visit Us Section */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold mb-6 text-hinomaru-red">Visit Us</h3>
                <p className="text-gray-600 mb-6">
                  Find us at our training and business center. Click below for directions:
                </p>
                
                {/* Google Maps embed */}
                <div className="rounded-lg overflow-hidden h-72 mb-4">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.147626553105!2d76.35796409999999!3d10.0584448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c06d4bbe0ab%3A0x8e73e5f05439876a!2sNippon%20Kerala%20Centre!5e0!3m2!1sen!2sin!4v1714557801739!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                
                <a 
                  href="https://www.google.com/maps/place/Nippon+Kerala+Centre/@10.0584448,76.3579641,17z/data=!3m2!4b1!5s0x3b080c06d45ff1d3:0x83eba78846b8b597!4m6!3m5!1s0x3b080c06d4bbe0ab:0x8e73e5f05439876a!8m2!3d10.0584395!4d76.360539!16s%2Fg%2F1q65ctt7s?entry=ttu"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-hinomaru-red hover:bg-sakura-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-6 text-hinomaru-red">Contact Form</h3>
              <p className="text-gray-600 mb-6">
                Have a specific inquiry? Fill out the form below and our team will get back to you at the earliest.
              </p>
              
              {/* Success message */}
              {formStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md">
                  <h4 className="font-bold mb-1">Message Sent!</h4>
                  <p>Thank you for reaching out. We'll respond to your inquiry as soon as possible.</p>
                </div>
              )}
              
              {/* Error message */}
              {formStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
                  <h4 className="font-bold mb-1">Something went wrong</h4>
                  <p>{errorMessage}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                    >
                      <option value="" disabled>Select a subject</option>
                      <option value="membership">Membership Inquiry</option>
                      <option value="program">Program/Training Inquiry</option>
                      <option value="facility">Facility Booking</option>
                      <option value="event">Event Information</option>
                      <option value="collaboration">Collaboration/Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-hinomaru-red"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-hinomaru-red hover:bg-sakura-700 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
          
          {/* FAQs Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${openFaqIndex === index ? 'transform rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaqIndex === index ? 'max-h-96 py-4' : 'max-h-0 py-0'
                    }`}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
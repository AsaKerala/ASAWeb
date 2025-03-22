'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// FAQ data
const faqs = [
  {
    question: "How can I become a member of ASA Kerala?",
    answer: "You can join ASA Kerala by filling out the online membership form and submitting the necessary documents for review."
  },
  {
    question: "What are the benefits of joining ASA Kerala?",
    answer: "Members gain access to training programs, networking opportunities, and discounted facility bookings."
  },
  {
    question: "How can I register for training programs or internships?",
    answer: "Registration details are available under the Programs & Events section. You can also contact us directly."
  },
  {
    question: "Is accommodation available at NKC for participants?",
    answer: "Yes, NKC offers accommodation for participants of training programs, conferences, and events."
  },
  {
    question: "Can external organizations book NKC facilities for their events?",
    answer: "Yes, institutions and organizations can book auditoriums, seminar halls, and classrooms for their training and conferences."
  },
  {
    question: "Are there any discounts for members on training programs?",
    answer: "Yes, members receive discounts on training programs, facility bookings, and other events."
  },
  {
    question: "How do I get directions to Nippon Kerala Centre?",
    answer: "You can use the Get Directions button on our website to navigate to our location."
  },
  {
    question: "What languages are used in training programs?",
    answer: "Most training sessions are conducted in English, but some Japanese language programs are available."
  },
  {
    question: "How can I collaborate with ASA Kerala for business or research opportunities?",
    answer: "You can reach out through our contact form or directly contact our office to discuss collaboration opportunities."
  },
  {
    question: "Who can I contact for further inquiries?",
    answer: "You can call or email us using the contact details provided in the Contact Us section."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // In a real implementation, we would send the form data to a backend API
      // For now, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      setErrorMessage('There was an error submitting your message. Please try again later.');
    }
  };

  const toggleAccordion = (index: number) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-white py-20">
        <div className="absolute inset-0 bg-[url('/images/contact/pattern-bg.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl">
              We would love to hear from you! Whether you have questions about membership, 
              training programs, events, or facility bookings, feel free to reach out to us.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-zinc-800">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-semibold text-zinc-800">Address</h3>
                      <p className="mt-1 text-zinc-600">
                        ASA Kerala, Nippon Kerala Centre, <br />
                        [Full Address Placeholder]
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-semibold text-zinc-800">Phone</h3>
                      <p className="mt-1 text-zinc-600">
                        [Phone Number Placeholder]
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-semibold text-zinc-800">Email</h3>
                      <p className="mt-1 text-zinc-600">
                        [Email Placeholder]
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hinomaru-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-semibold text-zinc-800">Office Hours</h3>
                      <p className="mt-1 text-zinc-600">
                        Monday - Friday<br />
                        9:00 AM - 5:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-4 text-zinc-800">Visit Us</h3>
                  <p className="text-zinc-600 mb-4">
                    Find us at our training and business center. Click below for directions:
                  </p>
                  <a 
                    href="https://maps.google.com/?q=Kerala+India" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block py-2 px-4 bg-hinomaru-red text-white font-medium rounded-md hover:bg-sakura-700 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-zinc-800">Contact Form</h2>
                <p className="text-zinc-600 mb-8">
                  Have a specific inquiry? Fill out the form below and our team will get back to you at the earliest.
                </p>
                
                {formStatus === 'success' ? (
                  <div className="rounded-md bg-green-50 p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-green-800 mb-2">Message Sent Successfully!</h3>
                    <p className="text-green-700 mb-4">
                      Thank you for reaching out. Our team will get back to you shortly.
                    </p>
                    <button
                      onClick={() => setFormStatus('idle')}
                      className="inline-block py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                          Name <span className="text-hinomaru-red">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                          Email <span className="text-hinomaru-red">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 mb-1">
                          Subject <span className="text-hinomaru-red">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                        >
                          <option value="">Select a subject</option>
                          <option value="Membership">Membership Inquiry</option>
                          <option value="Programs">Programs & Training</option>
                          <option value="Events">Events & Workshops</option>
                          <option value="Facilities">Facility Booking</option>
                          <option value="Business">Business Collaboration</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1">
                        Message <span className="text-hinomaru-red">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                      ></textarea>
                    </div>
                    
                    {formStatus === 'error' && (
                      <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}
                      </div>
                    )}
                    
                    <div>
                      <button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="inline-block py-3 px-6 bg-hinomaru-red text-white font-medium rounded-md hover:bg-sakura-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formStatus === 'submitting' ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : 'Send Message'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="overflow-hidden rounded-lg shadow-md">
            {/* Placeholder for Google Maps iframe - replace with actual embed code */}
            <div className="h-[400px] bg-zinc-200 flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-zinc-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-zinc-500">Map will be embedded here</p>
                <p className="text-sm text-zinc-400 mt-2">Replace with actual Google Maps embed code</p>
              </div>
            </div>
            {/* 
              Uncomment and replace with actual Google Maps embed:
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!..." 
                width="100%" 
                height="400" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            */}
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-16 bg-zinc-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none"
                  >
                    <span className="font-medium text-zinc-800">{faq.question}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-zinc-500 transform transition-transform ${
                        activeAccordion === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      activeAccordion === index ? 'max-h-40' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-4 text-zinc-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-hinomaru-red text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Connect with ASA Kerala?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            Explore our programs, training opportunities, and resources designed for professionals 
            who have trained or worked in Japan.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              href="/join-us" 
              className="py-3 px-8 bg-white text-hinomaru-red font-bold rounded-md hover:bg-zinc-100 transition"
            >
              Join ASA Kerala
            </Link>
            <Link 
              href="/programs-events" 
              className="py-3 px-8 border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

// Define form field types
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  membershipType: string;
  occupation: string;
  organization: string;
  educationalQualification: string;
  reasonForJoining: string;
  interests: string[];
  otherInterests: string;
  referredBy: string;
}

export default function MembershipApplicationPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    },
    membershipType: '',
    occupation: '',
    organization: '',
    educationalQualification: '',
    reasonForJoining: '',
    interests: [],
    otherInterests: '',
    referredBy: '',
  });
  
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof FormData] as Record<string, any>,
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        interests: [...formData.interests, value]
      });
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter(interest => interest !== value)
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/membership-application`,
        formData
      );
      
      if (response.data.success) {
        setSubmitSuccess(true);
        window.scrollTo(0, 0);
      } else {
        setSubmitError(response.data.message || 'Error submitting application. Please try again.');
      }
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || 
        'An error occurred while submitting your application. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Interest options
  const interestOptions = [
    { label: 'Japanese Language', value: 'language' },
    { label: 'Training Programs', value: 'training' },
    { label: 'Business Networking', value: 'networking' },
    { label: 'Cultural Exchange', value: 'cultural' },
    { label: 'Technology Transfer', value: 'technology' },
    { label: 'Academic Collaboration', value: 'academic' },
    { label: 'Other', value: 'other' },
  ];
  
  // If form is successfully submitted, show success message
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Application Submitted!</h1>
              <p className="text-zinc-600 mb-6">
                Thank you for applying for membership with ASA Kerala. We have received your application 
                and will review it shortly. You will be notified about the status of your application via email.
              </p>
              <div className="space-x-4">
                <Link 
                  href="/" 
                  className="inline-block px-6 py-2 border border-hinomaru-red text-hinomaru-red font-medium rounded-md hover:bg-hinomaru-red hover:text-white transition"
                >
                  Return to Home
                </Link>
                <Link 
                  href="/membership" 
                  className="inline-block px-6 py-2 bg-hinomaru-red text-white font-medium rounded-md hover:bg-hinomaru-red-dark transition"
                >
                  Back to Membership
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
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-white py-16">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Membership Application</h1>
            <p className="text-lg opacity-90">
              Fill out the form below to apply for ASA Kerala membership. We'll review your application 
              and get back to you with the next steps.
            </p>
          </div>
        </div>
      </section>
      
      {/* Application Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p className="font-medium">Application Error</p>
                <p>{submitError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 text-zinc-800 pb-2 border-b border-zinc-200">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-zinc-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                </div>
              </div>
              
              {/* Address Information */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 text-zinc-800 pb-2 border-b border-zinc-200">
                  Address Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label htmlFor="address.line1" className="block text-sm font-medium text-zinc-700 mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.line1"
                      name="address.line1"
                      required
                      value={formData.address.line1}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="address.line2" className="block text-sm font-medium text-zinc-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="address.line2"
                      name="address.line2"
                      value={formData.address.line2}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="address.city" className="block text-sm font-medium text-zinc-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      required
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="address.state" className="block text-sm font-medium text-zinc-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      required
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="address.pincode" className="block text-sm font-medium text-zinc-700 mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.pincode"
                      name="address.pincode"
                      required
                      value={formData.address.pincode}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                </div>
              </div>
              
              {/* Membership Details */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 text-zinc-800 pb-2 border-b border-zinc-200">
                  Membership Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label htmlFor="membershipType" className="block text-sm font-medium text-zinc-700 mb-1">
                      Membership Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="membershipType"
                      name="membershipType"
                      required
                      value={formData.membershipType}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    >
                      <option value="">Select Membership Type</option>
                      <option value="student">Student Membership (₹1,500/year)</option>
                      <option value="professional">Professional Membership (₹3,500/year)</option>
                      <option value="corporate">Corporate Membership (₹15,000/year)</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="occupation" className="block text-sm font-medium text-zinc-700 mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div className="col-span-2 md:col-span-1">
                    <label htmlFor="organization" className="block text-sm font-medium text-zinc-700 mb-1">
                      Organization/Institution
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="educationalQualification" className="block text-sm font-medium text-zinc-700 mb-1">
                      Educational Qualifications
                    </label>
                    <textarea
                      id="educationalQualification"
                      name="educationalQualification"
                      rows={3}
                      value={formData.educationalQualification}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="reasonForJoining" className="block text-sm font-medium text-zinc-700 mb-1">
                      Reasons for Joining ASA Kerala <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="reasonForJoining"
                      name="reasonForJoining"
                      required
                      rows={4}
                      value={formData.reasonForJoining}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                      placeholder="Please describe why you're interested in joining ASA Kerala..."
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <fieldset>
                      <legend className="text-sm font-medium text-zinc-700 mb-2">
                        Areas of Interest
                      </legend>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {interestOptions.map((option) => (
                          <div key={option.value} className="flex items-start">
                            <input
                              type="checkbox"
                              id={`interests-${option.value}`}
                              name="interests"
                              value={option.value}
                              checked={formData.interests.includes(option.value)}
                              onChange={handleCheckboxChange}
                              className="mt-1 mr-2"
                            />
                            <label
                              htmlFor={`interests-${option.value}`}
                              className="text-sm text-zinc-700"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                  
                  {formData.interests.includes('other') && (
                    <div className="col-span-2">
                      <label htmlFor="otherInterests" className="block text-sm font-medium text-zinc-700 mb-1">
                        Other Interests
                      </label>
                      <textarea
                        id="otherInterests"
                        name="otherInterests"
                        rows={2}
                        value={formData.otherInterests}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                        placeholder="Please specify your other interests..."
                      />
                    </div>
                  )}
                  
                  <div className="col-span-2">
                    <label htmlFor="referredBy" className="block text-sm font-medium text-zinc-700 mb-1">
                      Referred By (if any)
                    </label>
                    <input
                      type="text"
                      id="referredBy"
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={handleInputChange}
                      className="block w-full text-black px-4 py-2 border border-zinc-300 rounded-md focus:ring-hinomaru-red focus:border-hinomaru-red"
                    />
                  </div>
                </div>
              </div>
              
              {/* Terms and Privacy */}
              <div className="mb-8">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="terms" className="text-sm text-zinc-700">
                    I agree to the <Link href="/terms" className="text-hinomaru-red hover:underline">Terms of Service</Link> and 
                    <Link href="/privacy" className="text-hinomaru-red hover:underline"> Privacy Policy</Link>. I confirm that all 
                    the information provided above is accurate and complete.
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-3 px-8 bg-hinomaru-red text-white font-bold rounded-md hover:bg-hinomaru-red/90 transition ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/membership" className="text-hinomaru-red hover:underline">
              ← Back to Membership Information
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 
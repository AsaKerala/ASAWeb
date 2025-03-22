'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

// Mock API function to get program data (would be replaced with real API call)
const getProgram = (slug: string) => {
  // This is just a mock function to simulate API data
  // In a real app, you would fetch this data from your backend
  
  const programs = {
    'management-training-japan': {
      id: 1,
      name: 'Management Training in Japan',
      description: 'Leadership and strategic planning for professionals.',
      dates: [
        { start: 'May 15, 2024', end: 'May 29, 2024' },
        { start: 'October 10, 2024', end: 'October 24, 2024' }
      ],
    },
    'technical-training-japanese-industries': {
      id: 2,
      name: 'Technical Training in Japanese Industries',
      description: 'Hands-on experience in Japanese industrial techniques.',
      dates: [
        { start: 'June 5, 2024', end: 'June 26, 2024' },
        { start: 'November 8, 2024', end: 'November 29, 2024' }
      ],
    }
  };
  
  return programs[slug as keyof typeof programs] || null;
};

export default function ProgramRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchParam = searchParams.get('batch');
  
  const [program, setProgram] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState<number>(batchParam ? parseInt(batchParam) : 0);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    experience: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    expectations: '',
    hearAbout: '',
    agree: false,
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (params.slug) {
      // Get the program data
      const programData = getProgram(params.slug as string);
      
      if (programData) {
        setProgram(programData);
        // Set the selected batch based on URL parameter
        if (batchParam && parseInt(batchParam) < programData.dates.length) {
          setSelectedBatch(parseInt(batchParam));
        }
      } else {
        // Redirect to programs page if program not found
        router.push('/programs-events');
      }
      
      setIsLoading(false);
    }
  }, [params.slug, router, batchParam]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.agree) {
      setErrorMessage('Please agree to the terms and conditions to proceed.');
      return;
    }
    
    setFormStatus('submitting');
    setErrorMessage('');
    
    try {
      // This would be a real API call in production
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulating successful submission
      setFormStatus('success');
    } catch (error) {
      console.error('Registration error:', error);
      setFormStatus('error');
      setErrorMessage('There was an error processing your registration. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hinomaru-red"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-zinc-800 mb-4">Program Not Found</h1>
        <p className="text-zinc-600 mb-6">The program you are looking for does not exist or has been removed.</p>
        <Link href="/programs-events" className="btn-primary">
          View All Programs
        </Link>
      </div>
    );
  }

  // Success screen after form submission
  if (formStatus === 'success') {
    return (
      <div className="min-h-screen bg-zinc-50 py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-washi shadow-md border-t-4 border-hinomaru-red">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Registration Successful!</h1>
              <p className="text-zinc-600">Thank you for registering for {program.name}</p>
            </div>
            
            <div className="bg-zinc-50 p-4 rounded-md mb-6">
              <h2 className="font-semibold text-zinc-900 mb-2">Program Details:</h2>
              <p className="text-zinc-800">{program.name}</p>
              <p className="text-zinc-700 text-sm">
                {program.dates[selectedBatch].start} to {program.dates[selectedBatch].end}
              </p>
            </div>
            
            <p className="text-zinc-700 mb-6">
              We have sent a confirmation email to <strong>{formState.email}</strong> with all the details. 
              Our program coordinator will contact you shortly with further instructions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/programs-events" className="btn-outline w-full sm:w-auto text-center">
                Explore Other Programs
              </Link>
              <Link href="/" className="btn-primary w-full sm:w-auto text-center">
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-16">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <Link href={`/programs-events/${params.slug}`} className="text-zinc-50 hover:text-zinc-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Program Details
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Register for {program.name}</h1>
            <p className="text-xl">Complete the form below to secure your spot</p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-washi shadow-md mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Selected Program</h2>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-zinc-200 rounded-md bg-zinc-50">
                <div>
                  <h3 className="font-bold text-zinc-900">{program.name}</h3>
                  <p className="text-zinc-700 mt-1">{program.description}</p>
                </div>
              </div>

              {/* Batch Selection */}
              <div className="mt-6">
                <label className="block text-zinc-800 font-medium mb-2">Select Batch:</label>
                <div className="space-y-3">
                  {program.dates.map((date: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`batch-${index}`}
                        name="batch"
                        className="h-5 w-5 text-hinomaru-red focus:ring-hinomaru-red border-zinc-300"
                        checked={selectedBatch === index}
                        onChange={() => setSelectedBatch(index)}
                      />
                      <label htmlFor={`batch-${index}`} className="ml-2 block text-zinc-800">
                        {date.start} to {date.end}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-washi shadow-md">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Personal Information</h2>
              
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                  {errorMessage}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-zinc-800 font-medium mb-2">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formState.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-zinc-800 font-medium mb-2">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formState.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-zinc-800 font-medium mb-2">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-zinc-800 font-medium mb-2">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formState.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-zinc-900 mt-10 mb-6">Professional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="organization" className="block text-zinc-800 font-medium mb-2">
                    Organization / Company <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    required
                    value={formState.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="designation" className="block text-zinc-800 font-medium mb-2">
                    Designation / Role <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    required
                    value={formState.designation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="experience" className="block text-zinc-800 font-medium mb-2">
                  Years of Experience <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  required
                  value={formState.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                />
              </div>
              
              <h2 className="text-2xl font-bold text-zinc-900 mt-10 mb-6">Contact Address</h2>
              
              <div className="mb-6">
                <label htmlFor="address" className="block text-zinc-800 font-medium mb-2">
                  Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  value={formState.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="city" className="block text-zinc-800 font-medium mb-2">
                    City <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formState.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-zinc-800 font-medium mb-2">
                    State <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formState.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="pincode" className="block text-zinc-800 font-medium mb-2">
                    PIN / Postal Code <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    required
                    value={formState.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-zinc-800 font-medium mb-2">
                    Country <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    value={formState.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                  >
                    <option value="India">India</option>
                    <option value="Japan">Japan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-zinc-900 mt-10 mb-6">Additional Information</h2>
              
              <div className="mb-6">
                <label htmlFor="expectations" className="block text-zinc-800 font-medium mb-2">
                  What do you expect to learn from this program?
                </label>
                <textarea
                  id="expectations"
                  name="expectations"
                  rows={4}
                  value={formState.expectations}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                ></textarea>
              </div>
              
              <div className="mb-10">
                <label htmlFor="hearAbout" className="block text-zinc-800 font-medium mb-2">
                  How did you hear about this program?
                </label>
                <input
                  type="text"
                  id="hearAbout"
                  name="hearAbout"
                  value={formState.hearAbout}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:border-transparent"
                />
              </div>
              
              {/* Terms and Conditions */}
              <div className="mb-8">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agree"
                      name="agree"
                      type="checkbox"
                      checked={formState.agree}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-hinomaru-red focus:ring-hinomaru-red border-zinc-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="agree" className="text-zinc-800">
                      I agree to the <Link href="/terms" className="text-hinomaru-red hover:text-sakura-700">Terms and Conditions</Link> and <Link href="/privacy" className="text-hinomaru-red hover:text-sakura-700">Privacy Policy</Link>. <span className="text-red-600">*</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={formStatus === 'submitting' || !formState.agree}
                  className="w-full py-3 px-6 text-white bg-hinomaru-red hover:bg-sakura-700 focus:outline-none focus:ring-2 focus:ring-hinomaru-red focus:ring-opacity-50 font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {formStatus === 'submitting' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
} 
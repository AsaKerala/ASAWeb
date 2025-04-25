'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-16">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms and Conditions</h1>
            <p className="text-xl">Guidelines for participating in ASA Kerala programs and services</p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-washi shadow-md">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Terms of Service</h2>
            <p className="text-zinc-800 mb-6">
              Welcome to the ASA Kerala website. By accessing or using our services, you agree to be bound by these Terms and Conditions.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">1. Acceptance of Terms</h3>
            <p className="text-zinc-800 mb-6">
              By accessing and using the ASA Kerala website and participating in our programs, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access or use our services.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">2. Program Registration</h3>
            <p className="text-zinc-800 mb-6">
              When registering for our programs, you agree to provide accurate, current, and complete information. ASA Kerala reserves the right to reject any application without stating reasons. Registration confirmations are subject to minimum enrollment numbers and program availability.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">3. Payment and Refunds</h3>
            <p className="text-zinc-800 mb-6">
              Program fees must be paid according to the published schedules. Refund policies vary by program and are detailed in each program's specific terms. Generally, cancellations made more than 30 days before a program start date are eligible for a full refund minus processing fees. No refunds are provided for cancellations less than 14 days before program commencement.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">4. Program Changes</h3>
            <p className="text-zinc-800 mb-6">
              ASA Kerala reserves the right to make changes to program content, schedules, instructors, or locations as needed. While we strive to provide notice of significant changes, this may not always be possible. In case of program cancellation, registered participants will receive a full refund.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">5. Code of Conduct</h3>
            <p className="text-zinc-800 mb-6">
              Participants in ASA Kerala programs are expected to conduct themselves professionally and respectfully. Harassment, discrimination, or disruptive behavior will not be tolerated and may result in removal from programs without refund.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">6. Intellectual Property</h3>
            <p className="text-zinc-800 mb-6">
              All materials provided during programs are the intellectual property of ASA Kerala or our partners and instructors. Participants may not reproduce, distribute, or create derivative works without explicit permission.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">7. Liability Limitations</h3>
            <p className="text-zinc-800 mb-6">
              ASA Kerala is not liable for personal injuries, property damage, or losses incurred during participation in our programs. Participants assume all risks associated with travel and program attendance.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">8. Media Release</h3>
            <p className="text-zinc-800 mb-6">
              By participating in ASA Kerala programs, you grant permission for us to use photographs, video recordings, and testimonials for promotional purposes without compensation.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">9. Amendments</h3>
            <p className="text-zinc-800 mb-6">
              ASA Kerala reserves the right to update these Terms and Conditions at any time. Continued use of our services after changes constitutes acceptance of the revised terms.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">10. Governing Law</h3>
            <p className="text-zinc-800 mb-6">
              These Terms and Conditions are governed by the laws of Kerala, India. Any disputes shall be resolved in the courts of Kerala, India.
            </p>
            
            <div className="mt-10 pt-6 border-t border-zinc-200">
              <p className="text-zinc-700 mb-4">Last updated: March 22, 2025</p>
              <p className="text-zinc-700">
                If you have any questions about these Terms and Conditions, please contact us at{' '}
                <a href="mailto:info@asakeralaindia.org" className="text-hinomaru-red hover:text-sakura-700">
                  info@asakeralaindia.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
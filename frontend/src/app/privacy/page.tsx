'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-16">
        <div className="absolute inset-0 bg-[url('/assets/sakura-pattern.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-xl">How we collect, use, and protect your information</p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-washi shadow-md">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Our Commitment to Privacy</h2>
            <p className="text-zinc-800 mb-6">
              ASA Kerala is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or participate in our programs.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">1. Information We Collect</h3>
            <p className="text-zinc-800 mb-6">
              We collect personal information that you voluntarily provide to us when you register for programs, subscribe to newsletters, or contact us. This may include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">Contact information (name, email address, phone number)</li>
              <li className="mb-2">Professional information (organization, designation, experience)</li>
              <li className="mb-2">Address and demographic information</li>
              <li className="mb-2">Program preferences and feedback</li>
              <li className="mb-2">Payment information for program registrations</li>
            </ul>
            <p className="text-zinc-800 mb-6">
              We also automatically collect certain information when you visit our website, including IP address, browser type, device information, and pages visited, through cookies and similar technologies.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">2. How We Use Your Information</h3>
            <p className="text-zinc-800 mb-6">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">Processing program registrations and payments</li>
              <li className="mb-2">Communicating with you about programs and events</li>
              <li className="mb-2">Sending newsletters and updates about ASA Kerala</li>
              <li className="mb-2">Improving our website and program offerings</li>
              <li className="mb-2">Analyzing website usage and trends</li>
              <li className="mb-2">Complying with legal obligations</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">3. Information Sharing</h3>
            <p className="text-zinc-800 mb-6">
              We do not sell or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">Program partners and instructors (only as necessary for program delivery)</li>
              <li className="mb-2">Service providers who assist with website operations, payment processing, and communications</li>
              <li className="mb-2">Legal authorities when required by law or to protect our rights</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">4. Data Security</h3>
            <p className="text-zinc-800 mb-6">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no data transmission over the internet or storage system can be guaranteed to be 100% secure.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">5. Cookies and Tracking</h3>
            <p className="text-zinc-800 mb-6">
              Our website uses cookies and similar tracking technologies to enhance your experience and collect information about how you use our site. You can control cookie settings through your browser preferences.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">6. Your Rights</h3>
            <p className="text-zinc-800 mb-6">
              Depending on your location, you may have rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">Accessing the personal information we hold about you</li>
              <li className="mb-2">Correcting inaccurate or incomplete information</li>
              <li className="mb-2">Requesting deletion of your information</li>
              <li className="mb-2">Withdrawing consent for certain processing activities</li>
              <li className="mb-2">Objecting to processing of your information</li>
            </ul>
            <p className="text-zinc-800 mb-6">
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">7. Children's Privacy</h3>
            <p className="text-zinc-800 mb-6">
              Our website is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">8. Changes to This Policy</h3>
            <p className="text-zinc-800 mb-6">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will post the updated policy on our website with a revised effective date.
            </p>
            
            <div className="mt-10 pt-6 border-t border-zinc-200">
              <p className="text-zinc-700 mb-4">Last updated: June 15, 2024</p>
              <p className="text-zinc-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-zinc-700">
                Email: <a href="mailto:privacy@asakeralaindia.org" className="text-hinomaru-red hover:text-sakura-700">privacy@asakeralaindia.org</a>
              </p>
              <p className="text-zinc-700">
                Address: ASA Kerala Headquarters, Kochi, Kerala, India
              </p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <Link href="/programs-events" className="btn-outline mx-2">
              Back to Programs
            </Link>
            <Link href="/" className="btn-primary mx-2">
              Return to Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 
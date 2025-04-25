'use client';

import Link from 'next/link';

export default function DataProtectionPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-16">
        <div className="absolute inset-0 bg-[url('/images/contact/pattern-bg.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Data Protection Policy</h1>
            <p className="text-xl">How we protect and process your data</p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Data Protection Policy</h2>
            <p className="text-zinc-800 mb-6">
              At ASA Kerala, we are committed to protecting and respecting your privacy. This Data Protection Policy explains how we collect, use, and safeguard your personal information in compliance with applicable data protection laws and regulations.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">1. Introduction</h3>
            <p className="text-zinc-800 mb-6">
              ASA Kerala ("we", "us", "our") is the controller of your personal data under relevant data protection legislation. This policy outlines our practices regarding the collection, processing, storage, and protection of personal data we obtain through our website, services, events, and other interactions.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">2. Legal Basis for Processing Data</h3>
            <p className="text-zinc-800 mb-2">
              We process your personal data on the following legal grounds:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">
                <strong>Consent:</strong> When you explicitly agree to the processing of your personal data for specified purposes.
              </li>
              <li className="mb-2">
                <strong>Contract:</strong> When processing is necessary for the performance of a contract with you or to take steps at your request before entering into a contract.
              </li>
              <li className="mb-2">
                <strong>Legal Obligation:</strong> When processing is necessary to comply with a legal obligation to which we are subject.
              </li>
              <li className="mb-2">
                <strong>Legitimate Interest:</strong> When processing is necessary for our legitimate interests or those of a third party, except where such interests are overridden by your fundamental rights and freedoms.
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">3. Data We Collect</h3>
            <p className="text-zinc-800 mb-2">
              We may collect the following types of personal data:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">
                <strong>Identity Data:</strong> Name, gender, date of birth, membership number.
              </li>
              <li className="mb-2">
                <strong>Contact Data:</strong> Email address, postal address, phone number.
              </li>
              <li className="mb-2">
                <strong>Professional Data:</strong> Organization, job title, professional history, educational qualifications.
              </li>
              <li className="mb-2">
                <strong>Technical Data:</strong> IP address, login data, browser type and version, device information, operating system, and other technology on the devices you use to access our website.
              </li>
              <li className="mb-2">
                <strong>Usage Data:</strong> Information about how you use our website, products, and services.
              </li>
              <li className="mb-2">
                <strong>Marketing and Communications Data:</strong> Your preferences in receiving marketing from us and your communication preferences.
              </li>
              <li className="mb-2">
                <strong>Financial Data:</strong> Payment information for program registrations or membership fees.
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">4. How We Use Your Data</h3>
            <p className="text-zinc-800 mb-2">
              We use your personal data for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">
                To register you as a member or program participant.
              </li>
              <li className="mb-2">
                To manage our relationship with you, including notifications about changes to our terms or policies.
              </li>
              <li className="mb-2">
                To provide you with information, products, or services you request from us.
              </li>
              <li className="mb-2">
                To administer and protect our organization and website.
              </li>
              <li className="mb-2">
                To measure or understand the effectiveness of our services and improve our operations.
              </li>
              <li className="mb-2">
                To make suggestions and recommendations to you about events or services that may interest you.
              </li>
              <li className="mb-2">
                To comply with legal and regulatory obligations.
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">5. Data Retention</h3>
            <p className="text-zinc-800 mb-6">
              We will retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure, the purposes for which we process the data, and applicable legal requirements.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">6. Data Security</h3>
            <p className="text-zinc-800 mb-6">
              We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, accessed, altered, or disclosed in an unauthorized way. We limit access to your personal data to employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions, and they are subject to a duty of confidentiality.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">7. Data Sharing</h3>
            <p className="text-zinc-800 mb-2">
              We may share your personal data with:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">
                <strong>Service Providers:</strong> Third parties who provide services to us, such as website hosting, IT support, payment processing, and event management.
              </li>
              <li className="mb-2">
                <strong>Professional Advisers:</strong> Including lawyers, auditors, and insurers who provide consultancy, banking, legal, insurance, and accounting services.
              </li>
              <li className="mb-2">
                <strong>Regulatory Authorities:</strong> Government bodies, regulators, and other authorities who require reporting of processing activities in certain circumstances.
              </li>
              <li className="mb-2">
                <strong>Program Partners:</strong> In cases where programs or services are delivered in partnership with other organizations, but only to the extent necessary for program delivery.
              </li>
            </ul>
            <p className="text-zinc-800 mb-6">
              We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your personal data for specified purposes and in accordance with our instructions.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">8. International Transfers</h3>
            <p className="text-zinc-800 mb-6">
              As we operate in the context of Indo-Japanese relations, we may transfer your personal data to countries outside of India. When we do, we ensure a similar degree of protection is afforded to it by implementing appropriate safeguards, including standard contractual clauses approved by relevant data protection authorities.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">9. Your Rights</h3>
            <p className="text-zinc-800 mb-2">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">
                <strong>Request access</strong> to your personal data.
              </li>
              <li className="mb-2">
                <strong>Request correction</strong> of incomplete or inaccurate personal data.
              </li>
              <li className="mb-2">
                <strong>Request erasure</strong> of your personal data.
              </li>
              <li className="mb-2">
                <strong>Object to processing</strong> of your personal data.
              </li>
              <li className="mb-2">
                <strong>Request restriction</strong> of processing of your personal data.
              </li>
              <li className="mb-2">
                <strong>Request transfer</strong> of your personal data to you or a third party.
              </li>
              <li className="mb-2">
                <strong>Withdraw consent</strong> at any time where we rely on consent to process your personal data.
              </li>
            </ul>
            <p className="text-zinc-800 mb-6">
              You can exercise these rights by contacting us using the details provided at the end of this policy. Please note that these rights are not absolute and may be subject to certain conditions and exceptions under applicable law.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">10. Data Protection Officer</h3>
            <p className="text-zinc-800 mb-6">
              We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this policy. If you have any questions about this policy, including any requests to exercise your legal rights, please contact our DPO using the details provided below.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">11. Complaints</h3>
            <p className="text-zinc-800 mb-6">
              If you have any concerns about our use of your personal data, you can make a complaint to us using the contact details below. You also have the right to complain to the relevant data protection authority in your jurisdiction if you are not satisfied with our response.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">12. Changes to This Policy</h3>
            <p className="text-zinc-800 mb-6">
              We may update this Data Protection Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on our website with a revised effective date. Please check this page periodically for updates.
            </p>
            
            <div className="mt-10 pt-6 border-t border-zinc-200">
              <p className="text-zinc-700 mb-4">Last updated: July 1, 2024</p>
              <p className="text-zinc-700 mb-2">
                <strong>Contact Information:</strong>
              </p>
              <p className="text-zinc-700 mb-2">
                Data Protection Officer<br />
                ASA Kerala<br />
                Nippon Kerala Centre<br />
                [Full Address]
              </p>
              <p className="text-zinc-700">
                Email: <a href="mailto:dataprotection@asakeralaindia.org" className="text-hinomaru-red hover:text-sakura-700">dataprotection@asakeralaindia.org</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
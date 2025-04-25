'use client';

import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header Banner */}
      <section className="relative bg-gradient-to-r from-hinomaru-red to-sakura-700 text-zinc-50 py-16">
        <div className="absolute inset-0 bg-[url('/images/contact/pattern-bg.png')] bg-repeat opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cookie Policy</h1>
            <p className="text-xl">Understanding how we use cookies on our website</p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Cookie Policy</h2>
            <p className="text-zinc-800 mb-6">
              Last updated: July 1, 2024
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">1. Introduction</h3>
            <p className="text-zinc-800 mb-6">
              This Cookie Policy explains how ASA Kerala ("we", "us", "our") uses cookies and similar technologies on our website. This policy should be read alongside our <Link href="/privacy" className="text-hinomaru-red hover:underline">Privacy Policy</Link>, which explains how we use personal information.
            </p>
            <p className="text-zinc-800 mb-6">
              By continuing to browse or use our website, you agree that we can store and access cookies and similar technologies as described in this Cookie Policy.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">2. What Are Cookies?</h3>
            <p className="text-zinc-800 mb-6">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go offline, while session cookies are deleted as soon as you close your web browser.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">3. How We Use Cookies</h3>
            <p className="text-zinc-800 mb-6">
              We use different types of cookies for different reasons:
            </p>
            
            <h4 className="text-lg font-semibold text-zinc-900 mb-3">Essential Cookies</h4>
            <p className="text-zinc-800 mb-6">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure areas of the website, and access to member features. The website cannot function properly without these cookies, and they can only be disabled by changing your browser preferences.
            </p>
            
            <h4 className="text-lg font-semibold text-zinc-900 mb-3">Performance Cookies</h4>
            <p className="text-zinc-800 mb-6">
              These cookies collect information about how visitors use a website, for instance which pages visitors go to most often. They help us improve how our website works and allow us to test different design ideas. All information these cookies collect is aggregated and anonymous.
            </p>
            
            <h4 className="text-lg font-semibold text-zinc-900 mb-3">Functionality Cookies</h4>
            <p className="text-zinc-800 mb-6">
              These cookies allow the website to remember choices you make (such as your language or the region you are in) and provide enhanced, more personal features. They may also be used to provide services you have asked for such as watching a video or commenting on a blog.
            </p>
            
            <h4 className="text-lg font-semibold text-zinc-900 mb-3">Targeting/Advertising Cookies</h4>
            <p className="text-zinc-800 mb-6">
              These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign. They are usually placed by advertising networks with our permission. They remember that you have visited a website and this information is shared with other organizations such as advertisers.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">4. Specific Cookies We Use</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-zinc-200">
                <thead className="bg-zinc-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-900 border-b">Cookie Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-900 border-b">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-900 border-b">Purpose</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-900 border-b">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-800 text-sm">
                  <tr>
                    <td className="px-4 py-2 border-b">_asa_session</td>
                    <td className="px-4 py-2 border-b">Essential</td>
                    <td className="px-4 py-2 border-b">Used to identify your session on the website</td>
                    <td className="px-4 py-2 border-b">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">asa_auth</td>
                    <td className="px-4 py-2 border-b">Essential</td>
                    <td className="px-4 py-2 border-b">Used to keep you logged in as a member</td>
                    <td className="px-4 py-2 border-b">30 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">asa_preferences</td>
                    <td className="px-4 py-2 border-b">Functionality</td>
                    <td className="px-4 py-2 border-b">Stores your preferences such as language or display settings</td>
                    <td className="px-4 py-2 border-b">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">_ga</td>
                    <td className="px-4 py-2 border-b">Performance</td>
                    <td className="px-4 py-2 border-b">Used by Google Analytics to distinguish users</td>
                    <td className="px-4 py-2 border-b">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">_gid</td>
                    <td className="px-4 py-2 border-b">Performance</td>
                    <td className="px-4 py-2 border-b">Used by Google Analytics to distinguish users</td>
                    <td className="px-4 py-2 border-b">24 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">_fbp</td>
                    <td className="px-4 py-2 border-b">Targeting</td>
                    <td className="px-4 py-2 border-b">Used by Facebook to deliver a series of advertisement products</td>
                    <td className="px-4 py-2 border-b">3 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">5. Third-Party Cookies</h3>
            <p className="text-zinc-800 mb-6">
              Some cookies are placed by third parties on our website. These third parties may include analytics services (like Google Analytics), social media platforms (like Facebook or Twitter), and advertising networks. We do not control the use of these third-party cookies and recommend you check the relevant third party's website for more information about them and how to opt out.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">6. Managing Cookies</h3>
            <p className="text-zinc-800 mb-2">
              Most web browsers allow you to manage your cookie preferences. You can:
            </p>
            <ul className="list-disc pl-6 mb-6 text-zinc-800">
              <li className="mb-2">
                Delete cookies from your device
              </li>
              <li className="mb-2">
                Block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies
              </li>
              <li className="mb-2">
                Set your browser to notify you when you receive a cookie
              </li>
            </ul>
            <p className="text-zinc-800 mb-6">
              Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, and some services may not function properly.
            </p>
            <p className="text-zinc-800 mb-6">
              To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-hinomaru-red hover:underline">www.allaboutcookies.org</a> or <a href="https://www.cookiesandyou.com/" target="_blank" rel="noopener noreferrer" className="text-hinomaru-red hover:underline">www.cookiesandyou.com</a>.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">7. Changes to Our Cookie Policy</h3>
            <p className="text-zinc-800 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page with an updated revision date. If we make significant changes to this policy, we may also notify you by other means, such as sending an email or posting a notice on our home page.
            </p>
            
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">8. Contact Us</h3>
            <p className="text-zinc-800 mb-6">
              If you have any questions about our use of cookies, please contact us:
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
                Email: <a href="mailto:privacy@asakeralaindia.org" className="text-hinomaru-red hover:text-sakura-700">privacy@asakeralaindia.org</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
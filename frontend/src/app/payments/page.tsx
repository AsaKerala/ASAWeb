import Image from 'next/image';
import PageHeader from "@/components/PageHeader";

export default function PaymentsPage() {
    return (
        <main className="min-h-screen">
            <PageHeader
                title="Payments"
                subtitle="Bank details and QR code for payments"
                backgroundImage="/assets/about-bg.jpg" // Using an existing background or default
            />

            <section className="py-16 container-custom">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-center text-zinc-800 mb-8">
                            Payment Details
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                            {/* Bank Details */}
                            <div className="flex-1 space-y-6">
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <h3 className="text-xl font-semibold text-hinomaru-red mb-4 border-b pb-2">
                                        Bank Account Details
                                    </h3>
                                    <div className="space-y-4 text-zinc-700">
                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="font-medium text-zinc-900">Account Name:</span>
                                            <span>Alumni Society of AOTS</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="font-medium text-zinc-900">Bank:</span>
                                            <span>State Bank of India</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="font-medium text-zinc-900">Account Number:</span>
                                            <span className="font-mono text-lg">57039048991</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                            <span className="font-medium text-zinc-900">IFSC Code:</span>
                                            <span className="font-mono text-lg">SBIN0070145</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                    <h3 className="text-xl font-semibold text-hinomaru-red mb-4 border-b pb-2">
                                        UPI Details
                                    </h3>
                                    <div className="flex flex-col sm:flex-row sm:justify-between text-zinc-700">
                                        <span className="font-medium text-zinc-900">UPI ID:</span>
                                        <span className="font-mono text-lg">aluminsociety@sbi</span>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="flex-1 flex flex-col items-center">
                                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-4">
                                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                                        <Image
                                            src="/assets/asa-qr.jpg"
                                            alt="Payment QR Code"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <p className="text-zinc-500 text-sm text-center">
                                    Scan this QR code with any UPI app to pay
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 text-center text-zinc-600 text-sm">
                            <p>Please allow some time for payment confirmation if applicable.</p>
                            <p>For any issues, please contact us.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

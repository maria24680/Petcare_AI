'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSuccess(false), 5000);
        }, 1500);
    };

    return (
        <>
            <Navbar />
            <main className="pt-16">
                {/* Hero Section */}
                <section className="relative bg-[#111844] text-white py-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4B5694] rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7288AE] rounded-full blur-3xl"></div>
                    </div>
                    <div className="container-custom relative text-center">
                        <div className="inline-flex items-center gap-2 bg-[#4B5694]/30 rounded-full px-4 py-2 mb-6">
                            <Sparkles className="w-4 h-4 text-[#EAE0CF]" />
                            <span className="text-sm text-[#EAE0CF]">Contact Us</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-20 bg-[#F8F6F2]">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white rounded-2xl p-6 card-shadow text-center hover:shadow-xl transition">
                                <div className="w-14 h-14 bg-[#4B5694]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Mail className="w-7 h-7 text-[#4B5694]" />
                                </div>
                                <h4 className="font-semibold text-[#111844]">Email</h4>
                                <p className="text-sm text-gray-600">support@petcareai.com</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 card-shadow text-center hover:shadow-xl transition">
                                <div className="w-14 h-14 bg-[#7288AE]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Phone className="w-7 h-7 text-[#7288AE]" />
                                </div>
                                <h4 className="font-semibold text-[#111844]">Phone</h4>
                                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 card-shadow text-center hover:shadow-xl transition">
                                <div className="w-14 h-14 bg-[#EAE0CF] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MapPin className="w-7 h-7 text-[#111844]" />
                                </div>
                                <h4 className="font-semibold text-[#111844]">Address</h4>
                                <p className="text-sm text-gray-600">123 Pet Care St, NY 10001</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 card-shadow max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-[#111844] mb-6">Send a Message</h2>

                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                    ✅ Message sent successfully! We'll get back to you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Your Name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        icon={<User className="w-4 h-4" />}
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        icon={<Mail className="w-4 h-4" />}
                                        required
                                    />
                                </div>
                                <Input
                                    label="Subject"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                                <div>
                                    <label className="block text-sm font-medium text-[#111844] mb-1">
                                        Message
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            rows={5}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                            placeholder="Tell us how we can help..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    loading={loading}
                                    className="w-full"
                                    icon={<Send className="w-4 h-4" />}
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
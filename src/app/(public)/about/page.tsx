'use client';

import Link from 'next/link';
import { PawPrint, Heart, Shield, Users, Bot, Store, Award, Clock, Sparkles, Rocket, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export default function AboutPage() {
    const { data: stats } = useQuery({
        queryKey: ['aboutStats'],
        queryFn: async () => {
            try {
                const response = await apiClient.get('/admin/dashboard');
                return response.data.data;
            } catch {
                return null;
            }
        },
    });

    const totalUsers = stats?.totalUsers || 0;
    const totalPets = stats?.totalPets || 0;
    const totalVendors = stats?.totalVendors || 0;

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
                            <span className="text-sm text-[#EAE0CF]">About PetCare AI</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Smart Pet Care Assistant
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            We're on a mission to make pet care smarter, easier, and more accessible for everyone.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 bg-white">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1.5 rounded-full mb-4">Our Mission</span>
                                <h2 className="text-3xl font-bold text-[#111844] mb-4">
                                    Empowering Pet Parents with <span className="text-[#4B5694]">AI</span>
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    PetCare AI is dedicated to making pet care smarter, easier, and more accessible
                                    for everyone. We believe that every pet deserves the best care possible, and with
                                    the power of AI, we're helping pet parents make informed decisions about their
                                    furry family members.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Our platform combines cutting-edge artificial intelligence with a deep understanding
                                    of pet care to provide personalized advice, connect you with trusted vendors, and
                                    simplify pet management.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#F8F6F2] rounded-2xl p-6 text-center">
                                    <div className="w-14 h-14 bg-[#4B5694]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Users className="w-7 h-7 text-[#4B5694]" />
                                    </div>
                                    <p className="text-2xl font-bold text-[#111844]">{totalUsers}+</p>
                                    <p className="text-sm text-gray-500">Pet Parents</p>
                                </div>
                                <div className="bg-[#F8F6F2] rounded-2xl p-6 text-center">
                                    <div className="w-14 h-14 bg-[#7288AE]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Heart className="w-7 h-7 text-[#7288AE]" />
                                    </div>
                                    <p className="text-2xl font-bold text-[#111844]">{totalPets}+</p>
                                    <p className="text-sm text-gray-500">Happy Pets</p>
                                </div>
                                <div className="bg-[#F8F6F2] rounded-2xl p-6 text-center">
                                    <div className="w-14 h-14 bg-[#EAE0CF] rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Store className="w-7 h-7 text-[#111844]" />
                                    </div>
                                    <p className="text-2xl font-bold text-[#111844]">{totalVendors}+</p>
                                    <p className="text-sm text-gray-500">Trusted Vendors</p>
                                </div>
                                <div className="bg-[#F8F6F2] rounded-2xl p-6 text-center">
                                    <div className="w-14 h-14 bg-[#111844]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Award className="w-7 h-7 text-[#111844]" />
                                    </div>
                                    <p className="text-2xl font-bold text-[#111844]">4.9/5</p>
                                    <p className="text-sm text-gray-500">User Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-[#F8F6F2]">
                    <div className="container-custom">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1.5 rounded-full mb-4">Our Values</span>
                            <h2 className="text-3xl font-bold text-[#111844] mb-4">
                                What Drives Us
                            </h2>
                            <p className="text-gray-600">
                                These core values guide everything we do
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-2xl p-8 card-shadow hover:shadow-xl transition">
                                <div className="w-14 h-14 bg-[#4B5694]/10 rounded-xl flex items-center justify-center mb-4">
                                    <Heart className="w-7 h-7 text-[#4B5694]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#111844] mb-2">Pet First</h3>
                                <p className="text-gray-600">
                                    Everything we do is centered around the well-being of your pets.
                                </p>
                            </div>
                            <div className="bg-white rounded-2xl p-8 card-shadow hover:shadow-xl transition">
                                <div className="w-14 h-14 bg-[#7288AE]/10 rounded-xl flex items-center justify-center mb-4">
                                    <Bot className="w-7 h-7 text-[#7288AE]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#111844] mb-2">AI-Powered</h3>
                                <p className="text-gray-600">
                                    Advanced AI provides personalized pet care advice and recommendations.
                                </p>
                            </div>
                            <div className="bg-white rounded-2xl p-8 card-shadow hover:shadow-xl transition">
                                <div className="w-14 h-14 bg-[#EAE0CF] rounded-xl flex items-center justify-center mb-4">
                                    <Shield className="w-7 h-7 text-[#111844]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#111844] mb-2">Trust & Safety</h3>
                                <p className="text-gray-600">
                                    Verified vendors, secure data, and trusted recommendations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-white">
                    <div className="container-custom">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1.5 rounded-full mb-4">Team</span>
                            <h2 className="text-3xl font-bold text-[#111844] mb-4">
                                Meet Our Team
                            </h2>
                            <p className="text-gray-600">
                                Passionate pet lovers dedicated to making pet care smarter
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                { name: 'Dr. Sarah Johnson', role: 'Veterinary Advisor', initials: 'SJ' },
                                { name: 'Michael Chen', role: 'AI Engineer', initials: 'MC' },
                                { name: 'Emily Davis', role: 'Pet Care Expert', initials: 'ED' },
                                { name: 'David Wilson', role: 'Product Designer', initials: 'DW' },
                            ].map((member, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#4B5694] to-[#7288AE] rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3 shadow-lg">
                                        {member.initials}
                                    </div>
                                    <h4 className="font-semibold text-[#111844]">{member.name}</h4>
                                    <p className="text-sm text-gray-500">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-[#111844] text-white">
                    <div className="container-custom text-center">
                        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Be part of the smart pet care revolution
                        </p>
                        <Link
                            href="/register"
                            className="bg-[#EAE0CF] text-[#111844] px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition inline-flex items-center gap-2"
                        >
                            Get Started <Rocket className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
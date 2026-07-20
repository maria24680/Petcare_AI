import Link from 'next/link';
import { PawPrint, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#111844] text-white">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <PawPrint className="w-6 h-6 text-[#EAE0CF]" />
                            <span className="text-lg font-bold">PetCare AI</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Smart pet care assistant for modern pet parents.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-[#EAE0CF] transition">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#EAE0CF] transition">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#EAE0CF] transition">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#EAE0CF] transition">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/pets" className="hover:text-white transition">Explore Pets</Link></li>
                            <li><Link href="/vendors" className="hover:text-white transition">Find Vendors</Link></li>
                            <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">For Vendors</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/vendor-register" className="hover:text-white transition">Register as Vendor</Link></li>
                            <li><Link href="/dashboard/vendor/dashboard" className="hover:text-white transition">Vendor Dashboard</Link></li>
                            <li><Link href="/dashboard/vendor/add-pet" className="hover:text-white transition">List a Pet</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#4B5694]/30 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2024 PetCare AI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
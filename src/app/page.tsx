'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  PawPrint, Bot, Store, Heart, Shield, Users,
  Star, ChevronRight, Sparkles, Clock, Award,
  ShoppingBag, TrendingUp, Calendar, CheckCircle,
  ArrowRight, Zap, Globe, Phone, Mail, MapPin,
  Facebook, Twitter, Instagram, Youtube,
  ChevronDown, Menu, X, LogOut, LayoutDashboard
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { endpoints } from '@/lib/api/endpoints';

interface Pet {
  _id: string;
  petName: string;
  petType: string;
  breed: string;
  age: number;
  weight?: number;
  imageUrl?: string;
  description?: string;
  isPublic?: boolean;
  isAvailable?: boolean;
  price?: number;
  healthStatus?: string;
  vaccinationStatus?: { isVaccinated: boolean };
}

const PET_CATEGORIES = [
  { label: 'Dogs', type: 'Dog', emoji: '🐕' },
  { label: 'Cats', type: 'Cat', emoji: '🐈' },
  { label: 'Birds', type: 'Bird', emoji: '🦜' },
  { label: 'Rabbits', type: 'Rabbit', emoji: '🐇' },
  { label: 'Fish', type: 'Fish', emoji: '🐠' },
  { label: 'Other', type: 'Other', emoji: '🐾' },
];

function PetImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#4B5694]/10 text-5xl">
        🐾
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

function PetCard({ pet }: { pet: Pet }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden card-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <PetImage src={pet.imageUrl} alt={pet.petName} />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-[#111844] text-xs font-semibold px-3 py-1 rounded-full">
            {pet.petType}
          </span>
          {pet.vaccinationStatus?.isVaccinated && (
            <span className="bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" /> Vaccinated
            </span>
          )}
        </div>
        {typeof pet.price === 'number' && (
          <div className="absolute bottom-3 right-3 bg-[#111844] text-[#EAE0CF] text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
            ${pet.price}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1 gap-2">
          <h3 className="font-semibold text-lg text-[#111844]">{pet.petName}</h3>
          {pet.healthStatus && (
            <span className="text-xs text-emerald-600 font-medium whitespace-nowrap mt-1">
              {pet.healthStatus}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-3">
          {pet.breed} · {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
        </p>
        <Link
          href={`/pets/${pet._id}`}
          className="inline-flex items-center gap-1 text-[#4B5694] font-semibold text-sm group-hover:gap-2 transition"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function PetCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden card-shadow animate-pulse">
      <div className="h-56 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState(false);
  const [totalPets, setTotalPets] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUserRole(user.role);
    }
  }, []);

  useEffect(() => {
    endpoints.pets
      .getAll({ limit: 6 })
      .then((response) => {
        const { data, pagination } = response.data;
        const available = (data || []).filter(
          (pet: Pet) => pet.isPublic && pet.isAvailable !== false
        );
        setPets(available);
        if (pagination?.total !== undefined) setTotalPets(pagination.total);
      })
      .catch(() => setPetsError(true))
      .finally(() => setPetsLoading(false));
  }, []);

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/register';
    if (userRole === 'admin') return '/dashboard/admin/dashboard';
    if (userRole === 'vendor') return '/dashboard/vendor/dashboard';
    return '/dashboard';
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-[#111844] text-white overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4B5694] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7288AE] rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container-custom py-20 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#4B5694]/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-[#7288AE]/20">
                  <Sparkles className="w-4 h-4 text-[#EAE0CF]" />
                  <span className="text-sm text-[#EAE0CF]">AI-Powered Pet Care</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Smart Pet Care
                  <span className="text-[#7288AE] block"> Assistant</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
                  Manage your pets, get AI-powered care guidance, find trusted vendors,
                  and keep all your pet information in one place.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={getDashboardLink()}
                    className="group bg-[#EAE0CF] text-[#111844] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center gap-2 shadow-lg shadow-[#EAE0CF]/20"
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                  <Link
                    href="/pets"
                    className="border border-[#EAE0CF] text-[#EAE0CF] px-8 py-3 rounded-lg font-semibold hover:bg-[#EAE0CF] hover:text-[#111844] transition"
                  >
                    Explore Pets
                  </Link>
                </div>
                <div className="flex items-center gap-8 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-[#4B5694] border-2 border-[#111844] flex items-center justify-center text-xs font-semibold">
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-300">1.2k+ pet parents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-300">4.9/5 rating</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-[#4B5694]/20 backdrop-blur-sm rounded-2xl p-8 border border-[#7288AE]/30 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#EAE0CF] rounded-full flex items-center justify-center animate-bounce">
                      <Bot className="w-6 h-6 text-[#111844]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Assistant</h3>
                      <p className="text-sm text-gray-300">Ask any pet care question</p>
                    </div>
                  </div>
                  <div className="bg-[#111844] rounded-lg p-4 mb-4 border border-[#4B5694]/30">
                    <p className="text-sm text-[#EAE0CF]">"My dog is losing hair. What should I do?"</p>
                  </div>
                  <div className="bg-[#4B5694] rounded-lg p-4">
                    <p className="text-sm text-white leading-relaxed">
                      Based on your description, here are some possible causes and care suggestions...
                    </p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#7288AE] rounded-full opacity-20 blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="container-custom">
            <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-6">
              Trusted by pet parents and businesses worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <span className="text-2xl font-bold text-[#111844]">🐾 PetCare</span>
              <span className="text-2xl font-bold text-[#4B5694]">🏥 VetCare</span>
              <span className="text-2xl font-bold text-[#7288AE]">🛍️ PetShop</span>
              <span className="text-2xl font-bold text-[#EAE0CF] text-[#111844]">🐕 DoggyDay</span>
              <span className="text-2xl font-bold text-[#4B5694]">🐈 CatLovers</span>
            </div>
          </div>
        </section>

        {/* Featured Pets Section (live data) */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1 rounded-full mb-4">
                  Available Now
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#111844] mb-2">
                  Meet Pets Looking for a Home
                </h2>
                <p className="text-gray-600 text-lg max-w-xl">
                  {totalPets !== null
                    ? `${totalPets} pet${totalPets === 1 ? '' : 's'} listed by verified vendors right now.`
                    : 'Real listings from verified vendors on PetCare AI.'}
                </p>
              </div>
              <Link
                href="/pets"
                className="inline-flex items-center gap-1 text-[#4B5694] font-semibold hover:gap-2 transition whitespace-nowrap"
              >
                View all pets <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {petsLoading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <PetCardSkeleton key={i} />
                ))}
              </div>
            ) : petsError ? (
              <div className="text-center py-12 bg-[#F8F6F2] rounded-2xl">
                <p className="text-gray-600">Couldn't load pets right now. Please try again shortly.</p>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-12 bg-[#F8F6F2] rounded-2xl">
                <PawPrint className="w-10 h-10 text-[#4B5694] mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No pets are listed yet. Be the first vendor to add one.</p>
                <Link
                  href="/vendor-register"
                  className="inline-flex items-center gap-1 text-[#4B5694] font-semibold hover:underline"
                >
                  Register as Vendor <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {pets.map((pet) => (
                  <PetCard key={pet._id} pet={pet} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Pet Categories Section */}
        <section className="py-16 bg-[#F8F6F2]">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1 rounded-full mb-4">
                Browse by Type
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111844] mb-4">
                Find Your Perfect Companion
              </h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {PET_CATEGORIES.map((category) => (
                <Link
                  key={category.type}
                  href={`/pets?type=${category.type}`}
                  className="group bg-white rounded-2xl p-6 text-center card-shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <p className="text-sm font-semibold text-[#111844]">{category.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1 rounded-full mb-4">Features</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111844] mb-4">
                Why Choose PetCare AI?
              </h2>
              <p className="text-gray-600 text-lg">
                Everything you need to give your pet the best care possible
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white rounded-2xl p-8 card-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#4B5694]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4B5694] group-hover:text-white transition">
                  <Bot className="w-7 h-7 text-[#4B5694] group-hover:text-white transition" />
                </div>
                <h3 className="text-xl font-semibold text-[#111844] mb-2">AI Assistant</h3>
                <p className="text-gray-600">Get expert pet care advice powered by advanced AI</p>
                <Link href="/dashboard/ai-assistant" className="inline-flex items-center gap-1 text-[#4B5694] font-semibold mt-4 group-hover:gap-2 transition">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="group bg-white rounded-2xl p-8 card-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#4B5694]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4B5694] group-hover:text-white transition">
                  <Store className="w-7 h-7 text-[#4B5694] group-hover:text-white transition" />
                </div>
                <h3 className="text-xl font-semibold text-[#111844] mb-2">Pet Vendors</h3>
                <p className="text-gray-600">Connect with trusted pet service providers</p>
                <Link href="/vendors" className="inline-flex items-center gap-1 text-[#4B5694] font-semibold mt-4 group-hover:gap-2 transition">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="group bg-white rounded-2xl p-8 card-shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-[#4B5694]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4B5694] group-hover:text-white transition">
                  <Heart className="w-7 h-7 text-[#4B5694] group-hover:text-white transition" />
                </div>
                <h3 className="text-xl font-semibold text-[#111844] mb-2">Pet Management</h3>
                <p className="text-gray-600">Track health records and manage all your pets</p>
                <Link href="/dashboard/pets" className="inline-flex items-center gap-1 text-[#4B5694] font-semibold mt-4 group-hover:gap-2 transition">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-[#F8F6F2]">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1 rounded-full mb-4">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111844] mb-4">
                Get Started in 3 Easy Steps
              </h2>
              <p className="text-gray-600 text-lg">
                Join thousands of happy pet parents using PetCare AI
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#EAE0CF] hidden md:block"></div>
              <div className="relative">
                <div className="bg-[#4B5694] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">1</div>
                <div className="bg-[#F8F6F2] rounded-2xl p-6 text-center">
                  <PawPrint className="w-12 h-12 text-[#4B5694] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#111844] mb-2">Create Account</h3>
                  <p className="text-sm text-gray-600">Sign up for free and create your profile</p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-[#4B5694] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">2</div>
                <div className="bg-[#F8F6F2] rounded-2xl p-6 text-center">
                  <Heart className="w-12 h-12 text-[#4B5694] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#111844] mb-2">Add Your Pets</h3>
                  <p className="text-sm text-gray-600">Add your pets and their information</p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-[#4B5694] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">3</div>
                <div className="bg-[#F8F6F2] rounded-2xl p-6 text-center">
                  <Bot className="w-12 h-12 text-[#4B5694] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#111844] mb-2">Get AI Advice</h3>
                  <p className="text-sm text-gray-600">Ask questions and get expert guidance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[#111844] text-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#EAE0CF]">10k+</p>
                <p className="text-sm text-gray-400 mt-2">Pet Parents</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#EAE0CF]">
                  {totalPets !== null ? `${totalPets}+` : '15k+'}
                </p>
                <p className="text-sm text-gray-400 mt-2">Pets Listed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#EAE0CF]">500+</p>
                <p className="text-sm text-gray-400 mt-2">Trusted Vendors</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#EAE0CF]">4.9/5</p>
                <p className="text-sm text-gray-400 mt-2">User Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-[#F8F6F2]">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1 rounded-full mb-4">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111844] mb-4">
                What Pet Parents Say
              </h2>
              <p className="text-gray-600 text-lg">
                Real stories from real pet parents
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 card-shadow hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"PetCare AI helped me find the perfect food for my dog. The AI recommendations were spot on!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4B5694]/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-[#4B5694]">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111844]">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Golden Retriever</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 card-shadow hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"The AI assistant gave me great advice when my cat was sick. I knew exactly when to visit the vet."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4B5694]/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-[#4B5694]">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111844]">Michael Chen</p>
                    <p className="text-sm text-gray-500">Persian Cat</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 card-shadow hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"I love how easy it is to manage all my pets in one place. The vendor recommendations are excellent."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4B5694]/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-[#4B5694]">ED</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111844]">Emily Davis</p>
                    <p className="text-sm text-gray-500">Beagle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1 rounded-full mb-4">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111844] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-lg">
                Find answers to common questions about PetCare AI
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              <div className="border border-gray-200 rounded-xl p-6 hover:border-[#4B5694] transition">
                <h3 className="font-semibold text-[#111844] mb-2">Is PetCare AI free to use?</h3>
                <p className="text-gray-600">Yes, PetCare AI offers a free tier with basic features. Premium features may be available for advanced users.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 hover:border-[#4B5694] transition">
                <h3 className="font-semibold text-[#111844] mb-2">How does the AI assistant work?</h3>
                <p className="text-gray-600">The AI assistant uses advanced AI technology to provide personalized pet care advice based on your pet's specific needs.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 hover:border-[#4B5694] transition">
                <h3 className="font-semibold text-[#111844] mb-2">Can I register as a vendor?</h3>
                <p className="text-gray-600">Yes! Pet stores, groomers, breeders, and other pet service providers can register as vendors to list their pets and services.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 hover:border-[#4B5694] transition">
                <h3 className="font-semibold text-[#111844] mb-2">Is my pet's information secure?</h3>
                <p className="text-gray-600">Absolutely. We take data privacy seriously and implement industry-standard security measures to protect your information.</p>
              </div>
              <div className="text-center mt-8">
                <Link href="/faq" className="text-[#4B5694] font-semibold hover:underline inline-flex items-center gap-1">
                  View all FAQs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Blog/News Section */}
        <section className="py-20 bg-[#F8F6F2]">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-sm font-semibold text-[#4B5694] bg-[#4B5694]/10 px-4 py-1 rounded-full mb-4">Blog</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111844] mb-4">
                Latest Pet Care Tips
              </h2>
              <p className="text-gray-600 text-lg">
                Expert advice and tips for happy, healthy pets
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl overflow-hidden card-shadow hover:shadow-xl transition">
                <div className="h-48 bg-[#4B5694]/10 flex items-center justify-center text-6xl">🐕</div>
                <div className="p-6">
                  <span className="text-xs text-[#4B5694] font-semibold">Health & Wellness</span>
                  <h3 className="font-semibold text-[#111844] mt-2 mb-2">5 Signs Your Dog Needs a Vet</h3>
                  <p className="text-sm text-gray-600">Learn the warning signs that indicate your dog needs immediate medical attention.</p>
                  <Link href="#" className="inline-flex items-center gap-1 text-[#4B5694] font-semibold mt-4 text-sm hover:gap-2 transition">
                    Read More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl overflow-hidden card-shadow hover:shadow-xl transition">
                <div className="h-48 bg-[#7288AE]/10 flex items-center justify-center text-6xl">🐱</div>
                <div className="p-6">
                  <span className="text-xs text-[#4B5694] font-semibold">Nutrition</span>
                  <h3 className="font-semibold text-[#111844] mt-2 mb-2">Best Diet for Senior Cats</h3>
                  <p className="text-sm text-gray-600">Discover the best nutritional choices for your aging feline friend.</p>
                  <Link href="#" className="inline-flex items-center gap-1 text-[#4B5694] font-semibold mt-4 text-sm hover:gap-2 transition">
                    Read More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl overflow-hidden card-shadow hover:shadow-xl transition">
                <div className="h-48 bg-[#EAE0CF] flex items-center justify-center text-6xl">🦮</div>
                <div className="p-6">
                  <span className="text-xs text-[#4B5694] font-semibold">Training</span>
                  <h3 className="font-semibold text-[#111844] mt-2 mb-2">Puppy Training 101</h3>
                  <p className="text-sm text-gray-600">Essential tips and techniques for training your new puppy effectively.</p>
                  <Link href="#" className="inline-flex items-center gap-1 text-[#4B5694] font-semibold mt-4 text-sm hover:gap-2 transition">
                    Read More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#111844] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#4B5694] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7288AE] rounded-full blur-3xl"></div>
          </div>
          <div className="container-custom relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isAuthenticated ? 'Welcome Back!' : 'Ready to Give Your Pet the Best Care?'}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {isAuthenticated
                ? 'Continue managing your pets and accessing AI-powered care'
                : 'Join thousands of pet parents who trust PetCare AI'}
            </p>
            <Link
              href={getDashboardLink()}
              className="inline-flex items-center gap-2 bg-[#EAE0CF] text-[#111844] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition shadow-lg shadow-[#EAE0CF]/20"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Your Free Trial'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
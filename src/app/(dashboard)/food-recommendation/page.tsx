'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Loader2, Sparkles, AlertCircle, CheckCircle, XCircle, Heart } from 'lucide-react';

export default function FoodRecommendationPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [formData, setFormData] = useState({
        petType: 'Dog',
        breed: '',
        age: '',
        weight: '',
    });

    const petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('/ai/food-recommendation', {
                ...formData,
                age: parseInt(formData.age),
                weight: parseFloat(formData.weight),
            });
            setResult(response.data.data);
        } catch (error) {
            alert('Failed to get recommendation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111844]">Food Recommendation</h1>
                <p className="text-gray-600 mt-1">Get AI-powered food recommendations for your pet</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 card-shadow">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Pet Type *
                            </label>
                            <select
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                value={formData.petType}
                                onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                            >
                                {petTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Breed *
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                placeholder="Golden Retriever"
                                value={formData.breed}
                                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#111844] mb-1">
                                    Age (years) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="50"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                    placeholder="2"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#111844] mb-1">
                                    Weight (kg) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0.1"
                                    max="200"
                                    step="0.1"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                    placeholder="15.5"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#111844] text-white py-3 rounded-lg font-semibold hover:bg-[#4B5694] transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Getting Recommendations...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Get Recommendations
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div>
                    {result ? (
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-6 card-shadow">
                                <h3 className="font-semibold text-[#111844] mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Daily Feeding Schedule
                                </h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{result.dailyFeedingSchedule}</p>
                            </div>

                            <div className="bg-white rounded-xl p-6 card-shadow">
                                <h3 className="font-semibold text-[#111844] mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Recommended Foods
                                </h3>
                                <ul className="space-y-2">
                                    {result.recommendedFoods.map((food: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                            <span className="w-2 h-2 bg-[#4B5694] rounded-full"></span>
                                            {food}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl p-6 card-shadow">
                                <h3 className="font-semibold text-[#111844] mb-3 flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                    Foods to Avoid
                                </h3>
                                <ul className="space-y-2">
                                    {result.foodsToAvoid.map((food: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            {food}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl p-6 card-shadow">
                                <h3 className="font-semibold text-[#111844] mb-3 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-[#4B5694]" />
                                    Nutrition Tips
                                </h3>
                                <ul className="space-y-2">
                                    {result.nutritionTips.map((tip: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-700">
                                            <span className="w-2 h-2 bg-[#EAE0CF] rounded-full"></span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-800">
                                    ⚠️ This is AI-generated advice for educational purposes only.
                                    Always consult a veterinarian for professional dietary recommendations.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-8 text-center card-shadow flex flex-col items-center justify-center h-full min-h-[300px]">
                            <Sparkles className="w-16 h-16 text-[#4B5694] opacity-30 mb-4" />
                            <h3 className="text-lg font-semibold text-[#111844] mb-2">Get Started</h3>
                            <p className="text-gray-500">
                                Fill in your pet's details and get AI-powered food recommendations
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
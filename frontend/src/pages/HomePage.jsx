import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaRobot, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarForm from '../components/CarForm';

const HomePage = () => {
  const [formData, setFormData] = useState({
    fuel_type: 'gasoline', // default value
    transmission: 'automatic', // default value
    color: 'black', // default value
    clean_title: 'yes', // default value
    mileage: '0', // default value
    accident: '0', // default value
    brand: 'toyota', // default value
    years_used: '0', // default value
    model: '', // default value
    trade_type: 'sale' // default value
  });
  const [prediction, setPrediction] = useState(null);
  const [aiTip, setAiTip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const predictPrice = (data) => {
    // Base price and multiplier configuration
    const base_price = 25000; // Updated base price

    // Comprehensive brand multipliers based on market positioning
    const brand_multipliers = {
      'mercedes-benz': 1.8,
      'bmw': 1.7,
      'audi': 1.7,
      'porsche': 2.2,
      'lexus': 1.6,
      'infiniti': 1.4,
      'acura': 1.3,
      'tesla': 2.0,
      'land rover': 1.9,
      'aston martin': 2.5,
      'bentley': 3.0,
      'toyota': 1.2,
      'honda': 1.15,
      'ford': 1.0,
      'chevrolet': 0.95,
      'dodge': 0.98,
      'chrysler': 0.97,
      'jeep': 1.25,
      'volvo': 1.5,
      'volkswagen': 1.1,
      'hyundai': 0.9,
      'kia': 0.85,
      'nissan': 0.95,
      'genesis': 1.3,
      'lincoln': 1.4,
      'jaguar': 1.8,
      'cadillac': 1.5,
      'mini': 1.2,
      'subaru': 1.1,
      'lucid': 2.1,
      'rivian': 1.9,
      'hummer': 1.6,
      'other': 1.0 // Default multiplier for unspecified brands
    };

    // Calculate factors
    const mileage_factor = Math.max(0.3, 1 - (data.mileage / 300000));
    const age_factor = Math.max(0.3, 1 - (data.years_used / 25));
    const accident_factor = Math.max(0.5, 1 - (data.accident * 0.15));
    
    const brand_factor = brand_multipliers[data.brand.toLowerCase()] || brand_multipliers['other'];

    const fuel_multipliers = {
      'gasoline': 1.0,
      'diesel': 1.15,
      'electric': 1.4,
      'hybrid': 1.25
    };
    const fuel_factor = fuel_multipliers[data.fuel_type.toLowerCase()] || fuel_multipliers['gasoline'];

    const transmission_multipliers = {
      'automatic': 1.1,
      'manual': 0.95,
      'cvt': 1.05
    };
    const transmission_factor = transmission_multipliers[data.transmission.toLowerCase()] || transmission_multipliers['automatic'];

    // Calculate predicted price with adjusted weights
    let predicted_price = base_price * 
      (mileage_factor * 0.25 + 0.75) * // Reduced impact of mileage
      (age_factor * 0.3 + 0.7) * // Reduced impact of age
      (accident_factor * 0.2 + 0.8) * // Reduced impact of accidents
      brand_factor * 
      fuel_factor * 
      transmission_factor;

    // Clean title adjustment
    if (data.clean_title === 0) {
      predicted_price *= 0.7;
    }

    // Market adjustment factor (can be tuned based on current market conditions)
    const market_adjustment = 1.1; // 10% markup for current market conditions
    predicted_price *= market_adjustment;

    // Add random variation within ±5% to make predictions more realistic
    const variation = 0.95 + Math.random() * 0.1; // Random between 0.95 and 1.05
    predicted_price *= variation;

    return Math.max(5000, predicted_price); // Minimum price of $5000
  };

  const getAiResponse = async (prompt) => {
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);
    
    try {
      const predictionInput = {
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        clean_title: formData.clean_title === 'yes' ? 1 : 0,
        mileage: parseFloat(formData.mileage),
        accident: parseInt(formData.accident) >= 1 ? 1 : 0,
        brand: formData.brand,
        years_used: parseFloat(formData.years_used)
      };
      
      const price = predictPrice(predictionInput);
      setPrediction(price);
    } catch (error) {
      setError('Failed to get prediction. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAiTip = async () => {
    setTipLoading(true);
    setAiTip(null);
    setError(null);
    
    try {
      const car_details = `
        Fuel Type: ${formData.fuel_type}
        Transmission: ${formData.transmission}
        Color: ${formData.color}
        Clean Title: ${formData.clean_title}
        Mileage: ${formData.mileage}
        Accident History(no of accidents): ${formData.accident}
        Brand: ${formData.brand}
        Years Used: ${formData.years_used}
        Model: ${formData.model}
        Trade Type: ${formData.trade_type}
      `;

      const prompt = `As a friendly mechanic, give me helpful advice about this car: ${car_details}. Keep it to 5-6 sentences and include some emojis. If any details seem incorrect or mismatched (like wrong model for the brand), point that out first.`;
      
      const tip = await getAiResponse(prompt);
      setAiTip(tip);
    } catch (error) {
      setError('Failed to get AI tip. Please ensure you have filled the form correctly.');
      console.error('Error:', error);
    } finally {
      setTipLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <CarForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleGetAiTip={handleGetAiTip}
              loading={loading}
              tipLoading={tipLoading}
            />

            <AnimatePresence>
              {aiTip && (
                <motion.div 
                  className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center mb-4">
                    <FaRobot className="text-3xl text-blue-600 mr-2" />
                    <h3 className="text-2xl font-bold text-blue-700">AI Tip</h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed font-semibold">{aiTip}</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="bg-red-100 border-l-4 border-red-500 p-4 mb-8 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-500 mr-3" />
                    <p className="text-red-700 font-semibold">{error}</p>
                  </div>
                </motion.div>
              )}

              {(tipLoading || loading) && (
                <motion.div 
                  className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                    <h3 className="text-2xl font-semibold text-blue-700">
                      {tipLoading ? 'Generating Response...' : 'Predicting...'}
                    </h3>
                  </div>
                </motion.div>
              )}

              {prediction !== null && (
                <motion.div 
                  className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-semibold text-green-700 mb-4">Predicted Price:</h3>
                  <div className="flex items-center">
                    <FaDollarSign className="text-4xl text-green-600 mr-2" />
                    <p className="text-4xl font-bold text-green-600">{prediction.toFixed(2)}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
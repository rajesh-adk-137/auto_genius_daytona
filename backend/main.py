import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
import tensorflow as tf
import pickle
import numpy as np
import pandas as pd
import logging
import google.generativeai as genai

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_models_and_artifacts():
    """Load all required models and artifacts."""
    try:
        # Load TensorFlow model
        model = tf.keras.models.load_model('models/car_price_model.keras')
        
        # Load encoders and scaler
        with open('artifacts/encoders.pkl', 'rb') as f:
            encoders = pickle.load(f)
        with open('artifacts/price_scaler.pkl', 'rb') as f:
            price_scaler = pickle.load(f)
            
        return model, encoders, price_scaler
    except Exception as e:
        logger.error(f"Failed to load models and artifacts: {e}")
        raise RuntimeError(f"Failed to load models and artifacts: {str(e)}")

def configure_gemini():
    """Configure Gemini AI model."""
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }
        return genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
        )
    except Exception as e:
        logger.error(f"Failed to configure Gemini: {e}")
        raise RuntimeError(f"Failed to configure Gemini: {str(e)}")

class CarPredictionRequest(BaseModel):
    """Request model for car price prediction."""
    fuel_type: str
    transmission: str
    clean_title: int
    mileage: float
    accident: int
    brand: str
    years_used: float

class CarPredictionResponse(BaseModel):
    """Response model for car price prediction."""
    price: float

class AiTipRequest(BaseModel):
    """Request model for AI tips."""
    fuel_type: str
    transmission: str
    color: str
    clean_title: str
    mileage: int
    accident: int
    brand: str
    years_used: int
    model: str
    trade_type: str

class AiTipResponse(BaseModel):
    """Response model for AI tips."""
    tip: str

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and artifacts
try:
    model, encoders, price_scaler = load_models_and_artifacts()
    gemini_model = configure_gemini()
except Exception as e:
    logger.error(f"Startup failed: {e}")
    raise

def predict_price(fuel_type, transmission, clean_title, mileage, accident, brand, years_used):
    """Core prediction function matching the training implementation."""
    # Prepare categorical input
    categorical_input = np.array([
        encoders['fuel_type'].transform([fuel_type])[0],
        encoders['transmission'].transform([transmission])[0],
        encoders['brand'].transform([brand])[0]
    ]).reshape(1, -1)
    
    # Prepare numeric input (scaled)
    numeric_input = np.array([
        mileage / 300000,  # Assuming max mileage of 300,000
        years_used / 25,   # Assuming max age of 25 years
        clean_title,
        accident
    ]).reshape(1, -1)
    
    # Make prediction
    scaled_prediction = model.predict([categorical_input, numeric_input])[0][0]
    
    # Inverse transform the prediction
    actual_price = price_scaler.inverse_transform([[scaled_prediction]])[0][0]
    
    return max(0, float(actual_price))

@app.post("/predict", response_model=CarPredictionResponse)
async def predict_car_price(request: CarPredictionRequest):
    """Endpoint for car price prediction."""
    try:
        predicted_price = predict_price(
            fuel_type=request.fuel_type,
            transmission=request.transmission,
            clean_title=request.clean_title,
            mileage=request.mileage,
            accident=request.accident,
            brand=request.brand,
            years_used=request.years_used
        )
        
        return CarPredictionResponse(price=float(predicted_price))
    
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/ai_tip", response_model=AiTipResponse)
async def get_ai_tip(request: AiTipRequest):
    """Endpoint for getting AI-generated tips."""
    try:
        car_details = f"""
        Fuel Type: {request.fuel_type}
        Transmission: {request.transmission}
        Color: {request.color}
        Clean Title: {request.clean_title}
        Mileage: {request.mileage}
        Accident History: {request.accident}
        Brand: {request.brand}
        Years Used: {request.years_used}
        Model: {request.model}
        Trade Type: {request.trade_type}
        """
        
        prompt = (
        f"You're a friendly mechanic, and your task is to give helpful advice to someone looking to trade a car "
        f"with the following details: {car_details}. Speak in a personable tone and keep your response concise, "
        f"to 7-8 sentences. Feel free to add emojis to make it engaging! Keep in mind that the user is providing these "
        f"details because they are dealing with that particular car.You can add some *car humour* you know to make it interesting. If the input includes a random or unrealistic model "
        f"or parameters, handle it tactfully. most of the time stick to giving good advices even if the details are slightly off. if it is totally nonsensical" 
        f"encourage them to provide accurate details(but never ask follow up question) and subtly suggest that the predicted price may not reflect the car's true value *if the details are nonsensical,that is* ,context: a deep learinng model is predicting the price of the car based on the user details"
        f"but avoid mentioning the deep learning model directly." 
        f"also be clear about the trade type i.e if the user is buying or selling this car, base you advice accordingly."
            )

        
        chat = gemini_model.start_chat()
        response = chat.send_message(prompt)
        
        return AiTipResponse(tip=response.text)
    
    except Exception as e:
        logger.error(f"AI tip generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"AI tip generation failed: {str(e)}")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
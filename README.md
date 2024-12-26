# AutoGenius: Intelligent Car Valuation and Trading Assistant

<p align="center">
  <a href="https://github.com/rajesh-adk-137/autogenius" target="blank">
    <img src="https://img.shields.io/github/watchers/rajesh-adk-137/autogenius?style=for-the-badge&logo=appveyor" alt="Watchers"/>
  </a>
  <a href="https://github.com/rajesh-adk-137/autogenius/fork" target="blank">
    <img src="https://img.shields.io/github/forks/rajesh-adk-137/autogenius?style=for-the-badge&logo=appveyor" alt="Forks"/>
  </a>
  <a href="https://github.com/rajesh-adk-137/autogenius/stargazers" target="blank">
    <img src="https://img.shields.io/github/stars/rajesh-adk-137/autogenius?style=for-the-badge&logo=appveyor" alt="Star"/>
  </a>
</p>
<p align="center">
  <a href="https://github.com/rajesh-adk-137/autogenius/issues" target="blank">
    <img src="https://img.shields.io/github/issues/rajesh-adk-137/autogenius?style=for-the-badge&logo=appveyor" alt="Issues"/>
  </a>
  <a href="https://github.com/rajesh-adk-137/autogenius/pulls" target="blank">
    <img src="https://img.shields.io/github/issues-pr/rajesh-adk-137/autogenius?style=for-the-badge&logo=appveyor" alt="Open Pull Request"/>
  </a>
</p>
<p align="center">
  <a href="https://github.com/rajesh-adk-137/autogenius/blob/master/LICENSE" target="blank">
    <img src="https://img.shields.io/github/license/rajesh-adk-137/autogenius?style=for-the-badge&logo=appveyor" alt="License" />
  </a>
</p>

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Getting Started with Daytona](#getting-started-with-daytona)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

**AutoGenius** is an intelligent platform that uses deep learning and AI to predict pre-owned car prices and provide personalized trading tips. The project integrates a React frontend with a FastAPI backend, utilizing a custom-trained deep learning model for price predictions and Google's Gemini API for intelligent trading advice.

**Key components include:**
- A deep learning price prediction model trained on a preprocessed dataset
- A chatbot powered by Google's Gemini API for providing personalized trading advice
- A user-friendly web interface for inputting car details and receiving predictions and tips
- A FastAPI backend that processes requests and delivers AI-powered responses

This project showcases the integration of modern web technologies with AI and machine learning to create a practical tool for the automotive trading market.

## Key Features

- **Car Price Prediction**: Utilizes a custom-trained deep learning model to predict pre-owned car prices based on multiple parameters including fuel type, transmission, title status, mileage, accident history, brand, and years used
- **AI-Powered Trading Tips**: Implements a chatbot using Google's Gemini API to provide personalized buying and selling advice based on comprehensive car details
- **User-Friendly Interface**: Offers an intuitive and visually appealing React-based frontend for seamless user interaction
- **Real-time AI Integration**: Leverages FastAPI to make real-time queries to the prediction model and Gemini API
- **Data Preprocessing Pipeline**: Includes a sophisticated data cleaning and preprocessing workflow to prepare the dataset for model training
- **Standardized Development**: Uses Daytona for consistent development environments across team members

## Technologies Used

- **Frontend**: React
- **Backend**: FastAPI
- **AI/ML**: Custom Deep Learning Model, Google Gemini API
- **Development Environment**: Daytona

## Getting Started with Daytona

### Prerequisites

1. **Install Daytona**: Follow the [Daytona installation guide](https://www.daytona.io/docs/installation/installation/)

### Create and Set Up Workspace

1. **Create the Workspace**:
   ```bash
   daytona create https://github.com/your-username/autogenius
   ```

2. **Environment Variables Setup**:
   Create a `.env` file in the backend directory with:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Start the Application**:
   ```bash
   # Start the backend
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload

   # Start the frontend (in a new terminal)
   cd frontend
   yarn install
   yarn start
   ```


## Demo

[Click here to watch the demo video](https://github.com/user-attachments/assets/f7c97892-3716-4d7c-a327-151c3a3d26cf)

## Screenshots
 Landing page
![landing_page](https://github.com/user-attachments/assets/fa5d2334-1111-458c-b880-6cccf6c9ac19)
 FAQ section
![FAQ section](https://github.com/user-attachments/assets/16989621-05b1-47a9-a02c-ff284044b404)
 About Page
![about_page](https://github.com/user-attachments/assets/65162e72-607a-4e1a-8914-f2c7c4df9fd5)
 Form 
![form](https://github.com/user-attachments/assets/557c5382-021a-4ae8-9abf-972da3412e44)
 Response
![response](https://github.com/user-attachments/assets/7b7496b0-a18e-45c6-a348-9b857ae7b505)


## Contributing

Contributions are always welcomed! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [React](https://reactjs.org/) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Google Gemini API](https://ai.google.dev/) for AI capabilities
- [MySQL](https://www.mysql.com/) for the database
- [Daytona](https://www.daytona.io/) for development environment standardization
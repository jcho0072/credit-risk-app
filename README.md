# Credit Risk Assessment System
An application that predicts the probability of a loan default using a machine learning model and applies business decision layering to simulate real-world lending decisions.

## Features
- Full CRUD operations for managing loan applications
- Machine Learning model to predict loan defaults
- Business logic layer for for decision making and risk evaluation
- Persistent storage utilizing Oracle DB for all metrics including defaulting probabilities and risk metrics
- Fully functional frontend with real-time result display

## Architecture
### Tech Stack
   - Frontend: React
   - Backend: Flask
   - Database: Oracle (development/testing), SQLite (deployment)
   - ML Model: Scikit-learn libaries and pipeline

   *** 
   Note: The project was initially developed using Oracle DB for experimentation with enterprise database systems. 
   

For deployment and portability, it was adapted to use SQLite.

## How the application functions
1. User enters their loan application details in various fields through a server browser with the frontend display.
   
2. Backend receives and validates input to be sent to the ML model
   
3. The ML model artifact that has been pre-trained on a credit-risk dataset with the same fields featured in the frontend will be used to process the data from the backend.

4. The ML model computes and outputs the results for various metrics required for the application:
   - Loan defaulting probability
   - Loan Status (1 for default and 0 for non-default)
   - Decision to approve or reject lending out the loan
   - Expected Loss (This will not be visible to users however will be stored in the database)
   - Risk of Default (This is an additional statistic, either of a status of "High Risk" or "Low Risk" to further augment understanding for the user of their specific loan application)
    
## Setup
### Prerequisites
1. Python 3.10+
2. Node.js 18+
3. Oracle DB
4. SQLite
5. (Optional) SQLite Explorer

### Clone Repository
``` bash
git clone https://github.com/jcho0072/credit-risk-app
cd credit-risk-app
```

### Backend
- Install required items for backend:
```bash
cd backend
pip install -r requirements.txt
```

- create .env:
```bash
DATABASE_URL = ...
MODEL_PATH = ...
```

- Run backend:
```bash
python -m backend.app.main
```



### Frontend
- Run frontend:
```bash
cd frontend
npm install
npm run dev
```

## Production Setup 
- Build frontend:
```bash
cd frontend 
npm run build
``` 

- Run backend:
```bash
cd backend
waitress-serve --listen=127.0.0.1:5000 backend.app.main:app  
```

- Open:
```bash
http://localhost:5000
```


## Usage
1. Enter application details within the form
2. Submit application
3. View:
   - Probability of defaulting
   - Loan Status
   - Risk classification
   - Loan decision
4. Delete or Edit application if needed


## Dataset
This project uses a Credit Risk Dataset from Kaggle, available here:
- Data Card and Dataset CSV:  - https://www.kaggle.com/datasets/laotse/credit-risk-dataset

## Design Decisions
- The ML model only calculates defaulting probability, this logic separated from the business logic
- The main business logic layer of the backend handles the front facing metrics such as loan status, risk, expected loss and lending decision
  - This business logic is separate from the CRUD within flask  
- The front facing metrics are computed server side to avoid inconsistencies and potential errors.
- Frontend handles the display whilst backend handles ML output and business logic and CRUD integration with the frontend.


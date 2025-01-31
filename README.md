# **MLB Prospect Prediction using Google Cloud AI**

## **Project Overview**
This project focuses on **predicting the future performance of MLB players (prospects)** using **Google Cloud AI (Vertex AI AutoML)**. The dataset includes **historical home run data, player stats, and performance metrics**. The goal is to build an **ML model** that can predict **WAR (Wins Above Replacement)** based on **Exit Velocity, Hit Distance, and Launch Angle**.

Additionally, we have built a **full-stack web application using Next.js and Tailwind CSS** to allow users to interact with the model and view predictions seamlessly.

## **Tech Stack**
- **Programming Language:** Python, JavaScript (React.js, Next.js)
- **Cloud Platform:** Google Cloud Platform (GCP)
- **Machine Learning:** Vertex AI AutoML (Tabular)
- **Data Storage:** Google Cloud Storage (GCS)
- **Data Processing:** Pandas, NumPy
- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js (for API handling)
- **Model Deployment:** Vertex AI Endpoints

---

## **Dataset**
### **1️⃣ Raw Data**
The dataset consists of **MLB home run events** and contains the following columns:

| Column Name      | Description |
|-----------------|-------------|
| `play_id`       | Unique identifier for each home run |
| `ExitVelocity`  | Speed of the ball off the bat (mph) |
| `HitDistance`   | Distance the ball traveled (feet) |
| `LaunchAngle`   | Angle of the hit (degrees) |
| `Year`          | Year of the event |
| `WAR`           | Wins Above Replacement (target variable) |
| `PlayerName`    | Name of the player |

### **2️⃣ Data Cleaning**
- **Removed duplicate records**
- **Handled missing values** (Dropped rows where `WAR` was missing)
- **Standardized column names** (converted to lowercase, removed spaces)
- **Extracted player names** from umpire-reviewed records (`"Umpire reviewed (home run), call on the field was upheld: Player Name" → "Player Name"`)
- **Ensured `WAR` was numeric** to avoid errors in training

**📁 Cleaned Data Location:** `gs://mlb-prospect-data/cleaned_mlb_homeruns.csv`

---

## **Model Training**
### **🔹 Step 1: Upload Data to Google Cloud**
```bash
gsutil cp cleaned_mlb_homeruns.csv gs://mlb-prospect-data/
```

### **🔹 Step 2: Register Dataset in Vertex AI**
```python
from google.cloud import aiplatform

aiplatform.init(project="mlb-project-449501", location="us-central1")

dataset = aiplatform.TabularDataset.create(
    display_name="mlb_prospect_prediction",
    gcs_source="gs://mlb-prospect-data/cleaned_mlb_homeruns.csv"
)
```

### **🔹 Step 3: Train AutoML Model**
```python
model = aiplatform.AutoMLTabularTrainingJob(
    display_name="prospect_model",
    optimization_prediction_type="regression"
)

model = model.run(
    dataset=dataset,
    target_column="WAR",
    model_display_name="mlb_prospect_model",
    budget_milli_node_hours=5000,
    disable_early_stopping=False
)
```

---

## **Model Deployment**
Once the model is trained, it can be deployed as a **Vertex AI Endpoint** to serve real-time predictions.

```python
endpoint = model.deploy()
```

After deployment, you can **send new player stats** and get **predicted WAR values** for MLB prospects.

---

## **Full-Stack Web Application**
We have developed a **fully responsive web application** using:

- **Next.js**: For server-side rendering and API handling
- **Tailwind CSS**: For modern and responsive UI design
- **Google Cloud API**: To fetch predictions from the trained model
- **React Hooks**: For managing state in a smooth and dynamic way

### **Key Features:**
✅ **User-Friendly Interface** – Allows users to input player stats and get predictions.  
✅ **Real-Time Predictions** – Fetches results from the Vertex AI model via API.  
✅ **Historical Data Visualization** – Displays trends and past performance stats.  
✅ **Mobile-Responsive Design** – Works seamlessly across all devices.  

---

## **Project Directory Structure**
```
MLB-Prospect-Prediction/
│── frontend/                       # Full-stack app using Next.js & Tailwind CSS
│── backend/                        # API handling
│── data_cleaning.ipynb             # Data preprocessing and cleaning
│── model_training.ipynb            # AutoML model training
│── cleaned_mlb_homeruns.csv        # Processed dataset
│── README.md                       # Project documentation (this file)
│── requirements.txt                # Python dependencies
└── gs://mlb-prospect-data/         # Google Cloud Storage location
```

---

## **Future Improvements**
✅ **Feature Engineering**: Add more player statistics (e.g., batting average, strikeouts)  
✅ **Time-Series Analysis**: Track player trends across multiple seasons  
✅ **Hyperparameter Tuning**: Optimize AutoML training settings  
✅ **Real-time Predictions**: Integrate with **MLB live data (GUMBO API)**  
✅ **Enhance UI/UX**: Improve visualization and user experience on the web app  

---

## **Contributors**
👨‍💻 **Suyash** - Data Engineer & Model Trainer  
👩‍💻 **[Your Name]** - Full-Stack Development & Data Cleaning  

---

## **How to Run the Project**
1️⃣ Clone the repo:
```bash
git clone https://github.com/your-repo/mlb-prospect-prediction.git
cd mlb-prospect-prediction
```
2️⃣ Install dependencies:
```bash
pip install -r requirements.txt
```
3️⃣ Run **data cleaning**:
```bash
python data_cleaning.ipynb
```
4️⃣ Train the **AutoML model**:
```bash
python model_training.ipynb
```
5️⃣ Start the **Next.js web app**:
```bash
cd frontend
npm install
npm run dev
```
6️⃣ Access the app at: `http://localhost:3000`

---

## **References**
- **MLB Stats API:** [https://statsapi.mlb.com](https://statsapi.mlb.com)
- **Google Cloud AI Platform:** [https://cloud.google.com/vertex-ai](https://cloud.google.com/vertex-ai)
- **Google Cloud Storage:** [https://cloud.google.com/storage](https://cloud.google.com/storage)
- **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS:** [https://tailwindcss.com/](https://tailwindcss.com/)

---

Let me know if you need any modifications! 🚀


from flask import Flask
from flask import request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import pandas as pd
import numpy as np
from csv import reader
from scipy.stats import mode
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

app = Flask(__name__)
CORS(app)
api = Api(app)


class SymptomAnalyzer(Resource):
    def post(self):
        
        # getting parameters from JSON format in array
        parser = reqparse.RequestParser()
        parser.add_argument('symptoms', action='append')
        parser = parser.parse_args()
        symptomsArr = parser['symptoms']

        # putting parameters in string to pass in function predictDisease(symptomsGet)
        symptomsGet = ""
        for count, data in enumerate(symptomsArr):
            symptomsGet += data
            if(count != len(symptomsArr)-1):
                symptomsGet += ","
         
        
        # Reading the dataset.csv by removing the
        # last column since it's an empty column
        DATA_PATH = "distributions/Training.csv"
        data = pd.read_csv(DATA_PATH).dropna(axis = 1)
        
        # Encoding the target value into numerical
        # value using LabelEncoder
        encoder = LabelEncoder()
        data["prognosis"] = encoder.fit_transform(data["prognosis"])
        X = data.iloc[:,:-1]
        y = data.iloc[:, -1]
        X_train, X_test, y_train, y_test =train_test_split(X, y, test_size = 0.2, random_state = 24)
        
        print(f"Train: {X_train.shape}, {y_train.shape}")
        print(f"Test: {X_test.shape}, {y_test.shape}")

        # Defining scoring metric for k-fold cross validation
        def cv_scoring(estimator, X, y):
            return accuracy_score(y, estimator.predict(X))
        
        # Initializing Models
        models = {
            "SVC":SVC(),
            "Gaussian NB":GaussianNB(),
            "Random Forest":RandomForestClassifier(random_state=18)
        }
        # Producing cross validation score for the models
        for model_name in models:
            model = models[model_name]
            scores = cross_val_score(model, X, y, cv = 10,n_jobs = -1,scoring = cv_scoring)
            print("=="*30)
            print(model_name)
            print(f"Scores: {scores}")
            print(f"Mean Score: {np.mean(scores)}")
            
        svm_model = SVC()
        svm_model.fit(X_train, y_train)
        preds = svm_model.predict(X_test)
        print(f"Accuracy on train data by SVM Classifier\: {accuracy_score(y_train, svm_model.predict(X_train))*100}")
        print(f"Accuracy on test data by SVM Classifier\: {accuracy_score(y_test, preds)*100}")
            
        # Training and testing Naive Bayes Classifier
        nb_model = GaussianNB()
        nb_model.fit(X_train, y_train)
        preds = nb_model.predict(X_test)
        print(f"Accuracy on train data by Naive Bayes Classifier\: {accuracy_score(y_train, nb_model.predict(X_train))*100}")
        print(f"Accuracy on test data by Naive Bayes Classifier\: {accuracy_score(y_test, preds)*100}")
       
        # Training and testing Random Forest Classifier
        rf_model = RandomForestClassifier(random_state=18)
        rf_model.fit(X_train, y_train)
        preds = rf_model.predict(X_test)
        print(f"Accuracy on train data by Random Forest Classifier\: {accuracy_score(y_train, rf_model.predict(X_train))*100}")
        print(f"Accuracy on test data by Random Forest Classifier\: {accuracy_score(y_test, preds)*100}")

        # Training the models on whole data
        final_svm_model = SVC()
        final_nb_model = GaussianNB()
        final_rf_model = RandomForestClassifier(random_state=18)
        final_svm_model.fit(X, y)
        final_nb_model.fit(X, y)
        final_rf_model.fit(X, y)

        # Reading the test data
        test_data = pd.read_csv("./distributions/Testing.csv").dropna(axis=1)

        test_X = test_data.iloc[:, :-1]
        test_Y = encoder.transform(test_data.iloc[:, -1])

        # Making prediction by take mode of predictions
        # made by all the classifiers
        svm_preds = final_svm_model.predict(test_X)
        nb_preds = final_nb_model.predict(test_X)
        rf_preds = final_rf_model.predict(test_X)

        final_preds = [mode([i,j,k])[0][0] for i,j,k in zip(svm_preds, nb_preds, rf_preds)]

        print(f"Accuracy on Test dataset by the combined model\: {accuracy_score(test_Y, final_preds)*100}")

        cf_matrix = confusion_matrix(test_Y, final_preds)

        #take values and return result
        symptoms = X.columns.values

        # Creating a symptom index dictionary to encode the
        # input symptoms into numerical form
        symptom_index = {}
        for index, value in enumerate(symptoms):
            symptom = " ".join([i.capitalize() for i in value.split("_")])
            symptom_index[symptom] = index

        data_dict = {
        	"symptom_index":symptom_index,
        	"predictions_classes":encoder.classes_
        }
        # Defining the Function
        # Input: string containing symptoms separated by commmas
        # Output: Generated predictions by models
        def predictDisease(symptoms):
            symptoms = symptoms.split(",")
            # creating input data for the models
            input_data = [0] * len(data_dict["symptom_index"])
            for symptom in symptoms:
                index = data_dict["symptom_index"][symptom]
                input_data[index] = 1
            
            # reshaping the input data and converting it
            # into suitable format for model predictions
            input_data = np.array(input_data).reshape(1,-1)
            
            # generating individual outputs
            rf_prediction = data_dict["predictions_classes"][final_rf_model.predict(input_data)[0]]
            nb_prediction = data_dict["predictions_classes"][final_nb_model.predict(input_data)[0]]
            svm_prediction = data_dict["predictions_classes"][final_svm_model.predict(input_data)[0]]
            
            # making final prediction by taking mode of all predictions
            final_prediction = mode([rf_prediction, nb_prediction, svm_prediction])[0][0]
            predictions = {
                "rf_model_prediction": rf_prediction,
                "naive_bayes_prediction": nb_prediction,
                "svm_model_prediction": nb_prediction,
                "final_prediction":final_prediction
            }
            return predictions
        return predictDisease(symptomsGet)

class DiseaseDescription(Resource):
    def post(self):
        
        # getting parameters from JSON format
        parser = reqparse.RequestParser()
        parser.add_argument('disease')
        args = parser.parse_args()
        disease = args.disease

        with open('distributions/symptom_Description.csv', 'r') as read_obj:
            # pass the file object to reader() to get the reader object
            csv_reader = reader(read_obj)
            #Iterate over each row in the csv using reader object
            for row in csv_reader:
                 # row variable is a list that represents a row in csv
                 if(row[0] == disease):
                     return row[1]


class DiseasePrecaution(Resource):
    def post(self):
        
        # getting parameters from JSON format
        parser = reqparse.RequestParser()
        parser.add_argument('disease')
        args = parser.parse_args()
        disease = args.disease

        with open('distributions/symptom_precaution.csv', 'r') as read_obj:
            # pass the file object to reader() to get the reader object
            csv_reader = reader(read_obj)
            #Iterate over each row in the csv using reader object
            for row in csv_reader:
                 # row variable is a list that represents a row in csv
                 if(row[0] == disease):
                     return row[1]

api.add_resource(SymptomAnalyzer, '/API/postSymptoms')
api.add_resource(DiseaseDescription, '/API/getDescription')
api.add_resource(DiseasePrecaution, '/API/getPrecautions')

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)

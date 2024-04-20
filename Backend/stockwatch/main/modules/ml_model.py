import datetime
import pandas as pd
import numpy as np
import tensorflow as tf
from ta import add_all_ta_features
from ta.utils import dropna
from sklearn.preprocessing import MinMaxScaler
from tensorflow import keras
import yfinance as yf
import matplotlib.pyplot as plt
import joblib
import os


default_symbol = '^NSEI'
default_start_date = datetime.datetime(2013, 1, 21)
default_end_date = datetime.datetime(2024, 4, 11)


class AI_Model():
    def __init__(self, model_path=None, scaler_path=None, symbol=default_symbol, start_date=default_start_date, end_date=default_end_date, verbose=True, last_trained_date=None):
        self.symbol = symbol
        self.start = start_date
        self.end = end_date
        self.data = []
        self.is_data_loaded = False
        self.scaler = MinMaxScaler()
        self.future_days = 7
        self.sequence_length = 21  # Train upto last sequence_len days
        self.batch_size = 16  # batch size len / batch_size feed at a time
        self.target_col = 'Open'  # need to predict
        self.model = None
        self.is_model_loaded = False
        self.model_path = model_path
        self.verbose = verbose
        self.input_shape = 92
        self.is_model_pre_train = False
        self.last_trained_date = last_trained_date
        self.scaler_path = scaler_path

        if (model_path and scaler_path):
            self.load_model()
        else:
            self.build_model()

    def log(self, message):
        if (self.verbose):
            print(message)

    def build_model(self):
        self.model = keras.models.Sequential([
            keras.layers.LSTM(512, input_shape=[None, self.input_shape]),
            keras.layers.Dense(self.future_days)
        ])

        opt = tf.keras.optimizers.SGD(learning_rate=0.2, momentum=0.9)
        self.model.compile(loss=keras.losses.Huber(),
                           optimizer=opt, metrics=['mae'])
        self.is_model_loaded = True

    def load_model(self):
        try:
            self.model = keras.models.load_model(self.model_path)
            self.is_model_loaded = True
            self.log("Model Loaded Successfully")
            self.is_model_pre_train = True
            self.scaler = joblib.load(self.scaler_path)

        except Exception as e:
            self.log("Failed to load Model error : ")
            print(e)
            self.is_model_loaded = False

    def ahead_timeseries_from_array(self, data):
        ahead_ds = tf.keras.utils.timeseries_dataset_from_array(
            data,
            targets=None,
            sequence_length=self.sequence_length+self.future_days,
            batch_size=self.batch_size
        ).map(self.split_input_and_target)

        return ahead_ds

    # Function to fetch historical data for a symbol
    def fetch_data(self, start_date, end_data):
        data = yf.download(self.symbol, start=start_date, end=end_data)
        if (len(data) > 0):
            self.is_data_loaded = True
            self.data = data

    def fetch_latest_data(self, from_date=None):
        # Fetch data for the latest date
        start_date = from_date
        if not start_date:
            start_date = self.start
        latest_date = datetime.datetime.now() - datetime.timedelta(days=1)
        # Replace 'NIFTY' with your desired symbol
        latest_data = self.fetch_data(
            start_date=start_date, end_data=latest_date)
        # latest_data = latest_data[:latest_date]
        return latest_data

    def preprocess_data(self, data_df):
        # Add technical analysis features
        data_df = dropna(data_df)

        data_ta = add_all_ta_features(
            data_df, open="Open", high="High", low="Low", close="Close", volume='Volume', fillna=True)

        # Scale the data
        scaled_data = pd.DataFrame(self.scaler.fit_transform(
            data_ta), index=data_ta.index, columns=data_ta.columns)
        joblib.dump(self.scaler, 'scaler.pkl')

        return scaled_data

    def split_input_and_target(self, ds, ahead=7, target_col=0):
        return ds[:, :-ahead], ds[:, -ahead:, target_col]

    def train_model(self, train_data, validation_data=None, epochs=100, momentum=0.9, learning_rate=0.2, opt=None, loss=None, patience=5, moniter='mae', is_save=False):
        if not opt:
            opt = tf.keras.optimizers.SGD(learning_rate=0.2, momentum=0.9)
        if not loss:
            loss = keras.losses.Huber()
        self.model.compile(loss=loss, optimizer=opt, metrics=['mae'])
        if (validation_data):
            moniter = 'val_loss'
        early_stopping = keras.callbacks.EarlyStopping(
            patience=patience, monitor=moniter)
        hist = self.model.fit(train_data, epochs=epochs, callbacks=[
                              early_stopping], validation_data=validation_data)

#         Save the trained model
        if (is_save):
            self.model.save('trained_model.h5')
        self.hist = hist
        self.is_model_pre_train = True

        return hist

    def predict_future_prices(self, test_data):
        # Make predictions
        if (self.is_model_loaded and self.is_model_pre_train):
            predictions = self.model.predict(test_data)
            return predictions
        self.log("Model is Not Loaded please load the model first.")

    def inverse_preprocess(self, data):
        return self.scaler.inverse_transform(data)

    def numpy_to_df(self, data, index, cols):
        return pd.DataFrame(data, index=index, columns=cols)

    def preprocess_in_pipe(self):
        if (self.is_model_pre_train and self.last_trained_date):
            self.fetch_latest_data()

    def pred_df_from_dummy_inverse(self, y_pred):
        length = len(y_pred)
        try:
            dummy_df = pd.read_csv(
                'C:/Users/jeetc/OneDrive/Desktop/Projects/Fintech/Backend/stockwatch/main/modules/dummy_for_inverse.csv', index_col='Date')[-length:]
            dummy_df['Open'] = y_pred
            i_ds = self.inverse_preprocess(dummy_df)
            return i_ds[:, 0]
        except Exception as e:
            print(e)
            return None

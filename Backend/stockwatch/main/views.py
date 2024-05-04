import os
import datetime
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta

from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from main.models import FII_DATA, Article
from main.modules.base import MoneyControlScraper
from main.modules.configs import company_news, business_all, economy_news
from django.http import JsonResponse
# Import SentimentIntensityAnalyzer from vaderSentiment
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from main.modules.ml_model import AI_Model
import json
import numpy as np
from django.views.decorators.csrf import csrf_exempt
from optionlab import run_strategy

# Create your views here.


def df_to_sql():
    money_cont_csv = ['main/temp_data/business-full-moneycontrol.csv',
                      'main/temp_data/business-stocks-moneycontrol.csv',
                      'main/temp_data/company-result-moneycontrol.csv',
                      'main/temp_data/economy_money_control.csv',
                      'main/temp_data/market-moneycontrol.csv',
                      'main/temp_data/news-comp-mcont-from-jul-23.csv',
                      ]

    # Initialize an empty DataFrame to store the combined data
    news_data = pd.DataFrame(
        columns=['date time', 'content', 'link', 'title', 'desc'])

    # Iterate through each CSV file and concatenate the data
    for csv_file in money_cont_csv:
        df = pd.read_csv(csv_file)

        # Check if the DataFrame has 'date time' and 'content' columns, and adjust accordingly
        if 'date time' in df.columns and 'content' in df.columns:
            try:
                df['date time'] = pd.to_datetime(df['date time'].str.replace(
                    ' IST', ''), format="%B %d, %Y %I:%M %p", errors='coerce')
                # df['content'] = df['title'] + ' ' + df['desc']
                # Drop rows with NaT in the 'date' column
    #             df = df.dropna(subset=['date'])
                news_data = pd.concat([news_data, df])
            except Exception as e:
                print(f"Error processing {csv_file}: {str(e)}")
        else:
            # If columns are different, you may need to adjust this part based on your actual data
            print(
                f"Columns in {csv_file} are different. Adjust the code accordingly.")

    # Set the 'date' column as the index
    news_data.set_index('date time', inplace=True)

    # Sort the DataFrame by date
    news_data.sort_index(inplace=True)

    # Iterate over the rows of the DataFrame
    for index, row in news_data.iterrows():
        print(index)
        # Create an Article object using data from the current row
        article = Article(
            link=row['link'],
            title=row['title'],
            date_time=index,
            description=row['desc'],
            content=row['content']
        )
        # Save the Article object to the database
        article.save()


def index(req):
    # df_to_sql()
    return HttpResponse("hello")


def fetch_and_store_data(request):
    # Define symbols, start, and end dates
    symbols = ['^DJI', 'BTC-USD', 'ETH-USD', 'CL=F', 'GC=F', 'SI=F',
               'NG=F', 'DX-Y.NYB', '^BSESN', '^NDX', '^GSPC', '^NSEI']
    start = datetime.datetime(2018, 1, 1)
    end = datetime.datetime(2024, 4, 6)

    # Check if there is existing data in the database
    existing_data = FII_DATA.objects.all()
    if existing_data.exists():
        # If data exists, find the last checkpoint date
        last_checkpoint_date = existing_data.latest('date').date
        start = last_checkpoint_date + datetime.timedelta(days=1)

    # Function to fetch historical data for a symbol
    def fetch_data(symbol):
        data = yf.download(symbol, start=start, end=end)
        return data[['Open', 'High', 'Low', 'Close', 'Volume']].rename(columns={'Open': f'{symbol}_open', 'Low': f'{symbol}_low', 'High': f'{symbol}_high', 'Close': f'{symbol}_close', 'Volume': f'{symbol}_volume'})

    # Fetch data for all symbols and create a DataFrame
    dfs = [fetch_data(symbol) for symbol in symbols]
    result_df = pd.concat(dfs, axis=1, join='inner')

    # Store data into the database
    for index, row in result_df.iterrows():
        financial_data = FII_DATA.objects.create(
            date=index.date(),  # Store the date
            DJI_open=row['^DJI_open'],
            DJI_high=row['^DJI_high'],
            DJI_low=row['^DJI_low'],
            DJI_close=row['^DJI_close'],
            DJI_volume=row['^DJI_volume'],
            BTC_USD_open=row['BTC-USD_open'],
            BTC_USD_high=row['BTC-USD_high'],
            BTC_USD_low=row['BTC-USD_low'],
            BTC_USD_close=row['BTC-USD_close'],
            BTC_USD_volume=row['BTC-USD_volume'],
            ETH_USD_open=row['ETH-USD_open'],
            ETH_USD_high=row['ETH-USD_high'],
            ETH_USD_low=row['ETH-USD_low'],
            ETH_USD_close=row['ETH-USD_close'],
            ETH_USD_volume=row['ETH-USD_volume'],
            CL_F_open=row['CL=F_open'],
            CL_F_high=row['CL=F_high'],
            CL_F_low=row['CL=F_low'],
            CL_F_close=row['CL=F_close'],
            CL_F_volume=row['CL=F_volume'],
            GC_F_open=row['GC=F_open'],
            GC_F_high=row['GC=F_high'],
            GC_F_low=row['GC=F_low'],
            GC_F_close=row['GC=F_close'],
            GC_F_volume=row['GC=F_volume'],
            SI_F_open=row['SI=F_open'],
            SI_F_high=row['SI=F_high'],
            SI_F_low=row['SI=F_low'],
            SI_F_close=row['SI=F_close'],
            SI_F_volume=row['SI=F_volume'],
            NG_F_open=row['NG=F_open'],
            NG_F_high=row['NG=F_high'],
            NG_F_low=row['NG=F_low'],
            NG_F_close=row['NG=F_close'],
            NG_F_volume=row['NG=F_volume'],
            DX_Y_NYB_open=row['DX-Y.NYB_open'],
            DX_Y_NYB_high=row['DX-Y.NYB_high'],
            DX_Y_NYB_low=row['DX-Y.NYB_low'],
            DX_Y_NYB_close=row['DX-Y.NYB_close'],
            DX_Y_NYB_volume=row['DX-Y.NYB_volume'],
            BSESN_open=row['^BSESN_open'],
            BSESN_high=row['^BSESN_high'],
            BSESN_low=row['^BSESN_low'],
            BSESN_close=row['^BSESN_close'],
            BSESN_volume=row['^BSESN_volume'],
            NDX_open=row['^NDX_open'],
            NDX_high=row['^NDX_high'],
            NDX_low=row['^NDX_low'],
            NDX_close=row['^NDX_close'],
            NDX_volume=row['^NDX_volume'],
            GSPC_open=row['^GSPC_open'],
            GSPC_high=row['^GSPC_high'],
            GSPC_low=row['^GSPC_low'],
            GSPC_close=row['^GSPC_close'],
            GSPC_volume=row['^GSPC_volume'],
            NSEI_open=row['^NSEI_open'],
            NSEI_high=row['^NSEI_high'],
            NSEI_low=row['^NSEI_low'],
            NSEI_close=row['^NSEI_close'],
            NSEI_volume=row['^NSEI_volume'],
        )
        financial_data.save()

    return JsonResponse({'message': 'Data stored successfully'})


@csrf_exempt
def fetch_and_store_articles(request):
    # Define scraper pages
    scraper_pages = [economy_news]
    last_article = Article.objects.order_by('-date_time').first()

    # Initialize scraper for each page
    for scraper_page in scraper_pages:
        scraper = MoneyControlScraper(
            scraper_page, verbose=True, last_article=last_article)
        scraper.fetch_all()  # Fetch the latest data

        # Iterate over fetched data
        for news_data in scraper.news_data:
            news_date_time = datetime.strptime(
                news_data['date time'][:-4], '%B %d, %Y %I:%M %p')

            # Check if the article already exists in the database
            existing_articles = Article.objects.filter(
                title=news_data['title'], date_time=news_date_time)

            # If article doesn't exist, create and save it
            if not existing_articles.exists():
                article = Article.objects.create(
                    link=news_data['link'],
                    title=news_data['title'],
                    date_time=news_date_time,
                    description=news_data['desc'],
                    content=news_data['content']
                )
                article.save()

    return JsonResponse({'message': 'Articles fetched and stored successfully.'})


def latestNews(request):
    analyzer = SentimentIntensityAnalyzer()

    latest_articles = Article.objects.order_by('-date_time')[:4]
    articles_data = []
    for article in latest_articles:
        description = article.description
        # Perform sentiment analysis on the description
        sentiment_scores = analyzer.polarity_scores(description)
        # sentiment = TextBlob(description).sentiment.polarity
        # Classify sentiment as positive, negative, or neutral based on compound score

        article_data = {
            'id': article.id,
            'link': article.link,
            'title': article.title,
            'date_time': article.date_time.strftime("%Y-%m-%d %H:%M:%S"),
            'description': description,
            # 'content': article.content,
            # Include sentiment in the response
            'sentiment': sentiment_scores['compound']
            # 'sentiment': sentiment
        }
        articles_data.append(article_data)
    return JsonResponse(articles_data, safe=False)


"""
req --> load model --> check last fetch data if its old fetch latest --> train on latest --> predict 7 days ahead --> send response
"""


def predict(request):
    pre_nn_model = AI_Model(model_path='C:/Users/jeetc/OneDrive/Desktop/Projects/Fintech/Backend/stockwatch/main/modules/trained_model-latest.h5',
                            scaler_path='C:/Users/jeetc/OneDrive/Desktop/Projects/Fintech/Backend/stockwatch/main/modules/scaler-latest.pkl')
    with open('C:/Users/jeetc/OneDrive/Desktop/Projects/Fintech/Backend/stockwatch/main/modules/x_df.json', 'r') as f:
        X_list = json.load(f)

    with open('C:/Users/jeetc/OneDrive/Desktop/Projects/Fintech/Backend/stockwatch/main/modules/till_now.json', 'r') as f:
        till_now = json.load(f)
    # Convert the Python list back to a NumPy array
    X = np.array(X_list)
    # X = test_df[-pre_nn_model.sequence_length:].to_numpy()[np.newaxis,:pre_nn_model.sequence_length]
    y_pred = pre_nn_model.predict_future_prices(X)
    # pre_nn_model.fetch_latest_data()
    # till_now_price = pre_nn_model.data.iloc[-20:]['Open']
    print(y_pred, "dddd")
    predictions = pre_nn_model.pred_df_from_dummy_inverse(y_pred[0]) - 350
    return JsonResponse({'till_today': till_now, "predicted": predictions.tolist()})


@csrf_exempt
def calculate_profit(request):
    if request.method == 'POST':
        with open('C:/Users/jeetc/OneDrive/Desktop/Projects/Fintech/Backend/stockwatch/main/modules/till_now.json', 'r') as f:
            till_now = json.load(f)
        # Parse JSON data from the request
        last_key, last_value = till_now.popitem()
        # date_now = datetime(last_key)
        # date_future = (date_now + timedelta(days=7)).strftime('%Y-%m-%d')

        data = json.loads(request.body)
        print(data, "res.")

        yield_rate = 7.179
        inflation = 4.85

        inputs_data = {
            'country': 'India',
            "stock_price": last_value,
            "start_date": "2024-04-20",
            "target_date": "2024-04-24",
            "volatility": 0.1153,
            "interest_rate": 0.0002,
            "min_stock": 21700,
            "max_stock": 22800,
            "strategy": data
        }

        # Call run_strategy with the parsed data
        out = run_strategy(inputs_data)
        print(out, "out.")

        # Round floating-point values to two decimal places
        probability_of_profit = round(out.probability_of_profit * 100.0, 2)
        strategy_cost = round(out.strategy_cost, 2)
        per_leg_cost = [round(cost, 2) for cost in out.per_leg_cost]
        implied_volatility = [round(volatility, 2)
                              for volatility in out.implied_volatility]
        in_the_money_probability = [round(probability, 2)
                                    for probability in out.in_the_money_probability]
        delta = [round(value, 2) for value in out.delta]
        gamma = [round(value, 2) for value in out.gamma]
        theta = [round(value, 2) for value in out.theta]
        vega = [round(value, 2) for value in out.vega]

        # Construct the response JSON object
        response_data = {
            "probability_of_profit": probability_of_profit,
            # "profit_ranges": out.profit_ranges,
            "strategy_cost": strategy_cost,
            "per_leg_cost": per_leg_cost,
            "implied_volatility": implied_volatility,
            "in_the_money_probability": in_the_money_probability,
            "delta": delta,
            "gamma": gamma,
            "theta": theta,
            "vega": vega
        }

        # Return the result as a JSON response
        return JsonResponse(response_data, safe=False)
    else:
        # Return error response for non-POST requests
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

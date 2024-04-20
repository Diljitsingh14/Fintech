from django.urls import path
from main.views import index, fetch_and_store_data, fetch_and_store_articles, latestNews, predict, calculate_profit
from rest_framework.routers import DefaultRouter


urlpatterns = [
    path('news_loaf_from_df', index),
    path('fetch_fii_data/', fetch_and_store_data),
    path('fetch_news/', fetch_and_store_articles),
    path('latest_news/', latestNews),
    path('predict/', predict),
    path('risk_cal/', calculate_profit),

]

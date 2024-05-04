import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import pandas as pd
import re
from main.modules.configs import base_url


class MoneyControlScraper():
    def __init__(self, scrape_page: str, verbose=True, last_article=None) -> None:
        self.news_data = []
        self.url = base_url+scrape_page
        self.verbose = verbose
        self.last_article = last_article

    def get_full_news_text(self, link: str):
        """
        Get Full response or Full News Decription
        """
        response = requests.get(link)
        soup = BeautifulSoup(response.text, 'html.parser')
        try:
            paras = soup.find_all('div', id='contentdata')[0].find_all('p')
            text = ""
            for para in paras:
                text += para.text
        except Exception as err:
            try:
                text = soup.find('p', 'pro_artidesc').text
            except:
                return

        return text

    def extract_news_data(self, news):
        """
        Get insights of news component
        """
        news_json = {}

        # Skip ad tag;
        if not news.get('class') or 'clearfix' not in news.get('class'):
            return "ad"

        a = news.find('a')
        span = news.find('span')

        news_json['link'] = a.get('href')
        news_json['title'] = a.get('title')
        news_json['date time'] = span.text

        # Append on previous data
        # if is_appen_on_previous and news_json['date time'] == df.iloc[0]['date time']:
        #     return None

        p = news.find_all('p')[0]
        news_json['desc'] = p.text
        news_json['content'] = self.get_full_news_text(news_json['link'])
    #     news_json['stock id'] = getStockId(news_json['link'])
        return news_json

    def fetch_page(self, page=None):
        """
        Fetch News Entire page and extract the data
        """
        url = f'{self.url}'
        # fetching base page
        if page and page >= 2:
            url = f"{self.url}/page-{page}/"

        # for processing details
        if (self.verbose):
            print(url)

        response = requests.get(url)   # get new html data
        soup = BeautifulSoup(response.text, 'html.parser')  # create soup
        news_ul = soup.find_all("ul", id="cagetory")[
            0]   # extract news data conponent

        # For Skips Ad Tag
        if not news_ul:
            return True

        li = news_ul.find_all('li')  # get list of news
        # iterate news component for get more insights
        for index, news in enumerate(li):

            # logging
            if (self.verbose):
                print(index)

            # extract news insights
            try:
                news_json = self.extract_news_data(news)
            except:
                news_json = None

            # return none if news already in DB not want to duplicate and want not to continue
            if not news_json:
                return None
            if news_json == 'ad':
                continue

            # Check if the article matches the provided title and date
            if self.last_article and news_json['title'] == self.last_article.title and news_json['date time'] == self.last_article.date_time.strftime('%B %d, %Y %I:%M %p IST'):
                # Break the loop if the provided title and date match
                return False

            # save data
            self.news_data.append(news_json)

        # want not to continue if in the loop
        return True

    # Convert Date string object to Date
    def get_date_object(self, dateString: str, dateFormat='%B %d, %Y %I:%M %p'):
        dt_object = datetime.strptime(dateString, dateFormat)
        return dt_object

    def fetch_all(self, batch_size=10, total_nums=30):
        batches = int(total_nums/batch_size)

        for batch in range(batches):
            if (self.verbose):
                print('batch -- ', batch)
            for page in range(batch*batch_size, (batch+1)*batch_size):
                if page == 0:
                    continue
                if (self.verbose):
                    print("fetching page -- ", page)
                if not self.fetch_page(page):
                    break

    def get_data_frame(self):
        news_df = pd.DataFrame(self.news_data)
        return news_df

    def save_data_frame(self, file_name: str = "news.csv"):
        news_df = pd.DataFrame(self.news_data)
        news_df.to_csv(file_name)

    def fetch_page_at_last(self, page=None):
        """
        Fetch News Entire page and extract the data
        """
        url = f'{self.url}'
        # fetching base page
        if page and page >= 2:
            url = f"{self.url}/page-{page}/"

        # for processing details
        if (self.verbose):
            print(url)

        response = requests.get(url)   # get new html data
        soup = BeautifulSoup(response.text, 'html.parser')  # create soup
        news_ul = soup.find_all("ul", id="cagetory")[
            0]   # extract news data conponent

        # For Skips Ad Tag
        if not news_ul:
            return True

        li = news_ul.find_all('li')  # get list of news
        # iterate news component for get more insights
        for index, news in enumerate(li):

            # logging
            if (self.verbose):
                print(index)

            # extract news insights
            news_json = self.extract_news_data(news)

            # return none if news already in DB not want to duplicate and want not to continue
            if not news_json:
                return None
            if news_json == 'ad':
                continue

            # Check if the article matches the provided title and date
            if self.last_article and news_json['title'] == self.last_article.title and news_json['date time'] == self.last_article.date_time.strftime('%b %d, %Y %I:%M %p'):
                # Break the loop if the provided title and date match
                return False

            # save data
            self.news_data.append(news_json)

        # want not to continue if in the loop
        return True

    def test(self):
        print(f'Fetching {self.url}')
        self.fetch_page(1)
        print("Fetch number of review : ", len(self.news_data))

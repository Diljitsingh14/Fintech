import pandas as pd
import os
import django

# Set the DJANGO_SETTINGS_MODULE environment variable
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stockwatch.settings')

# Configure Django settings
# django.setup()

# Import your Article model from Django


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


df_to_sql()

from base import MoneyControlScraper
from configs import business_all


def main():
    print("Testing the Money control scraper")
    mc = MoneyControlScraper(scrape_page=business_all)
    mc.test()


if __name__ == "__main__":
    main()

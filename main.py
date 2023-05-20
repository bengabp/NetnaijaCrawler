from playwright.sync_api import sync_playwright,BrowserContext
from pprint import pprint
import json
from config import DIR_PATH,logger


class NetnaijaCrawler:
	def __init__(self):
		self.logger = logger
		self.base_url = "https://www.thenetnaija.net"
		self.movies_url = f"{self.base_url}/videos/movies"
	
	def run(self):
		self.logger.info("Starting crawler ...")
		with sync_playwright() as playwright_sync:
			browser = playwright_sync.chromium.launch(headless = True)
			context = browser.new_context()
			page = context.new_page()
			
			page.goto(self.movies_url)
			movie_elements = page.query_selector_all("div.video-files > article.file-one.shadow")
			
			movies = []
			"""
			for movie_element in movie_elements:
				image_url = movie_element.query_selector("div.thumbnail img").get_property("src").__str__()
				title_hyperlink = movie_element.query_selector("div.info h2 > a")
				title = title_hyperlink.text_content().strip()
				details_url = title_hyperlink.get_property("href").__str__()
				upload_time = movie_element.query_selector("div.info .meta .inner span[title]").get_property(
					"title").__str__()
				rating_element = movie_element.query_selector(".rating span.rating-stars")
				positive_stars = rating_element.query_selector_all("i.filled").__len__()
				total_stars = rating_element.query_selector_all("i").__len__()
				rating_str = f"{positive_stars}/{total_stars}"
				
				movie_details = {
					"image_url": image_url,
					"title": title,
					"details_url": details_url,
					"upload_time": upload_time,
					"rating": rating_str
				}
				self.logger.info(f"Movie => {title}")
				movies.append(movie_details)
				
			with open("movies.json","w") as movies_json:
				json.dump(movies,movies_json,indent=4)
			# Scrape movie description
		"""

	def get_movie_details(self,details_url,context:BrowserContext):
		details_page = context.new_page()
		details_page.goto(details_url)
		print(details_page.title())
	


if __name__ == "__main__":
	crawler = NetnaijaCrawler()
	crawler.run()

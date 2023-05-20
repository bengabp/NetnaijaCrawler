from playwright.sync_api import sync_playwright

class NetnaijaCrawler:
	def __init__(self):
		self.base_url = "https://www.thenetnaija.net"
		self.movies_url = f"{self.base_url}/videos/movies"
		
	def run(self):
		with sync_playwright() as playwright_sync:
			browser = playwright_sync.chromium.launch(headless=False)
			context = browser.new_context()
			page = context.new_page()
			
			page.goto(self.movies_url)
			print(page.title())
	
			
if __name__ == "__main__":
	crawler = NetnaijaCrawler()
	crawler.run()
	
import requests
from config import logger
from bs4 import BeautifulSoup

base_movies_url = "https://www.thenetnaija.net/videos/movies"

class NetnaijaCrawler:
	def __init__(self):
		self.logger = logger
		self.base_url = "https://www.thenetnaija.net"
		self.movies_url = f"{self.base_url}/videos/movies"


	def getMoviesList(self, page = 0):

		headers = {
			'authority': 'www.thenetnaija.net',
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
			'accept-language': 'it,it-IT;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
			'dnt': '1',
			'prefer': 'safe',
			'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'document',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-site': 'none',
			'sec-fetch-user': '?1',
			'upgrade-insecure-requests': '1',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.37',
		}

		r = requests.get(f"{base_movies_url}/page/{page}", headers = headers )

		doc = BeautifulSoup(r.text, "html.parser")

		return  doc.find_all("article", {"class": "file-one shadow"})


	def getFilmName(self, FilmTag):
		return  FilmTag.find("a")["href"][42:]
	def getDownloadLink( self, FilmName):
		headers = {
			'authority': 'www.thenetnaija.net',
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
			'accept-language': 'it,it-IT;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
			'dnt': '1',
			'prefer': 'safe',
			'referer': 'https://www.thenetnaija.net/videos/movies/18835-mutant-ghost-war-girl-2022-chinese',
			'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'document',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-site': 'same-origin',
			'sec-fetch-user': '?1',
			'upgrade-insecure-requests': '1',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.37',
		}

		response = requests.get(
			f'https://www.thenetnaija.net/videos/movies/{FilmName}/download',
			headers=headers
		)

		SabiShareMovieId = response.url[31: 42]

		headers = {
			'authority': 'api.sabishare.com',
			'accept': 'application/json, text/plain, */*',
			'accept-language': 'it-IT,it;q=0.9',
			'origin': 'https://www.sabishare.com',
			'referer': 'https://www.sabishare.com/',
			'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-site',
			'sec-gpc': '1',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
		}

		response = requests.get(f'https://api.sabishare.com/token/download/{SabiShareMovieId}', headers=headers)

		return response.json()["data"]["url"]
Crawler = NetnaijaCrawler()

Movies = Crawler.getMoviesList(5)


name = Crawler.getFilmName(Movies[0])

link = Crawler.getDownloadLink(name)

print(link)
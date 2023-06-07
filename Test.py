from Crawler import NetnaijaCrawler

crawler = NetnaijaCrawler()

Movies = crawler.getMoviesList(5)


name = crawler.getFilmName(Movies[0])

link = crawler.getDownloadLink(name)

crawler.logger.info(link)
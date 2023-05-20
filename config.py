import os
from dotenv import load_dotenv
import logging
import sys
from colorlog import ColoredFormatter

DIR_PATH = os.path.dirname(os.path.realpath(__file__))

# Create a logger object
logger = logging.getLogger('mylogger')
logger.setLevel(logging.DEBUG)

# Define a custom date format
date_format = '%b,%d - %H:%M'

# Create a formatter object with color formatting
formatter = ColoredFormatter(
		'%(log_color)s[%(asctime)s] %(levelname)s => %(message)s',
		datefmt=date_format,
		log_colors={
			'INFO': 'cyan',
			'DEBUG': 'green',
			'WARNING': 'yellow',
			'ERROR': 'red',
			'CRITICAL': 'red,bg_white',
		},
)

formatter2 = logging.Formatter('[%(asctime)s] %(levelname)s => %(message)s', datefmt='%b,%d - %H:%M')

# Create a file handler and add it to the logger
file_handler = logging.FileHandler(os.path.join(DIR_PATH,'runtime.log'), mode="a")
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(formatter2)
# file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Create a stream handler for console output with color formatting
stream_handler = logging.StreamHandler(sys.stdout)
stream_handler.setLevel(logging.INFO)
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)



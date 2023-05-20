FROM python:3.8-alpine

# Set working directory in the container
WORKDIR /app

# Copy all files from local directory to app container directory
COPY . /app/CompanyHouse

# Change working directory to project dir
WORKDIR /app/CompanyHouse

# Install dependencies
RUN pip install -r requirements.txt

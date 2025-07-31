# Library App

A web-based library application that allows users to search for books using the Open Library API. Users can search by keyword, author, title, or subject and view detailed book information including covers, publication details, and availability.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Load Balancer Configuration](#load-balancer-configuration)
- [API Information](#api-information)
- [User Interactions](#user-interactions)
- [Testing](#testing)
- [Challenges and Solutions](#challenges-and-solutions)
- [Credits](#credits)

## Features

- **Book Search**: Search for books using multiple criteria (keyword, author, title, subject)
- **Real-time Results**: Instant search results from Open Library's extensive database
- **Book Details**: View book covers, authors, publication years, and other metadata
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Filter Options**: Advanced filtering capabilities for refined search results
- **Error Handling**: Graceful handling of API errors and network issues

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: Open Library API
- **Containerization**: Docker
- **Deployment**: Docker Hub, Load Balancer
- **Web Server**: Nginx (containerized)

## Project Structure

```
library-app/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # JavaScript functionality
├── env.js              # Environment configuration
├── Dockerfile          # Docker container configuration
├── .gitignore          # Git ignore rules
├── .dockerignore       # Docker ignore rules
└── README.md           # Project documentation
```

## Local Development

### Prerequisites
- Web browser (Chrome, Firefox, Safari, etc.)
- Docker (for containerization)
- Git

### Running Locally (Simple Web Server)
1. Clone the repository:
   ```bash
   git clone https://github.com/Gasasiragrace/library-api_summative.git
   cd library-app
   ```

2. Open `index.html` in your web browser, or serve it using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8080
   
   # Using Node.js (if you have http-server installed)
   npx http-server -p 8080
   ```

3. Navigate to `http://localhost:8080` in your browser

## Docker Deployment

### Image Details
- **Docker Hub Repository**: https://hub.docker.com/r/graceumwari/library-app
- **Image Name**: `graceumwari/library-app`
- **Available Tags**: `v1`, `latest`

### Build Instructions
Build the Docker image locally:
```bash
docker build -t graceumwari/library-app:v1 .
```

### Local Testing
Test the container locally:
```bash
# Run the container
docker run -p 8080:8080 graceumwari/library-app:v1

# Verify it works
curl http://localhost:8080
# Or open http://localhost:8080 in your browser
```

### Push to Docker Hub
```bash
# Login to Docker Hub
docker login

# Push the image
docker push graceumwari/library-app:v1
docker push graceumwari/library-app:latest
```

### Deployment on Web Servers

#### Deploy on Web01 and Web02
SSH into each server and run:

```bash
# Pull the latest image
docker pull graceumwari/library-app:v1

# Run the container
docker run -d --name library-app --restart unless-stopped \
  -p 8080:8080 graceumwari/library-app:v1
```

Verify each instance is running:
```bash
# Check Web01
curl http://web-01:8080

# Check Web02  
curl http://web-02:8080
```

## Load Balancer Configuration

### HAProxy Configuration
Update `/etc/haproxy/haproxy.cfg` on lb-01:

```haproxy
global
    daemon

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend web_frontend
    bind *:80
    default_backend webapps

backend webapps
    balance roundrobin
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

### Reload HAProxy
```bash
# Reload HAProxy configuration
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
```

### Alternative Load Balancer (Node.js)
The project includes a Node.js-based load balancer (`load-balancer.js`) that implements round-robin distribution:

```javascript
const servers = [
  "https://web01-grace.onrender.com/",
  "https://web02-grace.onrender.com/"
];
```

## API Information

### Open Library API
- **API Documentation**: https://openlibrary.org/developers/api
- **Base URL**: `https://openlibrary.org/search.json`
- **Rate Limits**: No authentication required, reasonable usage expected
- **Search Parameters**:
  - `q`: General keyword search
  - `author`: Search by author name
  - `title`: Search by book title
  - `subject`: Search by subject/genre

### API Usage Example
```javascript
const searchQuery = encodeURIComponent(userInput);
const filterType = document.getElementById('filterType').value;
const url = `https://openlibrary.org/search.json?${filterType}=${searchQuery}&limit=20`;
```

## User Interactions

The application provides several interactive features:

1. **Search Functionality**:
   - Text input for search queries
   - Dropdown filter for search type (keyword, author, title, subject)
   - Real-time search button

2. **Results Display**:
   - Book covers (when available)
   - Title and author information
   - Publication year
   - Subject categories

3. **Error Handling**:
   - Network error messages
   - Empty result notifications
   - Loading states during API calls

## Testing

### End-to-End Testing
Test the complete deployment:

```bash
# Test direct access to servers
curl http://web-01:8080
curl http://web-02:8080

# Test load balancer (multiple requests to verify round-robin)
for i in {1..6}; do
  curl -s http://localhost | grep "server-id" || echo "Request $i completed"
  sleep 1
done
```

### Functional Testing
1. Open the application in a browser
2. Test different search types:
   - Search by keyword: "javascript"
   - Search by author: "Stephen King"
   - Search by title: "The Great Gatsby"
   - Search by subject: "science fiction"
3. Verify results display correctly
4. Test error scenarios (invalid searches, network issues)

### Load Balancer Verification
Evidence of successful load balancing:
- Multiple curl requests show distribution between servers
- Browser network tab shows requests alternating between Web01 and Web02
- Server logs indicate traffic from both instances

## Challenges and Solutions

### Challenge 1: CORS Issues
**Problem**: Cross-origin requests to Open Library API were initially blocked.
**Solution**: Used proper fetch API configuration and ensured the API supports CORS.

### Challenge 2: Docker Container Networking
**Problem**: Containers couldn't communicate properly in the lab environment.
**Solution**: Used proper Docker network configuration and verified port mappings.

### Challenge 3: Load Balancer Configuration
**Problem**: HAProxy wasn't properly distributing traffic.
**Solution**: Implemented proper backend server configuration with health checks.

### Challenge 4: API Rate Limiting
**Problem**: Potential rate limiting with excessive API calls.
**Solution**: Implemented debouncing for search requests and proper error handling.

## Environment Variables and Security

The application uses minimal configuration:
- No API keys required (Open Library API is public)
- Environment-specific settings in `env.js`
- No sensitive data stored in the repository




 

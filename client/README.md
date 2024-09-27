
# EdQuest

A custom search engine that fetches and ranks results from various content types such as YouTube videos, articles, academic papers, and blogs. It utilizes the SERP API to gather search results and applies a custom ranking algorithm to deliver the most relevant content.



## Features

- Multiple Content Types: Fetches results from different sources including:
  - YouTube
  - Blogs
  - Articles
  - Academic Papers
- Custom Ranking Algorithm: Results are ranked based on relevance using a custom scoring system.
- SERP API Integration: Uses the SERP API to fetch content efficiently.

## Deployment

To deploy this project run

```bash
  npm run deploy
```


## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js, Express
- **API**: SERP API
- **Deployment**: Vercel


## Project Structure
The project is divided into two folders:

- **Frontend**: Located in the client folder, built using Vite for fast development and optimized builds.
- **Backend**: Located in the backend folder, powered by Node.js and Express, responsible for handling API requests and interactions with external APIs like SERP.
## Setup and Installation

**Prerequisites**
- Node.js installed
- SERP API key

**Backend Setup**

Navigate to the backend folder:

```bash
cd backend
```
Install dependencies:

```bash
npm install
```
Create a .env file in the backend folder and add your SERP API key:

SERP_API_KEY=your_serp_api_key
Start the backend server:

```bash
npm start
```
**Frontend Setup**

Navigate to the frontend folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```
Start the development server using Vite:

```bash
npm run dev
```

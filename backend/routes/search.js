const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const SERPAPI_KEY = process.env.SERPAPI_KEY;

router.get('/', async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const [youtubeResults, articlesResults, academicResults] = await Promise.all([
      searchYouTube(term),
      searchArticles(term),
      searchAcademicPapers(term),
    ]);

    const combinedResults = [
      ...youtubeResults,
      ...articlesResults,
      ...academicResults,
    ].sort((a, b) => b.rank - a.rank);

    res.json(combinedResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
});

async function searchYouTube(term) {
  
    try {
      console.log(`Searching YouTube for: ${term}`);
      console.log(`Using API Key: ${SERPAPI_KEY.substring(0, 5)}...`);
  
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          engine: 'youtube',
          search_query: term,
          api_key: SERPAPI_KEY,
        },
      });
  
      console.log('SerpAPI Response:', JSON.stringify(response.data, null, 2));
  
      const videos = response.data.video_results || [];
      
      return videos.map(video => {
        console.log('Processing video:', JSON.stringify(video, null, 2));
        
        let views = 0;
        if (typeof video.views === 'string') {
          views = parseInt(video.views.replace(/\D/g, ''), 10);
        } else if (typeof video.views === 'number') {
          views = video.views;
        } else {
          console.warn(`Unexpected type for video.views: ${typeof video.views}`);
        }
  
        return {
          type: 'youtube',
          title: video.title || 'No Title',
          link: video.link || '',
          description: video.snippet || '',
          thumbnail: video.thumbnail?.static || '',
          views: views,
          rank: calculateRank({
            views: views,
            like: video.likes || 0,
            relevance: 0.8,
            sourceCredibility: 70,
            contentType: 'youtube',
          }),
        };
      });
    } catch (error) {
      console.error('YouTube Search Error:');
      if (error.response) {
        console.error('Data:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
      return [];
    }
}
async function searchArticles(term) {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google',  // SerpAPI Google engine
        q: term,
        api_key: SERPAPI_KEY,  // Use SerpAPI key from .env
      },
    });

    const articles = response.data.organic_results || [];
    
    return articles.map(article => ({
      type: 'article',
      title: article.title,
      link: article.link,
      description: article.snippet,
      thumbnail: article.thumbnail || null,
      rank: calculateRank({
        relevance: 0.9,
        sourceCredibility: determineSourceCredibility(article.displayed_link),
        contentType: 'article',
        pageData: { readability: 0.7, freshness: 0.8 },  // Placeholder data
      }),
    }));
  } catch (error) {
    console.error('Article Search Error:', error);
    return [];
  }
}

async function searchAcademicPapers(term) {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_scholar',  // SerpAPI Google Scholar engine
        q: term,
        api_key: SERPAPI_KEY,  // Use SerpAPI key from .env
      },
    });

    const papers = response.data.organic_results || [];
    
    return papers.map(paper => ({
      type: 'academic',
      title: paper.title,
      link: paper.link,
      description: paper.snippet,
      citationCount: paper.inline_links?.cited_by?.total || 0,
      rank: calculateRank({
        relevance: 0.95,
        sourceCredibility: 100,
        contentType: 'academic',
        citationCount: paper.inline_links?.cited_by?.total || 0,
      }),
    }));
  } catch (error) {
    console.error('Academic Paper Search Error:', error);
    return [];
  }
}

function calculateRank({ views, relevance, sourceCredibility, contentType, citationCount, pageData }) {
  let score = 0;

  switch (contentType) {
    case 'youtube':
      score = (Math.log(views + 1) * 0.4) + (relevance * 0.2) + (sourceCredibility * 0.1);
      break;
    case 'article':
      score = (relevance * 0.4) + (sourceCredibility * 0.3) + (pageData.readability * 0.2) + (pageData.freshness * 0.1);
      break;
    case 'academic':
      score = (relevance * 0.3) + (sourceCredibility * 0.3) + (Math.log(citationCount + 1) * 0.4);
      break;
    default:
      score = (relevance * 0.5) + (sourceCredibility * 0.5);
  }

  return score;
}

function determineSourceCredibility(domain) {
  const credibleDomains = {
    'nature.com': 95,
    'science.org': 95,
    'ieee.org': 90,
    'acm.org': 90,
    'nih.gov': 95,
    'edu': 85,
    'gov': 80,
  };

  for (const [key, value] of Object.entries(credibleDomains)) {
    if (domain.includes(key)) {
      return value;
    }
  }

  return 50; // default credibility for unknown sources
}

module.exports = router;

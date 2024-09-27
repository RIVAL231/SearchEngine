import React, { useState, useMemo } from 'react';

function SearchResults({ results = [] }) {
    const [activeTab, setActiveTab] = useState('all');
    const [filterText, setFilterText] = useState('');

    const youtubeResults = useMemo(() => results.filter(result => result.type === 'youtube'), [results]);
    const otherResults = useMemo(() => results.filter(result => result.type !== 'youtube'), [results]);

    const filteredResults = useMemo(() => {
        const tabResults = activeTab === 'all' ? results : 
                                             activeTab === 'youtube' ? youtubeResults : otherResults;
        
        return tabResults.filter(result => 
            result.title.toLowerCase().includes(filterText.toLowerCase()) ||
            result.description.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [activeTab, filterText, results, youtubeResults, otherResults]);

    return (
        <div className="search-results">
            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('all')}
                >
                    All Results
                </button>
                <button 
                    className={`tab ${activeTab === 'youtube' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('youtube')}
                >
                    YouTube Videos
                </button>
                <button 
                    className={`tab ${activeTab === 'other' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('other')}
                >
                    Other Results
                </button>
            </div>

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Filter results..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="filter-input"
                />
                <button onClick={() => setFilterText('')} className="clear-button">
                    Clear
                </button>
            </div>

            <div className="results-grid">
                {filteredResults.map((result, index) => (
                    <ResultCard key={index} result={result} />
                ))}
            </div>

            <style jsx>{`
                .search-results {
                    font-family: Arial, sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .tabs {
                    display: flex;
                    margin-bottom: 20px;
                }
                .tab {
                    padding: 10px 20px;
                    background-color: #f0f0f0;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .tab:hover {
                    background-color: #e0e0e0;
                }
                .tab.active {
                    background-color: #007bff;
                    color: white;
                }
                .filter-container {
                    display: flex;
                    margin-bottom: 20px;
                }
                .filter-input {
                    flex-grow: 1;
                    padding: 10px;
                    font-size: 16px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .clear-button {
                    margin-left: 10px;
                    padding: 10px 20px;
                    background-color: #f0f0f0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .clear-button:hover {
                    background-color: #e0e0e0;
                }
                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
            `}</style>
        </div>
    );
}

function ResultCard({ result }) {
    return (
        <div className="result-card">
            <h3 className="result-title">
                <a href={result.link} target="_blank" rel="noopener noreferrer">
                    {result.title}
                </a>
            </h3>
            {result.type === 'youtube' && result.thumbnail && (
                <div className="thumbnail">
                    <img src={result.thumbnail} alt={result.title} />
                </div>
            )}
            <p className="result-description">{result.description}</p>
            <div className="result-meta">
                <span className="result-type">{result.type}</span>
                <span className="result-rank">Rank: {result.rank.toFixed(2)}</span>
            </div>
            {result.type === 'youtube' && (
                <div className="youtube-meta">
                    <span>Views: {result.views?.toLocaleString() ?? 'N/A'}</span>
                    <span>Likes: {result.likes?.toLocaleString() ?? 'N/A'}</span>
                </div>
            )}
            <style jsx>{`
                .result-card {
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 15px;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .result-title {
                    margin-top: 0;
                    margin-bottom: 10px;
                }
                .result-title a {
                    color: #1a0dab;
                    text-decoration: none;
                }
                .result-title a:hover {
                    text-decoration: underline;
                }
                .thumbnail {
                    margin-bottom: 10px;
                }
                .thumbnail img {
                    width: 100%;
                    height: auto;
                    border-radius: 4px;
                }
                .result-description {
                    font-size: 14px;
                    color: #545454;
                    margin-bottom: 10px;
                }
                .result-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #006621;
                }
                .youtube-meta {
                    margin-top: 10px;
                    font-size: 12px;
                    color: #545454;
                }
                .youtube-meta span {
                    margin-right: 10px;
                }
            `}</style>
        </div>
    );
}

export default SearchResults;

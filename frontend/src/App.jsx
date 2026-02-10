import React, { useState, useEffect, useRef } from 'react';
import { fetchSongs } from './services/api';
import { generateSimpleWav } from './utils/audioUtils';
import SongDetail from './components/SongDetail';
import CoverArt from './components/CoverArt';
import SongModal from './components/SongModal';
import './styles.css';

import JSZip from 'jszip';

const App = () => {
    const [seed, setSeed] = useState("12345");
    const [locale, setLocale] = useState('en-US');
    const [avgLikes, setAvgLikes] = useState(5.0);
    const [viewMode, setViewMode] = useState('table');
    
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [expandedId, setExpandedId] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);
    
    const observerTarget = useRef(null);
    const isInitialMount = useRef(true); 

    const loadData = async (pageNum, append = false) => {
        setLoading(true);
        try {
            const response = await fetchSongs({
                page: pageNum,
                seed,
                locale,
                avgLikes,
                mode: viewMode
            });
            
            if (append) {
                setItems(prev => [...prev, ...response.data]);
            } else {
                setItems(response.data);
            }
        } catch (error) {
            console.error("Error fetching songs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        setPage(1);
        setItems([]);
        setExpandedId(null);
        setSelectedSong(null);
        loadData(1, false);
    }, [seed, locale, avgLikes, viewMode]);

    useEffect(() => {
        if (isInitialMount.current) {
            loadData(1, false);
            isInitialMount.current = false;
            return;
        }

        if (viewMode === 'table' && page > 0) {
            loadData(page, false);
        }
    }, [page, viewMode]);

    useEffect(() => {
        if (viewMode !== 'gallery' || loading) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage(prev => {
                        const next = prev + 1;
                        loadData(next, true);
                        return next;
                    });
                }
            },
            { threshold: 1 }
        );
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [viewMode, loading]);

    const handleRandomSeed = () => {
        const rnd = Math.random().toString(36).substring(2, 15);
        setSeed(rnd);
    };

    const handleExport = async () => {
        const zip = new JSZip();
        items.forEach(song => {
            const wavData = generateSimpleWav(song.notes);
            const filename = `${song.artist} - ${song.album} - ${song.title}.mp3`;
            zip.file(filename, wavData);
        });

        const content = await zip.generateAsync({type:"blob"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "music_store_export.zip";
        link.click();
    };

    return (
        <div className="app-container">
            <header style={{marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px'}}>
                <h1 style={{margin: 0}}>Music Store</h1>
            </header>

            <div className="toolbar">
                <div className="control-group">
                    <label>Language</label>
                    <select value={locale} onChange={e => setLocale(e.target.value)}>
                        <option value="en-US">English (USA)</option>
                        <option value="uk-UA">Українська (Україна)</option>
                        <option value="ru-RU">Русский (Россия)</option>
                        <option value="zh-CN">中文 (中国)</option>
                    </select>
                </div>

                <div className="control-group">
                    <label>Seed (64-bit)</label>
                    <div className="input-wrapper">
                        <input type="text" value={seed} onChange={e => setSeed(e.target.value)}/>
                        <button onClick={handleRandomSeed} className="secondary input-btn-overlay"title="Generate Random Seed">
                            🎲
                        </button>
                    </div>
                </div>

                <div className="control-group">
                    <label>Avg Likes (0-10)</label>
                    <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="10" 
                        value={avgLikes} 
                        onChange={e => setAvgLikes(parseFloat(e.target.value))} 
                        style={{width: '80px'}}
                    />
                </div>

                <div className="view-toggle">
                    <button className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')}>Table</button>
                    <button className={viewMode === 'gallery' ? 'active' : ''} onClick={() => setViewMode('gallery')}>Gallery</button>
                </div>

                <button onClick={handleExport} style={{marginLeft: '15px'}}>Export ZIP</button>
            </div>

            {viewMode === 'table' ? (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Album</th>
                                <th>Genre</th>
                                <th>Likes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(song => (
                                <React.Fragment key={song.id}>
                                    <tr onClick={() => setExpandedId(expandedId === song.id ? null : song.id)}>
                                        <td>{song.id}</td>
                                        <td>{song.title}</td>
                                        <td>{song.artist}</td>
                                        <td>{song.album}</td>
                                        <td>{song.genre}</td>
                                        <td><span className="likes-badge">★ {song.likes}</span></td>
                                    </tr>
                                    {expandedId === song.id && (
                                        <tr className="detail-row">
                                            <td colSpan="6">
                                                <SongDetail song={song} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>Prev</button>
                        <span>Page {page}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={loading}>Next</button>
                    </div>
                </div>
            ) : (
                <div className="gallery-grid">
                    {items.map(song => (
                        <div className="card" key={song.id} onClick={() => setSelectedSong(song)}>
                            <div className="card-img">
                                <CoverArt data={song.coverData} width={200} height={200} />
                            </div>
                            <div className="card-body">
                                <h3>{song.title}</h3>
                                <p>{song.artist}</p>
                                <p className="likes-badge">★ {song.likes}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={observerTarget} className="loading-sentinel">
                        {loading ? 'Loading more music...' : ''}
                    </div>
                </div>
            )}

            <SongModal 
                song={selectedSong} 
                onClose={() => setSelectedSong(null)} 
            />
        </div>
    );
};

export default App;
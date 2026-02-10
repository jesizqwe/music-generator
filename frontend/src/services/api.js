const API_URL = '/api/songs';

export const fetchSongs = async (params) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}?${queryParams}`);
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    return response.json();
};
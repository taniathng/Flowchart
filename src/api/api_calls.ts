export const BASE_URL = 'http://127.0.0.1:5005';

export const fetchFlowData = async () => {
    try {
      // Append query parameters to the URL
        const response = await fetch(`${BASE_URL}/api/demo/llm-call`);
    
        if (!response.ok) {
            throw new Error('Failed to fetch flowchart data');
        }
    
        const data = await response.json();
        return data; // Return the data to be used in the component
    } catch (error) {
        console.error('Error fetching flowchart data:', error);
        throw error; // Throw error to be handled in the component
    }
};


export const fetchQueryData = async (query: string) => {
    try {
        // Properly encode the query and append it to the URL
        const encodedQuery = encodeURIComponent(query); // Encode the query properly
        const response = await fetch(`${BASE_URL}/api/demo/llm-call-query?query=${encodedQuery}`);
    
        if (!response.ok) {
            throw new Error('Failed to fetch query data');
        }
    
        const data = await response.json();
        return data; // Return the data to be used in the component
    } catch (error) {
        console.error('Error fetching query data:', error);
        throw error; // Throw error to be handled in the component
    }
};
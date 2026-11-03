// The API endpoint enables you to retrieve a specific quote based on the quote ID provided in the path variable.
// When accessing this endpoint and providing a valid quote ID, you will receive a response containing the quote 
// corresponding to that ID.
// API Endpoint format: "BASE_url/{quoteId}"

const BASE_url = import.meta.env.VITE_BASE_URL;

export default BASE_url;
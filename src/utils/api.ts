/**
 * Safely performs an API request, handles non-JSON HTML responses gracefully,
 * and throws meaningful errors instead of generic JSON parsing syntax errors.
 */
export async function safeApiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';

    // If the response is not JSON (e.g. HTML 404/500 from Vercel or Nginx proxy)
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      
      // Check if it's an HTML page or classic Vercel/Proxy error
      const trimmed = text.trim();
      if (
        trimmed.startsWith('<') || 
        trimmed.includes('<!DOCTYPE') || 
        trimmed.includes('The page') || 
        trimmed.includes('not found') ||
        trimmed.includes('Cannot POST') ||
        trimmed.includes('Cannot GET')
      ) {
        throw new Error(
          `The backend server returned an HTML page instead of JSON (Status ${response.status}). ` +
          `This usually means the Express API server is not running or the route is not found. ` +
          `If you are hosting on a static platform like Vercel, please note that static hosting does not run the Node/Express backend automatically without Vercel serverless functions, or run the app locally using the development command to start both front-end and back-end.`
        );
      }
      
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    let data: any;
    try {
      data = await response.json();
    } catch (parseErr) {
      throw new Error(
        `Failed to parse server response as JSON. The server might have returned an invalid response structure.`
      );
    }

    if (!response.ok) {
      // Extract specific error message from JSON response if present
      const errorMessage = data?.error || data?.message || `Server returned status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (err: any) {
    // Forward the error with context
    console.error(`[API Request Error] ${url}:`, err);
    throw err;
  }
}

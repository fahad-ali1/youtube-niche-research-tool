import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:5678/webhook/fetch_videos';
    
    // Create a timeout promise that resolves after 15 seconds
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          timedOut: true,
          success: true,
          message: "Workflow is updating! Refresh in a few minutes"
        });
      }, 15000); // 15 seconds
    });
    
    // The actual fetch request
    const fetchPromise = fetch(webhookUrl, {
      method: 'GET',
    }).then(async response => {
      // Check if the response is OK
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Webhook not found at ${webhookUrl}. Please ensure the n8n workflow is active and the webhook URL is correct.`);
        }
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
      // Try to parse as JSON, fallback to text if it fails
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // If not JSON, return a success object with the text response
        const text = await response.text();
        return {
          success: true,
          message: text || 'Webhook executed successfully',
          rawResponse: text
        };
      }
    }).catch(error => {
      // If it's a connection error, provide a more helpful message
      if (error.message.includes('ECONNREFUSED')) {
        throw new Error('Cannot connect to n8n service. Please ensure n8n is running on port 5678.');
      }
      throw error;
    });
    
    // Race the fetch against the timeout
    const data = await Promise.race([fetchPromise, timeoutPromise]);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying fetch-videos webhook request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to call webhook',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 
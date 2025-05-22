import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const webhookUrl =
      process.env.WEBHOOK_URL || "http://localhost:5678/webhook/fetch_videos";

    // Parse request body to get the time period
    let requestBody = { timePeriod: 3 }; // Default to 3 months
    try {
      const body = await request.json();
      if (body && typeof body.timePeriod === "number") {
        requestBody.timePeriod = body.timePeriod;
      }
    } catch (e) {
      // If parsing fails, use default values
      console.log("Could not parse request body, using default time period");
    }

    // Create a timeout promise that resolves after 15 seconds
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          timedOut: true,
          success: true,
          message: "Workflow is updating! Refresh in a few minutes",
          timePeriod: requestBody.timePeriod,
        });
      }, 15000); // 15 seconds
    });

    // The actual fetch request
    const fetchPromise = fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then((response) => response.json());

    // Race the fetch against the timeout
    const data = await Promise.race([fetchPromise, timeoutPromise]);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying fetch-videos webhook request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to call webhook",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

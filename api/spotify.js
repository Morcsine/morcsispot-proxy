export default async function handler(req, res) {
  try {
    const backendUrl = "https://morcsispot.xo.je/spotify_current.php";

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json,text/html,*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://google.com",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Connection": "keep-alive"
      }
    });

    let text = await response.text();

    // Remove BOM if present
    text = text.replace(/^\uFEFF/, "");

    // If InfinityFree returned HTML, forward it so we can inspect it
    if (text.trim().startsWith("<")) {
      return res.status(500).json({
        error: "html_response",
        message: "InfinityFree returned HTML instead of JSON",
        html_snippet: text.substring(0, 200)
      });
    }

    const data = JSON.parse(text);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: "proxy_error",
      message: err.message
    });
  }
}

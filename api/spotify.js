export default async function handler(req, res) {
  try {
    const backendUrl = "https://morcsispot.xo.je/spotify_current.php";

    const response = await fetch(backendUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    let text = await response.text();

    // Remove BOM if present
    text = text.replace(/^\uFEFF/, "");

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

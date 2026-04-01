export default async function handler(req, res) {
  try {
    // 1. Get access token from our token endpoint
    const tokenResponse = await fetch(`${process.env.VERCEL_URL}/api/token`);
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(500).json({ error: "Failed to get access token" });
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch currently playing track
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (response.status === 204) {
      return res.status(200).json({ is_playing: false });
    }

    const data = await response.json();

    const track = data.item;

    res.status(200).json({
      is_playing: data.is_playing,
      progress_ms: data.progress_ms,
      duration_ms: track.duration_ms,
      track: {
        name: track.name,
        artists: track.artists.map(a => a.name),
        album: track.album.name,
        image: track.album.images[0].url,
        url: track.external_urls.spotify
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

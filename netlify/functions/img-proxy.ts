export default async (request: Request) => {
  const origin = request.headers.get("origin") || "";
  const referer = request.headers.get("referer") || "";
  const allowed = process.env.URL;

  if (allowed && !origin.startsWith(allowed) && !referer.startsWith(allowed)) {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  const imageUrl = url.searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing URL", { status: 400 });
  }

  let targetUrl: URL;

  try {
    targetUrl = new URL(imageUrl);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  if (!/^s\d+\.anilist\.co$/.test(targetUrl.hostname)) {
    return new Response("Forbidden", { status: 403 });
  }

  const res = await fetch(targetUrl.toString());

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
    },
  });
};

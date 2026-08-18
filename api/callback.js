function renderAuthResult(status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bersulang CMS Auth</title>
</head>
<body style="font-family:system-ui;background:#0b0b0a;color:#f5f0e8;padding:32px">
  <p>Completing GitHub login...</p>
  <script>
    (function () {
      var message = ${JSON.stringify(message)};
      var sent = false;
      function sendToken(event) {
        if (!window.opener || sent) return;
        sent = true;
        var targetOrigin = event && event.origin ? event.origin : '*';
        window.opener.postMessage(message, targetOrigin);
        window.removeEventListener('message', sendToken, false);
        setTimeout(function () { window.close(); }, 500);
      }
      window.addEventListener('message', sendToken, false);
      if (window.opener) {
        window.opener.postMessage('authorizing:github', '*');
      }
      setTimeout(function () {
        if (!sent) sendToken({ origin: '*' });
      }, 5000);
    })();
  </script>
</body>
</html>`;
}

function fail(res, message, statusCode = 400) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(renderAuthResult('error', { message }));
}

async function isAllowedUser(token) {
  const allowList = (process.env.CMS_ALLOWED_LOGINS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowList.length === 0) return true;

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'bersulang-cms-oauth'
    }
  });

  if (!response.ok) return false;
  const user = await response.json();
  return allowList.includes(String(user.login || '').toLowerCase());
}

module.exports = async function handler(req, res) {
  const code = req.query.code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code) return fail(res, 'Missing GitHub OAuth code.');
  if (!clientId || !clientSecret) return fail(res, 'Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET env vars in Vercel.', 500);

  const canonicalOrigin = 'https://www.bersulang.id';
  const redirectUri = process.env.GITHUB_REDIRECT_URI || `${canonicalOrigin}/api/callback`;

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'bersulang-cms-oauth'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
    return fail(res, tokenData.error_description || tokenData.error || 'Failed to retrieve GitHub access token.', 500);
  }

  const allowed = await isAllowedUser(tokenData.access_token);
  if (!allowed) return fail(res, 'This GitHub user is not allowed to manage Bersulang CMS.', 403);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(renderAuthResult('success', {
    token: tokenData.access_token,
    provider: 'github'
  }));
};

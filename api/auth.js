function html(message, statusCode = 200) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Bersulang CMS Auth</title></head><body style="font-family:system-ui;background:#0b0b0a;color:#f5f0e8;padding:32px"><h1>Bersulang CMS Auth</h1><p>${message}</p></body></html>`;
}

module.exports = function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html('Missing GITHUB_CLIENT_ID env var in Vercel.'));
    return;
  }

  const canonicalOrigin = 'https://www.bersulang.id';
  const redirectUri = `${canonicalOrigin}/api/callback`;
  const scope = req.query.scope || 'repo user';
  const state = req.query.state || Math.random().toString(36).slice(2);

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);

  res.writeHead(302, { Location: authUrl.toString() });
  res.end();
};

const POPULAR_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'ymail.com', 'rocketmail.com',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'proton.me', 'protonmail.com', 'zoho.com', 'gmx.com', 'gmx.de', 'mail.com', 'yandex.com',
  'yandex.ru', 'mail.ru', 'qq.com', '163.com', 'web.de', 'comcast.net', 'verizon.net', 'att.net',
];

const KNOWN_TLDS = [
  'com', 'net', 'org', 'edu', 'gov', 'mil', 'info', 'biz', 'io', 'co', 'me', 'ai', 'dev', 'app', 'tech',
  'online', 'site', 'xyz', 'pk', 'in', 'uk', 'us', 'ca', 'au', 'de', 'fr', 'it', 'es', 'nl', 'ae', 'sa',
  'tr', 'cn', 'jp', 'ru', 'br', 'za', 'ng', 'bd', 'my', 'sg',
  'com.pk', 'edu.pk', 'gov.pk', 'org.pk', 'net.pk', 'co.uk', 'ac.uk', 'org.uk', 'co.in', 'ac.in',
  'com.au', 'edu.au', 'co.za', 'com.sa', 'com.tr', 'com.br', 'com.my', 'com.sg', 'co.jp',
];

const distance = (a, b) => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d = Array.from({ length: rows }, (_, i) => [i, ...Array(cols - 1).fill(0)]);
  for (let j = 1; j < cols; j += 1) d[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
};

const closest = (value, list, maxDistance) => {
  let best = null;
  let bestScore = Infinity;
  list.forEach((candidate) => {
    const score = distance(value, candidate);
    if (score < bestScore) { best = candidate; bestScore = score; }
  });
  return bestScore > 0 && bestScore <= maxDistance ? best : null;
};

const fixTld = (domain) => {
  const dot = domain.indexOf('.');
  if (dot <= 0) return domain;
  const name = domain.slice(0, dot);
  const tld = domain.slice(dot + 1);
  if (KNOWN_TLDS.includes(tld)) return domain;
  const prefix = KNOWN_TLDS.filter((t) => tld.startsWith(t)).sort((a, b) => b.length - a.length)[0];
  if (prefix) return `${name}.${prefix}`;
  const near = closest(tld, KNOWN_TLDS, 1);
  return near ? `${name}.${near}` : domain;
};

export const suggestEmail = (email) => {
  const value = String(email || '').trim().toLowerCase();
  const at = value.lastIndexOf('@');
  if (at <= 0 || at === value.length - 1) return null;
  const local = String(email).trim().slice(0, at);
  const domain = value.slice(at + 1);
  if (!domain.includes('.') || POPULAR_DOMAINS.includes(domain)) return null;

  const tldFixed = fixTld(domain);
  if (POPULAR_DOMAINS.includes(tldFixed)) return `${local}@${tldFixed}`;

  const popular = closest(tldFixed, POPULAR_DOMAINS, tldFixed.length < 8 ? 1 : 2);
  const suggestion = popular || (tldFixed !== domain ? tldFixed : null);
  return suggestion ? `${local}@${suggestion}` : null;
};

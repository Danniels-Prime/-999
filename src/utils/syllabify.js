const VOWELS = 'aeiouáéíóúüAEIOUÁÉÍÓÚÜ';
const STRONG = new Set([...'aeoáéóíúAEOÁÉÓÍÚ']);
const WEAK = new Set([...'iuüIUÜ']);
const CLUSTERS = new Set(['bl','br','cl','cr','dr','fl','fr','gl','gr','pl','pr','tr','ch','ll','rr']);

const isV = c => c && VOWELS.includes(c);
const isS = c => c && STRONG.has(c);
const isW = c => c && WEAK.has(c);

export function syllabify(word) {
  if (!word) return [word];
  const m = word.match(/^([¡¿«"'(]*)([A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)([.,!?;:)"'»]*)$/);
  if (!m) return [word];
  const [, pre, core, post] = m;
  if (!core) return [word];

  const low = core.toLowerCase();
  const n = low.length;
  const splits = [];
  let i = 0;

  while (i < n) {
    if (!isV(low[i])) { i++; continue; }

    let vEnd = i;
    if (vEnd + 1 < n && isV(low[vEnd + 1])) {
      const a = low[vEnd], b = low[vEnd + 1];
      if ((isS(a) && isW(b)) || (isW(a) && isS(b)) || (isW(a) && isW(b))) {
        vEnd++;
        if (vEnd + 1 < n && isW(low[vEnd + 1]) && isW(a)) vEnd++;
      }
    }

    let nv = vEnd + 1;
    while (nv < n && !isV(low[nv])) nv++;
    if (nv >= n) break;

    const cons = nv - (vEnd + 1);
    let splitAt;
    if (cons === 0) {
      splitAt = nv;
    } else if (cons === 1) {
      splitAt = nv - 1;
    } else {
      const pair = low[nv - 2] + low[nv - 1];
      splitAt = CLUSTERS.has(pair) ? nv - 2 : nv - 1;
    }

    splits.push(splitAt);
    i = vEnd + 1;
  }

  if (splits.length === 0) return [word];

  const bounds = [0, ...splits, n];
  const syls = bounds.slice(0, -1).map((s, idx) => core.slice(s, bounds[idx + 1])).filter(Boolean);
  if (!syls.length) return [word];

  if (pre) syls[0] = pre + syls[0];
  if (post) syls[syls.length - 1] += post;
  return syls;
}

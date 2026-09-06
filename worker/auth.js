async function chave(secret) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
export async function assinar(msg, secret) {
  const sig = await crypto.subtle.sign("HMAC", await chave(secret), new TextEncoder().encode(msg));
  const hex = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
  return `${msg}.${hex}`;
}
export async function verificar(token, secret) {
  const i = token.indexOf(".");
  if (i < 0) return false;
  const msg = token.slice(0, i);
  if (msg !== "ok") return false;
  const hex = token.slice(i + 1);
  if (!/^[0-9a-f]{64}$/.test(hex)) return false;
  const sig = new Uint8Array(hex.match(/../g).map(h => parseInt(h, 16)));
  // crypto.subtle.verify é timing-safe; comparação de string não é
  return crypto.subtle.verify("HMAC", await chave(secret), sig, new TextEncoder().encode(msg));
}

import { assinar, verificar } from "./auth.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // /static/* nunca chega aqui: excluído no run_worker_first do wrangler.jsonc (Task 1)

    if (url.pathname === "/entrar" && request.method === "POST") {
      let senha = "";
      try {
        const form = await request.formData();
        senha = form.get("senha") ?? "";
      } catch {
        // POST sem body/Content-Type de formulário: trata como senha errada, nunca 500
      }
      if (senha === env.SITE_PASSWORD) {
        const token = await assinar("ok", env.AUTH_SECRET);
        return new Response(null, { status: 303, headers: {
          "Location": "/",
          "Set-Cookie": `kit_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
        }});
      }
      return Response.redirect(new URL("/senha.html?erro=1", url).toString(), 303);
    }

    const cookie = request.headers.get("Cookie") ?? "";
    const m = cookie.match(/(?:^|;\s*)kit_auth=([^;]+)/);
    const liberado = m && await verificar(m[1], env.AUTH_SECRET);
    if (!liberado && url.pathname !== "/senha.html") {
      // Request nova em GET: um POST a caminho protegido também recebe a tela de senha
      return env.ASSETS.fetch(new Request(new URL("/senha.html", url), { method: "GET" }));
    }
    return env.ASSETS.fetch(request);
  },
};

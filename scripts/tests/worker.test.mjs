import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../../worker/index.js";

const env = {
  AUTH_SECRET: "segredo-teste",
  SITE_PASSWORD: "senha-teste",
  ASSETS: { fetch: async () => new Response("asset", { status: 200 }) },
};

test("links antigos da editora-canva redirecionam para a editora-visual (R3.12)", async () => {
  const casos = {
    "/skills/editora-canva": "/skills/editora-visual",
    "/skills/editora-canva.html": "/skills/editora-visual.html",
    "/downloads/editora-canva.skill": "/downloads/editora-visual.skill",
  };
  for (const [antigo, novo] of Object.entries(casos)) {
    const res = await worker.fetch(new Request(`https://skills.iacomoaliada.com${antigo}`), env);
    assert.equal(res.status, 301, antigo);
    assert.equal(new URL(res.headers.get("Location")).pathname, novo, antigo);
  }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { assinar, verificar } from "../../worker/auth.js";

test("token assinado verifica", async () => {
  const t = await assinar("ok", "segredo-teste");
  assert.equal(await verificar(t, "segredo-teste"), true);
});
test("token adulterado ou de outro segredo falha", async () => {
  const t = await assinar("ok", "segredo-teste");
  assert.equal(await verificar(t + "a", "segredo-teste"), false);
  assert.equal(await verificar(t, "outro-segredo"), false);
  assert.equal(await verificar("ok.deadbeef", "segredo-teste"), false);
  assert.equal(await verificar("sem-ponto", "segredo-teste"), false);
});

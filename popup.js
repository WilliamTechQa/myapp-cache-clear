// ✅ função segura (não quebra se não existir)
function getStatus() {
  return document.getElementById("status");
}

function setStatus(text) {
  const el = getStatus();
  if (el) el.innerText = text;
}

async function getAmbienteAtual() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const url = new URL(tab.url);

  return url.hostname.split(".")[0];
}

// ✅ CORRIGIDO (URL limpa)
async function getUrl() {
  const ambiente = await getAmbienteAtual();
  return `https://${ambiente}.arker.com.br/admin/application.aspx`;
}

/**
 * 🧹 Servidor (mesma aba)
 */
async function limparCacheServidor() {
  const url = await getUrl();

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  setStatus("🧹 Limpando servidor...");

  await chrome.tabs.update(tab.id, { url });

  setStatus("✅ Cache do servidor executado");
}

/**
 * 🔄 Reload (já estava correto)
 */
async function reloadSemCache() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  setStatus("🔄 Recarregando sem cache...");

  chrome.tabs.reload(tab.id, { bypassCache: true });

  setStatus("✅ Reload executado");
}

/**
 * 🚀 Bypass (mesma aba)
 */
async function abrirSemCache() {
  const url = await getUrl();

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  setStatus("🚀 Abrindo sem cache...");

  await chrome.tabs.update(tab.id, {
    url: `${url}?nocache=${Date.now()}`
  });

  setStatus("✅ Bypass executado");
}

/**
 * 🧨 Completa (tudo na mesma aba)
 */
async function limpezaCompleta() {
  const url = await getUrl();

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  setStatus("🧨 Executando limpeza completa...");

  // 1. limpa servidor
  await chrome.tabs.update(tab.id, { url });

  setTimeout(async () => {

    // 2. bypass
    await chrome.tabs.update(tab.id, {
      url: `${url}?nocache=${Date.now()}`
    });

    // 3. reload final
    chrome.tabs.reload(tab.id, { bypassCache: true });

    setStatus("✅ Limpeza completa finalizada");

  }, 1500);
}

/**
 * ✅ LIGA OS BOTÕES (OBRIGATÓRIO)
 */
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("btn-server")
    ?.addEventListener("click", limparCacheServidor);

  document.getElementById("btn-reload")
    ?.addEventListener("click", reloadSemCache);

  document.getElementById("btn-bypass")
    ?.addEventListener("click", abrirSemCache);

  document.getElementById("btn-full")
    ?.addEventListener("click", limpezaCompleta);

});

// ✅ função segura (não quebra se não existir)
function getStatus() {
  return document.getElementById("status");
}

function setStatus(text) {
  const el = getStatus();
  if (el) el.innerText = text;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  return tab;
}

async function getAmbienteAtual() {
  const tab = await getActiveTab();
  const url = new URL(tab.url);
  return url.hostname.split(".")[0];
}

async function getAdminUrl() {
  const ambiente = await getAmbienteAtual();
  return `https://${ambiente}.arker.com.br/admin/application.aspx`;
}

function urlComNocache(url) {
  const parsed = new URL(url);
  parsed.searchParams.set("nocache", Date.now());
  return parsed.toString();
}

function waitForTabLoad(tabId, timeoutMs = 5000) {
  return new Promise((resolve) => {
    let settled = false;

    const done = () => {
      if (settled) return;
      settled = true;
      chrome.tabs.onUpdated.removeListener(onUpdated);
      clearTimeout(timer);
      resolve();
    };

    const onUpdated = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        done();
      }
    };

    chrome.tabs.onUpdated.addListener(onUpdated);
    const timer = setTimeout(done, timeoutMs);
  });
}

async function limparNoAdmin(tab) {
  const adminUrl = await getAdminUrl();
  await chrome.tabs.update(tab.id, { url: adminUrl });
  await waitForTabLoad(tab.id);
}

async function voltarParaOriginal(tab, originalUrl, comNocache = false) {
  const destino = comNocache ? urlComNocache(originalUrl) : originalUrl;
  await chrome.tabs.update(tab.id, { url: destino });
  await waitForTabLoad(tab.id);
}

/**
 * 🧹 Servidor (mesma aba)
 */
async function limparCacheServidor() {
  const tab = await getActiveTab();
  const originalUrl = tab.url;

  setStatus("🧹 Limpando servidor...");
  await limparNoAdmin(tab);

  setStatus("↩️ Voltando para página original...");
  await voltarParaOriginal(tab, originalUrl);

  setStatus("✅ Cache do servidor executado");
}

/**
 * 🔄 Reload (já estava correto)
 */
async function reloadSemCache() {
  const tab = await getActiveTab();
  const originalUrl = tab.url;

  setStatus("🧹 Limpando servidor...");
  await limparNoAdmin(tab);

  setStatus("↩️ Voltando para página original...");
  await voltarParaOriginal(tab, originalUrl);

  setStatus("🔄 Recarregando sem cache...");
  chrome.tabs.reload(tab.id, { bypassCache: true });

  setStatus("✅ Reload executado");
}

/**
 * 🚀 Bypass (mesma aba)
 */
async function abrirSemCache() {
  const tab = await getActiveTab();
  const originalUrl = tab.url;

  setStatus("🧹 Limpando servidor...");
  await limparNoAdmin(tab);

  setStatus("↩️ Voltando para página original...");
  await voltarParaOriginal(tab, originalUrl, true);

  setStatus("✅ Bypass executado");
}

/**
 * 🧨 Completa (tudo na mesma aba)
 */
async function limpezaCompleta() {
  const tab = await getActiveTab();
  const originalUrl = tab.url;

  setStatus("🧨 Executando Limpeza Completa...");

  await limparNoAdmin(tab);

  setStatus("↩️ Voltando para página original...");
  await voltarParaOriginal(tab, originalUrl, true);

  setStatus("🔄 Recarregando sem cache...");
  chrome.tabs.reload(tab.id, { bypassCache: true });

  setStatus("✅ Limpeza Completa finalizada");
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

// shortener.js — versiune finală (copiere automată în clipboard)
const params = new URLSearchParams(window.location.search);
const service = params.get("service");

const input = document.getElementById("userLink");
const typeSelect = document.getElementById("linkType");
const resultDiv = document.getElementById("result");
const btn = document.getElementById("generateBtn");

async function shortenWith(serviceName, url) {
  if (serviceName === "isgd") {
    const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
    return await res.text();
  } else if (serviceName === "vgd") {
    const res = await fetch(`https://v.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
    return await res.text();
  } else if (serviceName === "tinyurl") {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    return await res.text();
  } else if (serviceName === "dagd") {
    const res = await fetch(`https://da.gd/s?url=${encodeURIComponent(url)}`);
    return await res.text();
  } else if (serviceName === "shrtco") {
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return data && data.ok ? data.result.full_short_link : "";
  } else if (serviceName === "clckru") {
    const res = await fetch(`https://clck.ru/--?url=${encodeURIComponent(url)}`);
    return await res.text();
  } else {
    throw new Error("Unknown shortener service");
  }
}

btn.addEventListener("click", async () => {
  const link = input.value.trim();
  const type = typeSelect.value; // in caz ca vrei sa folosesti tipul in prezenta ulterioara
  if (!link) return alert("Please paste a link!");

  resultDiv.innerHTML = "Shortening…";

  try {
    // scurteaza folosind serviciul selectat din URL (service)
    const shortLink = await shortenWith(service, link);

    if (!shortLink) throw new Error("Shortening failed or returned empty");

    // textul vizibil în paranteza pătrată — folosim linkul introdus, dar înlocuim ":" cu "_:_" (cererea ta)
    const visible = link.replace(/:/g, "_:_");

    // Markdown final — text vizibil = original (formatat), link efectiv = link prescurtat
    const finalMarkdown = `[${visible}](${shortLink})`;

    // Afișare frumoasă + buton copy
    resultDiv.innerHTML = `
      <div style="word-break:break-word; text-align:left; color:#fff;">
        <div style="margin-bottom:8px;"><b>Markdown for Discord:</b></div>
        <textarea id="mdArea" style="width:100%;height:72px;border-radius:8px;padding:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.2);color:#fff;">${finalMarkdown}</textarea>
        <div style="margin-top:8px; display:flex; gap:8px; justify-content:center;">
          <button id="copyBtn" style="padding:8px 12px;border-radius:8px;border:2px solid #fff;background:rgba(255,255,255,0.05);color:#fff;cursor:pointer;">Copy markdown</button>
          <a id="openShort" href="${shortLink}" target="_blank" style="padding:8px 12px;border-radius:8px;border:2px solid #fff;background:rgba(255,255,255,0.05);color:#fff;text-decoration:none;display:inline-flex;align-items:center;">Open short link</a>
        </div>
      </div>
    `;

    // copie automata in clipboard
    try {
      await navigator.clipboard.writeText(finalMarkdown);
      // dacă vrei, arată un mic feedback (înlocuiește textarea text temporar)
      const copyBtn = document.getElementById("copyBtn");
      copyBtn.innerText = "Copied!";
      setTimeout(() => { if (copyBtn) copyBtn.innerText = "Copy markdown"; }, 1400);
    } catch (err) {
      // fallback — user poate apăsa Copy manual
      console.warn("Clipboard write failed:", err);
    }

    // eveniment pentru buton copy (manual)
    document.getElementById("copyBtn").addEventListener("click", async () => {
      const md = document.getElementById("mdArea").value;
      try {
        await navigator.clipboard.writeText(md);
        const b = document.getElementById("copyBtn");
        b.innerText = "Copied!";
        setTimeout(() => { b.innerText = "Copy markdown"; }, 1400);
      } catch (e) {
        alert("Copy failed — try selecting the text and copying manually.");
      }
    });

  } catch (err) {
    console.error(err);
    resultDiv.innerText = "Error shortening link. Try another shortener or check the URL.";
    alert("Error shortening link. Try another shortener or check the URL.");
  }
});

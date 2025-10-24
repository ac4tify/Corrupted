const params = new URLSearchParams(window.location.search);
const service = params.get("service");

const serviceName = document.getElementById("serviceName");
const input = document.getElementById("userLink");
const typeSelect = document.getElementById("linkType");
const resultDiv = document.getElementById("result");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const viewBtn = document.getElementById("viewBtn");

// Setăm titlul serviciului
serviceName.innerHTML = service.toUpperCase() + " selected";

generateBtn.addEventListener("click", async () => {
  const link = input.value.trim();
  const type = typeSelect.value;
  if (!link) return alert("Please paste a link!");

  let shortLink = "";

  try {
    if(service === "isgd") {
      const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(service === "vgd") {
      const res = await fetch(`https://v.gd/create.php?format=simple&url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(service === "tinyurl") {
      const res = await fetch(`https://clck.ru/--?url=${encodeURIComponent(link)}`); // click.ru recomandat
      shortLink = await res.text();
    } else if(service === "dagd") {
      const res = await fetch(`https://da.gd/s?url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(service === "shrtco") {
      const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(link)}`);
      const data = await res.json();
      shortLink = data.ok ? data.result.full_short_link : "";
    } else if(service === "clckru") {
      const res = await fetch(`https://clck.ru/--?url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else {
      alert("Unknown shortener service");
      return;
    }

    if(!shortLink) throw new Error("Shortening failed");

    // Creează linkul final în funcție de tip
    let finalLink = "";
    if(type === "profile") {
      finalLink = `[https*:*//www.roblox.com/users/3095250/profile](${shortLink})`;
    } else if(type === "group") {
      finalLink = `[www.roblox.com/groups/2194003353](${shortLink})`;
    } else if(type === "private") {
      finalLink = `[https_:_//www.roblox.com/share?code=80177c63cdc8614aa84be3cbd84b051a&type=Server](${shortLink})`;
    }

    resultDiv.innerText = finalLink;
    copyBtn.disabled = false;
    viewBtn.href = shortLink;

  } catch(err) {
    console.error(err);
    alert("Error shortening link. Try another shortener!");
  }
});

// Copy link (Markdown complet)
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(resultDiv.innerText

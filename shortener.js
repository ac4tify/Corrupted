const params = new URLSearchParams(window.location.search);
const service = params.get("service"); // ex: isgd, clckru, tinyurl

const input = document.getElementById("userLink");
const typeSelect = document.getElementById("linkType");
const resultDiv = document.getElementById("result");
const btn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

btn.addEventListener("click", async () => {
  const link = input.value.trim();
  const type = typeSelect.value;
  if(!link) return alert("Please paste a link!");

  let shortLink = "";

  try {
    switch(service){
      case "isgd":
        shortLink = await (await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(link)}`)).text();
        break;
      case "vgd":
        shortLink = await (await fetch(`https://v.gd/create.php?format=simple&url=${encodeURIComponent(link)}`)).text();
        break;
      case "tinyurl":
        shortLink = await (await fetch(`https://clck.ru/--?url=${encodeURIComponent(link)}`)).text(); // recomandat
        break;
      case "dagd":
        shortLink = await (await fetch(`https://da.gd/s?url=${encodeURIComponent(link)}`)).text();
        break;
      case "shrtco":
        const data = await (await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(link)}`)).json();
        shortLink = data.ok ? data.result.full_short_link : "";
        break;
      case "clckru":
        shortLink = await (await fetch(`https://clck.ru/--?url=${encodeURIComponent(link)}`)).text();
        break;
      default:
        alert("Unknown shortener service");
        return;
    }

    if(!shortLink) throw new Error("Shortening failed");

    let finalLink = "";
    if(type === "profile") {
      finalLink = `[https*:*//www.roblox.com/users/3095250/profile](${shortLink})`;
    } else if(type === "group") {
      finalLink = `[www.roblox.com/groups/2194003353](${shortLink})`;
    } else if(type === "private") {
      finalLink = `[https_:_//www.roblox.com/share?code=80177c63cdc8614aa84be3cbd84b051a&type=Server](${shortLink})`;
    }

    resultDiv.innerHTML = `<code>${finalLink}</code>`;
    copyBtn.style.display = "inline-block";

  } catch(err){
    console.error(err);
    alert("Error shortening link. Try another shortener!");
  }
});

copyBtn.addEventListener("click", () => {
  const code = resultDiv.textContent;
  navigator.clipboard.writeText(code);
  alert("Copied to clipboard!");
});

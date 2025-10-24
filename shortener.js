function showContainer(id){
  const containers = document.querySelectorAll('.container');
  containers.forEach(c => c.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// Shortening logic
document.querySelectorAll('.generateBtn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const container = e.target.closest('.container');
    const link = container.querySelector('.userLink').value.trim();
    const type = container.querySelector('.linkType').value;
    const resultDiv = container.querySelector('.result');
    if(!link) return alert("Please paste a link!");

    let shortLink = "";

    try {
      // Determină shortener după container id
      const id = container.id;

      if(id === "clickru") {
        const res = await fetch(`https://clck.ru/--?url=${encodeURIComponent(link)}`);
        shortLink = await res.text();
      } else if(id === "isgd") {
        const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(link)}`);
        shortLink = await res.text();
      } else if(id === "tinyurl") {
        const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`);
        shortLink = await res.text();
      }

      if(!shortLink) throw new Error("Shortening failed");

      // Creează linkul final după tip
      let finalLink = "";
      if(type === "profile") {
        finalLink = `[https*:*//www.roblox.com/users/3095250/profile](${shortLink})`;
      } else if(type === "group") {
        finalLink = `[www.roblox.com/groups/2194003353](${shortLink})`;
      } else if(type === "private") {
        finalLink = `[https_:_//www.roblox.com/share?code=80177c63cdc8614aa84be3cbd84b051a&type=Server](${shortLink})`;
      }

      resultDiv.innerText = finalLink;

    } catch(err) {
      console.error(err);
      alert("Error shortening link. Try another shortener!");
    }
  });
});

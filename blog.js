const username = "sommishra01";
const repo = "SB-Financial";

async function loadBlogs() {
  const container = document.getElementById("blog-list");

  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repo}/contents/posts`
    );

    const data = await res.json();

    container.innerHTML = "";

    for (const file of data) {
      if (file.name.endsWith(".md")) {
        const slug = file.name.replace(".md", "");

        const mdRes = await fetch(file.download_url);
        const mdText = await mdRes.text();

        const match = mdText.match(/^#\s(.+)/);
        const title = match ? match[1] : slug.replace(/-/g, " ");

        container.innerHTML += `
          <div class="blog-card">
            <h2>
              <a href="post.html?slug=${slug}">
                ${title}
              </a>
            </h2>
          </div>
        `;
      }
    }

  } catch (err) {
    console.error(err);
    container.innerHTML = "Error loading blogs";
  }
}

loadBlogs();

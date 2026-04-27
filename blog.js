const username = "sommishra01";
const repo = "SB-Financial";

function parseFrontmatter(mdText) {
  const frontmatter = {};
  const match = mdText.match(/^---\n([\s\S]*?)\n---/);

  if (match) {
    const lines = match[1].split("\n");

    lines.forEach(line => {
      const [key, ...rest] = line.split(":");
      if (key && rest.length) {
        frontmatter[key.trim()] = rest.join(":").trim();
      }
    });
  }

  return frontmatter;
}

async function loadBlogs() {
  const container = document.getElementById("blog-list");
  if (!container) return;

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

        const meta = parseFrontmatter(mdText);

        const title = meta.title || slug.replace(/-/g, " ");
        const desc = meta.description || "Click to read more...";
        const image = meta.image || "";

        container.innerHTML += `
          <div class="feature-card" data-aos="fade-up">
            ${image ? `<img src="${image}" style="width:100%; border-radius:12px; margin-bottom:1rem;">` : ""}
            
            <h3>
              <a href="/blog/${slug}">
                ${title}
              </a>
            </h3>

            <p>${desc}</p>
          </div>
        `;
      }
    }

  } catch (error) {
    console.error(error);
    container.innerHTML = "Failed to load blogs.";
  }
}

document.addEventListener("DOMContentLoaded", loadBlogs);

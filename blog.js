async function loadBlogs() {
  const blogContainer = document.getElementById("blog-list");

  try {
    const res = await fetch("posts/posts.json");
    const posts = await res.json();

    if (!posts.length) {
      blogContainer.innerHTML = "<p>No blog posts available yet.</p>";
      return;
    }

    blogContainer.innerHTML = posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((post, index) => `
        <div class="feature-card" data-aos="${index % 3 === 0 ? 'fade-right' : index % 3 === 1 ? 'fade-up' : 'fade-left'}">
          <img src="${post.image}" alt="${post.title}" style="width:100%; height:220px; object-fit:cover; border-radius:16px; margin-bottom:1rem;">
          <span style="display:inline-block; background:#e6f4f1; color:#305f72; padding:0.35rem 0.9rem; border-radius:30px; font-size:0.85rem; font-weight:600; margin-bottom:0.8rem;">
            ${post.category}
          </span>
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <a href="post.html?slug=${post.slug}" class="btn" style="margin-top: 1rem;">Read More</a>
        </div>
      `)
      .join("");

  } catch (error) {
    blogContainer.innerHTML = "<p>Failed to load blogs.</p>";
    console.error("Error loading blogs:", error);
  }
}

loadBlogs();

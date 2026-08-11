const defaultPosts = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    content:
      "Artificial Intelligence enables computers to perform tasks that normally require human intelligence.",
    author: "admin",
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    content:
      "Machine Learning allows computers to learn patterns from data and make predictions.",
    author: "admin",
  },
];

export function getPosts() {
  const storedPosts = localStorage.getItem("posts");

  if (!storedPosts) {
    localStorage.setItem("posts", JSON.stringify(defaultPosts));
    return defaultPosts;
  }

  return JSON.parse(storedPosts);
}

export function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}
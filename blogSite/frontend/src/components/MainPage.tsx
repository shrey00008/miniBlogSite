import { useState, useEffect } from "react";
import { FaBlog } from "react-icons/fa";
import { IoClose, IoPersonOutline } from "react-icons/io5";

interface BlogProps {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
}

interface BlogApi {
  blogId: number;
  Title: string;
  Discription: string;
  Author: string;
  timestamp: string;
}

const MainPage = () => {
  const [hovering, setHovering] = useState<number | null>(null);
  const [modal, setModal] = useState<boolean>(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const [blogs, setBlogs] = useState<BlogProps[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogProps | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/blog/")
      .then((res) => res.json())
      .then((data: BlogApi[]) =>
        setBlogs(
          data.map((b) => ({
            id: b.blogId,
            title: b.Title,
            content: b.Discription,
            author: b.Author,
            date: new Date(b.timestamp),
          }))
        )
      )
      .catch((err) => console.error("Failed to fetch blogs:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !content) {
      alert("All fields are required!");
      return;
    }

    if (editingBlog) {
      await fetch(`http://localhost:8000/blog/${editingBlog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title: title,
          Author: author,
          Discription: content,
        }),
      });
    } else {
      await fetch("http://localhost:8000/blog/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title: title,
          Author: author,
          Discription: content,
        }),
      });
    }

    fetch("http://localhost:8000/blog/")
      .then((res) => res.json())
      .then((data) =>
        setBlogs(
          data.map((b: any) => ({
            id: b.blogId,
            title: b.Title,
            content: b.Discription,
            author: b.Author,
            date: new Date(b.timestamp),
          }))
        )
      );

    setTitle("");
    setAuthor("");
    setContent("");
    setModal(false);
    setEditingBlog(null);
  };

  const handleEdit = (blog: BlogProps) => {
    setTitle(blog.title);
    setAuthor(blog.author);
    setContent(blog.content);
    setEditingBlog(blog);
    setModal(true);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      await fetch(`http://localhost:8000/blogs/${id}`, { method: "DELETE" });
      fetch("http://localhost:8000/blog/")
        .then((res) => res.json())
        .then((data) =>
          setBlogs(
            data.map((b: any) => ({
              id: b.blogId,
              title: b.Title,
              content: b.Discription,
              author: b.Author,
              date: new Date(b.timestamp),
            }))
          )
        );
    }
  };

  const count = blogs.length;

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-red-200 to-blue-200">
      {/* Header */}
      <header className="flex flex-col justify-center items-center my-[50px]">
        <div className="flex justify-center items-center">
          <FaBlog className="p-4 w-16 h-16 rounded-lg text-white bg-gradient-to-r from-red-400 via-[#864ce4] to-blue-400 m-4" />
          <h1 className="bg-gradient-to-r from-red-400 via-[#864ce4] to-blue-400 bg-clip-text text-transparent text-[40px] font-bold">
            Mini Blog Site
          </h1>
        </div>
        <p className="text-[14px] text-gray-500 font-semibold">
          Share your thoughts with the world!
        </p>
        <hr className="h-[5px] w-[100px] bg-gradient-to-r from-red-400 via-[#864ce4] to-blue-400 border-0 rounded-full mt-3" />
      </header>

      {/* Main */}
      <section className="w-[90%] flex flex-col justify-start items-start p-4">
        <h1 className="text-gray-700 text-[24px] font-bold mb-2">
          All Posts
          <span className="bg-gradient-to-br from-red-400 via-[#864ce4] to-blue-400 text-white rounded-lg px-3 py-1 ml-2">
            {count}
          </span>
        </h1>

        {blogs.length === 0 ? (
          <div className="w-full flex justify-center items-center text-gray-500 text-lg h-[300px]">
            No blogs yet. Add your first one!
          </div>
        ) : (
          blogs.map((blog, index) => (
            <div
              key={blog.id}
              className="w-[90%] bg-white border border-gray-200 rounded-lg h-auto p-4 m-4 hover:scale-[1.02] transform transition duration-[100ms] ease-in"
              onMouseOver={() => setHovering(index)}
              onMouseOut={() => setHovering(null)}
            >
              <div className="flex justify-between items-center">
                <h1
                  className={`text-[24px] font-bold transition my-2 ${
                    hovering === index
                      ? "bg-gradient-to-r from-red-400 via-[#864ce4] to-blue-400 bg-clip-text text-transparent"
                      : ""
                  }`}
                >
                  {blog.title}
                </h1>
                <div className="flex justify-end items-center gap-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="bg-gradient-to-r from-[#864ce4] to-blue-400 text-white px-4 py-2 rounded-lg hover:scale-[1.03] transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="bg-gradient-to-r from-[#864ce4] to-blue-400 text-white px-4 py-2 rounded-lg hover:scale-[1.03] transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start my-2">
                <div className="flex items-center">
                  <IoPersonOutline className="h-6 w-6 p-1 bg-gradient-to-br from-[#863ce4] to-blue-400 text-white rounded-full" />
                  <span className="ml-4 font-semibold text-gray-500">
                    {blog.author}
                  </span>
                </div>
                <span className="ml-4 font-semibold text-gray-500">
                  {blog.date.toLocaleDateString()}
                </span>
              </div>

              <hr className="h-[2px] rounded-md bg-gradient-to-r from-red-200 via-[#864ce4] to-blue-200 border-0" />

              <p className="font-semibold text-[16px] text-gray-700 my-4 px-2">
                {blog.content}
              </p>
            </div>
          ))
        )}
      </section>

      {/* Add Blog Button */}
      <button
        className="fixed right-8 bottom-8 px-4 py-2 text-[18px] bg-gradient-to-br from-red-400 via-[#864ce4] to-blue-400 text-white rounded-lg hover:scale-105 transition"
        onClick={() => setModal(true)}
      >
        + Add Blog
      </button>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-lg relative">
            <div className="flex justify-start items-center bg-gradient-to-br from-[#864ce4] to-blue-400 rounded-t-lg space-x-6">
              <button
                onClick={() => {
                  setModal(false);
                  setEditingBlog(null);
                  setTitle("");
                  setAuthor("");
                  setContent("");
                }}
                className="ml-4 text-white rounded-lg hover:scale-[1.05] hover:bg-red-400 transform transition duration-[100ms] ease-in"
              >
                <IoClose size={24} />
              </button>
              <div className="flex flex-col py-4">
                <h1 className="text-[24px] text-white">
                  {editingBlog ? "Edit Blog Post" : "Create a new blog post!"}
                </h1>
                <p className="text-[16px] text-white">
                  Let your creativity shine through!
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex flex-col">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="border rounded-lg px-4 py-2 my-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="author">Author:</label>
                <input
                  type="text"
                  name="author"
                  placeholder="Your Name"
                  className="border rounded-lg px-4 py-2 my-2"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="content">Content:</label>
                <textarea
                  name="content"
                  placeholder="Content"
                  className="border rounded-lg px-4 py-2 my-2 h-20 resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-[#864ce4] to-blue-400 text-white px-4 py-2 rounded-lg hover:scale-[1.03] transition"
              >
                {editingBlog ? "Update Blog" : "Post Blog"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;

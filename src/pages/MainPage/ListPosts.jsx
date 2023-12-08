import { useContext, useState } from "react";
import { PostContext } from "../../context/PostContext";
import PostCard from "./PostCard";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

// export default ListPosts;
const ListPosts = () => {
  const { posts } = useContext(PostContext);
  const { activeUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ name: "", category: "", user: "" });
  console.log(filters, posts);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredPosts = posts.filter((post) => {
    const nameMatch = post.title
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const categoryMatch = post.category
      .toLowerCase()
      .includes(filters.category.toLowerCase());
    const userMatch = post.author.name
      .toLowerCase()
      .includes(filters.user.toLowerCase());

    return nameMatch && categoryMatch && userMatch;
  });

  return (
    <div className="flex flex-col my-5 gap-5">
      <div className="flex gap-1">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Blog Adı"
          className="rounded p-2 border  min-w-[130px] w-full text-black border-gray-600 placeholder-gray-400 outline-none"
        />

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="rounded p-2 border  min-w-[130px] w-full text-black border-gray-600 placeholder-gray-400 outline-none"
        >
          <option value="">Tüm Kategoriler</option>
          {posts.map((category) => (
            <option key={category.id} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="user"
          value={filters.user}
          onChange={handleFilterChange}
          placeholder="Kullanıcı Adı"
          className="rounded p-2 border  min-w-[130px] w-full text-black border-gray-600 placeholder-gray-400 outline-none"
        />
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No matching posts found.</p>
      )}
    </div>
  );
};

export default ListPosts;

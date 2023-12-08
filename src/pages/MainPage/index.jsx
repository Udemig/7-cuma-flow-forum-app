import { useContext, useState } from "react";
import Header from "../../components/Header";
import Form from "./Form";
import ListPosts from "./ListPosts";
import { PostContext } from "../../context/PostContext";

const MainPage = () => {
  const { getData } = useContext(PostContext);
  const [filters, setFilters] = useState({ name: "", category: "", user: "" });

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    getData(filters);
  };
  return (
    <>
      <Form onFilterChange={handleFilterChange} />
      <ListPosts />
    </>
  );
};

export default MainPage;

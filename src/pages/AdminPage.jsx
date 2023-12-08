import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { Line } from "react-chartjs-2";
import { Chart as Chartjs } from "chart.js/auto";

const AdminPage = () => {
  const { activeUser, deleteAccount } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postCounts, setPostCounts] = useState({ labels: [], data: [] });
  const [userCounts, setUserCounts] = useState({ labels: [], data: [] });

  useEffect(() => {
    axios
      .get("/users")
      .then((res) => {
        setUsers(res.data);
        calculateUserCounts(res.data);
      })
      .catch((err) => console.error("Kullanıcılar alınamadı", err));

    axios
      .get("/posts")
      .then((res) => {
        setPosts(res.data);
        calculatePostCounts(res.data);
      })
      .catch((err) => console.error("Gönderi sayıları alınamadı", err));
  }, []);

  const calculatePostCounts = (posts) => {
    const groupedByDate = posts.reduce((acc, post) => {
      const date = new Date(post.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(groupedByDate);
    const data = Object.values(groupedByDate);

    setPostCounts({ labels, data });
  };

  const calculateUserCounts = (users) => {
    const groupedByDate = users.reduce((acc, user) => {
      const date = new Date(user.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(groupedByDate);
    const data = Object.values(groupedByDate);
    setUserCounts({ labels, data });
  };

  const handleDeleteUser = (userId) => {
    if (activeUser && activeUser.type === "admin") {
      axios
        .delete(`/users/${userId}`)
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );
          calculateUserCounts(users);
        })
        .catch((err) => console.error("Kullanıcı silinemedi", err));
    } else {
      console.error("Yetkisiz silme girişimi!");
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white h-[2000px]">
      <h2 className="text-2xl font-semibold mb-4">Admin Sayfası</h2>

      <div className="mb-6 bg-gray-800">
        <h3 className="text-xl font-semibold mb-2">Gönderi Sayısı (Günlük)</h3>
        <Line
          data={{
            labels: postCounts.labels,
            datasets: [
              {
                label: "Gönderi Sayısı",
                data: postCounts.data,
                borderColor: "#38B2AC",
                backgroundColor: "rgba(56,178,172,0.1)",
              },
            ],
          }}
        />
      </div>

      <div className="mb-6 bg-gray-800">
        <h3 className="text-xl font-semibold mb-2">
          Yeni Kullanıcı Hesapları (Günlük)
        </h3>
        <Line
          data={{
            labels: userCounts.labels,
            datasets: [
              {
                label: "Kullanıcı Sayısı",
                data: userCounts.data,
                borderColor: "#38B2AC",
                backgroundColor: "rgba(56,178,172,0.1)",
              },
            ],
          }}
        />
      </div>

      <div className="bg-gray-700 w-full ">
        <h3 className="text-xl font-semibold p-2 ">Kullanıcı Listesi</h3>
        <table className="min-w-full bg-gray-800 border border-gray-300">
          <thead>
            <tr className="bg-gray-900">
              <th className="border py-2 px-4">ID</th>
              <th className="border py-2 px-4">Ad</th>
              <th className="border py-2 px-4">Email</th>
              <th className="border py-2 px-4">Tip</th>
              <th className="border py-2 px-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700">
                <td className="border py-2 px-4">{user.id}</td>
                <td className="border py-2 px-4">{user.name}</td>
                <td className="border py-2 px-4">{user.email}</td>
                <td className="border py-2 px-4">{user.type}</td>
                <td className="border py-2 px-4">
                  {activeUser && activeUser.type === "admin" && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:underline"
                    >
                      Sil
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;

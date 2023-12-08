import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { arraysEqual } from "../utils/helpers";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);

  // Bu fonksiyon, filtreleri kullanarak bir API'den veri çeker.
  const getData = (filters = {}) => {
    //Object.entries() JavaScript'te bir nesnenin özelliklerini içeren bir diziye dönüştürmek için kullanılan bir metodudur.
    //Bu metot, bir nesnenin her bir özelliğini [key, value] çiftleri şeklinde içeren bir dizi döndürür.
    const filterParams = Object.entries(filters)
      .filter(([key, value]) => value !== "") // Değeri boş olmayan filtreleri seçer.
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // URL uyumlu formata getirir.
      .join("&"); // URL sorgu parametrelerini birleştirir.

    axios.get(`posts?_sort=date&_order=desc&${filterParams}`).then((res) => {
      setPosts(res.data);
    });
  };

  useEffect(() => {
    // ilk bileşen ekrana basıldığında verileri getir
    getData();

    // 5 saniyede bir yeni postlar için istek atar
    const interval = setInterval(() => {
      getData();
    }, 15000);

    // bileşenin ekranadqan ayrılmasını izle
    // ayrılırsa sayacı durdur
    return () => {
      clearInterval(interval);
    };
  }, []);

  const addPost = (newPost) => {
    // state'i dooğrudan değiştiremiyeceğimiz için kopysaını oluşturduk
    const clone = [...posts];
    // dizinin başımna yeni postu ekledik
    clone.unshift(newPost);
    // state'i güncelle
    setPosts(clone);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, getData }}>
      {children}
    </PostContext.Provider>
  );
}

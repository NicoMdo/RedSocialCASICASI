import { useContext, useEffect, useState } from "react";
import { UserContext } from '../contexts/UserContext';
import BoxPost from "../components/BoxPost";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:3003/post?userId=${user._id}`);
    const data = await res.json();
    setPosts(data.posts);  // <-- acá accedemos al array posts
  };


  useEffect(() => {
    fetchPosts();
  }, []);

  const userPosts = posts.filter(p => p.user?._id === user._id);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bienvenido, {user?.nickName}</h2>
      <h4>Tus publicaciones:</h4>
      <BoxPost
        posts={userPosts}
        onDelete={(id) => setPosts(posts.filter(p => p._id !== id))}
      />
    </div>
  );
};

export default Profile;

import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import BoxPost from "../components/BoxPost";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef();

  const fetchPosts = async (pageNumber) => {
    setLoading(true);
    try {
      // Asumí que el backend soporta paginación con query params: ?page=&limit=
      const res = await fetch(`http://localhost:3003/post?page=${pageNumber}&limit=2`);
      const data = await res.json();

      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(pageNumber < data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="container mt-4">
      {/* 🖼️ Banner de bienvenida */}
      <div className="p-4 bg-primary text-white rounded text-center">
        <h1>¡Bienvenido a MarceNicos!</h1>
        <p>Explorá, compartí y descubrí publicaciones increíbles.</p>
      </div>

      {/* ℹ️ Sección "Sobre nosotros" */}
      <section className="mt-5">
        <h2>Sobre Nosotros</h2>
        <p>
          MarceNicos es una red social diseñada para que los usuarios puedan
          compartir ideas, imágenes, pensamientos y conectar con otros.
          Apuntamos a crear un espacio libre, creativo y sin algoritmos que
          condicionen lo que ves.
        </p>
      </section>

      {/* 💬 Slogans o frases destacadas */}
      <section className="mt-4">
        <h3>Slogans que nos representan</h3>
        <ul>
          <li>🌟 "Tu voz, tu espacio, tu comunidad."</li>
          <li>📢 "Compartí lo que pensás, sin filtros ni juicios."</li>
          <li>💡 "Un lugar para expresarte libremente."</li>
        </ul>
      </section>

      {/* 🤓 Datos curiosos */}
      <section className="mt-4">
        <h3>¿Sabías que...?</h3>
        <ul>
          <li>🧠 El primer post de la app fue una foto de un mate y una medialuna.</li>
          <li>👥 Más de 200 usuarios activos se registraron en la primera semana.</li>
          <li>🚀 La app fue desarrollada en solo 2 meses por dos estudiantes apasionados.</li>
        </ul>
      </section>

      {/* 📰 Feed de publicaciones */}
      <section className="mt-5">
        <h2>Feed de Publicaciones</h2>
        <p>Aquí se mostrará el contenido publicado por los usuarios.</p>
      </section>

      <div className="container mt-4">
        <h2 className="mb-4">POSTS</h2>
        <BoxPost posts={posts} onDelete={handleDeletePost} lastPostRef={lastPostElementRef} />

        {loading && <p>Cargando más posts...</p>}
        {!hasMore && <p>No hay más posts para cargar.</p>}

        {/* Botón para crear posteo, solo una vez aquí */}
        <div className="mt-3">
          <Link to="/new-post" className="btn btn-secondary">
            Crear posteo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

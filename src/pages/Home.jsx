import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import BoxPost from "../components/BoxPost";
import { SearchContext } from "../contexts/SearchContext";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef();
  const { searchTag } = useContext(SearchContext);

  const fetchPosts = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3003/post?page=${pageNumber}&limit=5`);
      const data = await res.json();

      setPosts((prev) => {
        const existingIds = new Set(prev.map(p => p._id));
        const newPosts = data.posts.filter(p => !existingIds.has(p._id));
        return [...prev, ...newPosts];
      });

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

  // 🔍 Filtrar los posts por nombre del tag
  const filteredPosts = posts.filter(post =>
    !searchTag || post.tags?.some(tag => tag?.name?.toLowerCase().startsWith(searchTag))
  );

  return (
    <div className="container mt-4">
      <div className="p-4 bg-primary text-white rounded text-center">
        <h1>¡Bienvenido a MarceNicos!</h1>
        <p>Explorá, compartí y descubrí publicaciones increíbles.</p>
      </div>

      <section className="mt-5">
        <h2>Sobre Nosotros</h2>
        <p>
          MarceNicos es una red social diseñada para que los usuarios puedan
          compartir ideas, imágenes, pensamientos y conectar con otros.
          Apuntamos a crear un espacio libre, creativo y sin algoritmos que
          condicionen lo que ves.
        </p>
      </section>

      <section className="mt-4">
        <h3>Slogans que nos representan</h3>
        <ul>
          <li>🌟 "Tu voz, tu espacio, tu comunidad."</li>
          <li>📢 "Compartí lo que pensás, sin filtros ni juicios."</li>
          <li>💡 "Un lugar para expresarte libremente."</li>
        </ul>
      </section>

      <section className="mt-4">
        <h3>¿Sabías que...?</h3>
        <ul>
          <li>🧠 El primer post de la app fue una foto de un mate y una medialuna.</li>
          <li>👥 Más de 200 usuarios activos se registraron en la primera semana.</li>
          <li>🚀 La app fue desarrollada en solo 2 meses por dos estudiantes apasionados.</li>
        </ul>
      </section>

      <section className="mt-5">
        <h2>Feed de Publicaciones</h2>
        <p>Aquí se mostrará el contenido publicado por los usuarios.</p>
      </section>

      <div className="container mt-4">
        <h2 className="mb-4">POSTS</h2>

        <BoxPost
          posts={filteredPosts}
          onDelete={handleDeletePost}
          lastPostRef={lastPostElementRef}
        />

        {loading && <p>Cargando más posts...</p>}
        {!hasMore && <p>No hay más posts para cargar.</p>}

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

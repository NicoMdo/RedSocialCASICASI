
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import MediaRenderer from "../components/MediaRenderer";
import "../styles/PostDetail.css"

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:3003/post/${id}`);
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error("Error cargando post:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch("http://localhost:3003/comment");
      const allComments = await res.json();
      const filtered = allComments.filter(c => c.post === id);
      setComments(filtered);
    } catch (err) {
      console.error("Error al traer comentarios:", err);
    }
  };

  const handleAddComment = async () => {
    const text = commentInput.trim();
    if (!text) return alert("Escribí un comentario antes de enviarlo.");

    try {
      const nuevoComentario = {
        text,
        post: id,
        user: user._id,
      };

      const res = await fetch("http://localhost:3003/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoComentario),
      });

      if (res.ok) {
        const createdComment = await res.json();
        createdComment.user = { _id: user._id, nickName: user.nickName };
        createdComment.createdAt = new Date().toISOString();
        setComments(prev => [...prev, createdComment]);
        setCommentInput("");
      } else {
        alert("Error al agregar el comentario");
      }
    } catch (error) {
      console.error("Error comentando:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:3003/comment/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      } else {
        alert("Error al eliminar el comentario");
      }
    } catch (error) {
      console.error("Error eliminando comentario:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditingText(comment.text);
  };

  const handleSaveEditedComment = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:3003/comment/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editingText }),
      });

      if (res.ok) {
        setComments(prev =>
          prev.map(c => c._id === commentId ? { ...c, text: editingText } : c)
        );
        setEditingComment(null);
        setEditingText("");
      } else {
        alert("Error al editar comentario");
      }
    } catch (err) {
      console.error("Error editando comentario:", err);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return alert("Ingresa un nombre de tag");

    try {
      let tag;
      const createRes = await fetch("http://localhost:3003/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName }),
      });

      if (createRes.ok) {
        tag = await createRes.json();
      } else {
        const allTagsRes = await fetch("http://localhost:3003/tag");
        const allTags = await allTagsRes.json();
        tag = allTags.find(t => t.name.toLowerCase() === newTagName.toLowerCase());
        if (!tag) throw new Error("No se encontró el tag");
      }

      const assignRes = await fetch(`http://localhost:3003/tag/${tag._id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id }),
      });

      if (!assignRes.ok) throw new Error("Error al asignar tag");

      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));

      setNewTagName("");
      alert("Tag agregado con éxito");
    } catch (error) {
      console.error(error);
      alert("Error agregando tag: " + error.message);
    }
  };

  const handleRemoveTag = async (tagId) => {
    try {
      const res = await fetch(`http://localhost:3003/tag/${tagId}/remove`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id }),
      });

      if (!res.ok) throw new Error("Error al desasignar el tag");

      setPost(prev => ({
        ...prev,
        tags: prev.tags.filter(t => String(t._id) !== String(tagId)) // 🔧 fix acá
      }));
    } catch (err) {
      console.error("Error quitando el tag:", err);
      alert("Error al quitar el tag");
    }
  };


  const puedeEditarComentario = (comment) => {
    const cincoMin = 5 * 60 * 1000;
    return new Date() - new Date(comment.createdAt) < cincoMin;
  };
  if (!post) return <p>Cargando...</p>;

  return (
    <div className="container mt-5">
      <h2>Detalle del post</h2>
      <div className="card p-3">

        {/* Usuario y fecha */}
        <div className="d-flex justify-content-between align-items-center mb-3 divisionDescriptionUser" >
          <div className="d-flex align-items-center gap-2">
            <div className="iconUser">
              {post.user?.nickName ? post.user.nickName.charAt(0) : "U"}
            </div>
            <span className="userBold">{post.user?.nickName || "Usuario"}</span>
          </div>
          <small className="text-muted">
            {new Date(post.createdAt).toLocaleDateString()} | {new Date(post.createdAt).toLocaleTimeString()}
          </small>
        </div>

        <div className="card-text" style={{ whiteSpace: "pre-wrap" }}>
          <MediaRenderer text={post.description} />
        </div>


        {post.images?.length > 0 && (
          <div className="mb-3 d-flex flex-wrap gap-2">
            {post.images.map(img => (
              <img className='post-image'
                key={img._id}
                src={`http://localhost:3003${img.url}`}
                alt="Post"

              />
            ))}
          </div>
        )}

        {/* Sección de tags con input */}
        <div className="tags-section d-flex flex-wrap align-items-center gap-2 mt-3 mb-3 divisorTagDescription" >
          {post.tags?.length > 0 ? (
            post.tags.map(tag => (
              <div key={tag._id} className="tag-item" title={`Quitar tag: ${tag.name}`}>
                <span>{tag.name}</span>
                <button className="tag-remove-btn" onClick={() => handleRemoveTag(tag._id)}>&times;</button>
              </div>
            ))
          ) : (
            <p className="mb-0 text-muted fontNoHayTags" >No hay tags</p>
          )}

          <div className="d-flex align-items-center gap-1">
            <input
              type="text"
              placeholder="Nuevo tag"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              className="form-control tag-input" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
            />
            <button
              onClick={handleAddTag}
              className="btn btn-primary"
              title="Agregar tag"
            >+</button>
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="mt-4">
          <h5>Comentarios</h5>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Escribí tu comentario..."
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleAddComment}>
              Agregar comentario
            </button>
          </div>

          <ul className="list-group">
            {comments.map(comment => (
              <li key={comment._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center mb-2 divisorNameComment" >
                  <div className="d-flex align-items-center gap-2">
                    <div className="nameIconUser" >
                      {comment.user?.nickName?.charAt(0) || "U"}
                    </div>
                    <small className="text-muted">{comment.user?.nickName || "Usuario"}</small>
                  </div>
                  <small className="text-secondary">{new Date(comment.createdAt).toLocaleString()}</small>
                </div>

                {editingComment === comment._id ? (
                  <>
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="form-control mb-2"
                    />
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleSaveEditedComment(comment._id)}>
                      Guardar
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingComment(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <MediaRenderer text={comment.text} />
                    </div>
                    {comment.user?._id === user._id && (
                      <div className="mt-2">
                        {puedeEditarComentario(comment) && (
                          <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditComment(comment)}>
                            Modificar
                          </button>
                        )}
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteComment(comment._id)}>
                          Quitar
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default PostDetails;
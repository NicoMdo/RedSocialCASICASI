import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../contexts/UserContext';
import "../styles/NewPost.css"

const NewPost = () => {
  const [description, setDescription] = useState("");
  const [tagName, setTagName] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [embedPreview, setEmbedPreview] = useState(null);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const newPreviews = selectedFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newPreviews.map(p => p.file)]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
  }, [imagePreviews]);

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].previewUrl);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = description.match(urlRegex);
    if (!match) return setEmbedPreview(null);

    const url = match[0];
    if (url.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i)) {
      setEmbedPreview(<img src={url} alt="preview" style={{ maxWidth: "100%", marginTop: "10px", borderRadius: "8px" }} />);
    } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com")) {
        const params = new URLSearchParams(url.split('?')[1]);
        videoId = params.get("v");
      } else {
        videoId = url.split("/").pop();
      }
      if (videoId) {
        setEmbedPreview(
          <iframe className='YouTube-preview'
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube preview"
          ></iframe>
        );
      }
    } else {
      setEmbedPreview(null);
    }
  }, [description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("Debes escribir una descripción");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("user", user._id);
      images.forEach(image => formData.append("images", image));

      // 🚀 Enviamos los tags como array JSON (aunque sea uno)
      if (tagName.trim()) {
        formData.append("tags", JSON.stringify([tagName.trim()]));
      }

      const resPost = await fetch("http://localhost:3003/post", {
        method: "POST",
        body: formData,
      });

      if (!resPost.ok) throw new Error("No se pudo crear el post");

      alert("Post creado con éxito");
      navigate("/profile");

    } catch (error) {
      console.error("Error:", error);
      alert("Error en el servidor");
    }
  };


  return (
    <div className="container mt-5">
      <h2>Crear nuevo post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Etiqueta (opcional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: tecnología"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            rows="5"
            placeholder="¿Qué quisieras compartir con tu red?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          {embedPreview && <div className="mt-2">{embedPreview}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Imágenes (opcional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="form-control"
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Vista previa:</label>
            <div className="d-flex flex-wrap gap-3">
              {imagePreviews.map((img, i) => (
                <div key={i} style={{ position: "relative", display: "inline-block" }}>
                  <img className='image-preview' src={img.previewUrl} alt={`preview-${i}`}/>
                  <button type="button" onClick={() => removeImage(i)} className='remove-image'>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-success">
          Publicar
        </button>
      </form>
    </div>
  );
};

export default NewPost;

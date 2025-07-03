// src/components/PostImages.jsx

const PostImages = ({ images }) => {
    if (!images || images.length === 0) return null;
    return (
        <div className="mb-3 d-flex flex-wrap gap-2">
            {images.map((img) => (
                <img
                    key={img._id}
                    src={`http://localhost:3003${img.url}`}
                    alt="Post"
                    style={{
                        maxWidth: "150px",
                        maxHeight: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                    }}
                />
            ))}
        </div>
    );
};

export default PostImages;
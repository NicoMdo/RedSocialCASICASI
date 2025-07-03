// src/components/CommentInput.jsx

const CommentInput = ({ value, onChange, onSubmit }) => (
    <div className="input-group mb-2">
        <input
            type="text"
            className="form-control"
            placeholder="Escribí tu comentario..."
            value={value}
            onChange={onChange}
        />
        <button className="btn btn-success" onClick={onSubmit}>
            Agregar comentario
        </button>
    </div>
);

export default CommentInput;

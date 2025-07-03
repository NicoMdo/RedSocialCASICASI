// src/components/CommentItem.jsx
import MediaRenderer from "./MediaRenderer";

const CommentItem = ({
    comment,
    user,
    editingComment,
    editingText,
    onEditComment,
    onDeleteComment,
    onSaveEditedComment,
    onCancelEdit,
    onChangeEditText,
    hideModifyButton,
    onUserClick,
}) => {
    if (!comment || !comment.user || !user) return null; // Protección

    const isOwner = comment.user._id === user._id;

    return (
        <li className="list-group-item comment-box">
            <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-1">
                <div
                    className={isOwner ? "clickable-user" : ""}
                    onClick={() => onUserClick(comment.user._id)}
                    role={isOwner ? "button" : undefined}
                    tabIndex={isOwner ? 0 : undefined}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && isOwner) onUserClick(comment.user._id);
                    }}
                >
                    <div className="user-avatar comment">
                        {comment.user.nickName?.charAt(0) || "U"}
                    </div>
                    <small className="text-muted">{comment.user.nickName || "Usuario"}</small>
                </div>
                <small className="text-secondary">
                    {new Date(comment.createdAt).toLocaleString([], { hour12: false })}
                </small>
            </div>

            {editingComment === comment._id ? (
                <>
                    <input
                        value={editingText}
                        onChange={(e) => onChangeEditText(e.target.value)}
                        className="form-control mb-2"
                    />
                    <button className="btn btn-sm btn-primary me-2" onClick={onSaveEditedComment}>
                        Guardar
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={onCancelEdit}>
                        Cancelar
                    </button>
                </>
            ) : (
                <>
                    <div><MediaRenderer text={comment.text} /></div>
                    {isOwner && (
                        <div className="mt-2">
                            {!hideModifyButton ? (
                                <>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => onEditComment(comment)}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={onDeleteComment}
                                    >
                                        Quitar
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={onDeleteComment}
                                >
                                    Quitar
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </li>
    );
};

export default CommentItem;

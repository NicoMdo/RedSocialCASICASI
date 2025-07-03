// src/components/CommentList.jsx
import CommentItem from "./CommentItem";

const CommentList = ({
    comments,
    expanded,
    onToggle,
    user,
    editingComment,
    editingText,
    onEditComment,
    onDeleteComment,
    onSaveEditedComment,
    onCancelEdit,
    onChangeEditText,
    hideModifyButtonIds,
    onUserClick,
}) => {
    if (!comments || comments.length === 0) return null;

    const visibleComments = expanded ? comments : comments.slice(-2);

    return (
        <div className="border p-2 rounded mt-3" style={{ maxHeight: "450px", overflowY: "auto", backgroundColor: "#f1f1f1" }}>
            <ul className="list-group">
                {visibleComments.map((comment, idx) => (
                    <CommentItem
                        key={idx}
                        comment={comment}
                        user={user}
                        editingComment={editingComment}
                        editingText={editingText}
                        onEditComment={onEditComment}
                        onDeleteComment={onDeleteComment}
                        onSaveEditedComment={onSaveEditedComment}
                        onCancelEdit={onCancelEdit}
                        onChangeEditText={onChangeEditText}
                        hideModifyButton={hideModifyButtonIds[comment._id]}
                        onUserClick={onUserClick}
                    />
                ))}
            </ul>
            {comments.length > 2 && (
                <div className="mt-2 text-center">
                    <button className="btn btn-sm btn-outline-secondary" onClick={onToggle}>
                        {expanded ? "Ver menos" : "Ver más comentarios"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentList;

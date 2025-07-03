// src/components/PostHeader.jsx

const PostHeader = ({ user, post, onUserClick }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            <div
                className={post.user?._id === user._id ? "clickable-user" : ""}
                onClick={() => onUserClick(post.user?._id)}
                role={post.user?._id === user._id ? "button" : undefined}
                tabIndex={post.user?._id === user._id ? 0 : undefined}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && post.user?._id === user._id) onUserClick(post.user._id);
                }}
            >
                <div className="user-avatar">{post.user?.nickName?.charAt(0) || "U"}</div>
                <span style={{ fontWeight: "bold" }}>{post.user?.nickName || "Usuario"}</span>
            </div>
            <small className="text-muted">
                {new Date(post.createdAt).toLocaleDateString()} | {new Date(post.createdAt).toLocaleTimeString([], { hour12: false })}
            </small>
        </div>
    );
};

export default PostHeader;
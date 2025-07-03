import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import MediaRenderer from "./MediaRenderer";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import PostHeader from "./PostHeader";
import PostImages from "./PostImages";
import '../styles/BoxPost.css';

const BoxPost = ({ posts, onDelete, lastPostRef }) => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [commentInputs, setCommentInputs] = useState({});
    const [localCommentCounts, setLocalCommentCounts] = useState({});
    const [localComments, setLocalComments] = useState({});
    const [expandedPosts, setExpandedPosts] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [hideModifyButtonIds, setHideModifyButtonIds] = useState({});

    // Fetch de comentarios una sola vez al montar
    useEffect(() => {
        const fetchAndSetComments = async () => {
            try {
                const res = await fetch("http://localhost:3003/comment");
                const data = await res.json();
                const grouped = {};
                const counts = {};

                data.forEach((comment) => {
                    const postId = comment.post;
                    if (!grouped[postId]) grouped[postId] = [];
                    grouped[postId].push(comment);
                    counts[postId] = (counts[postId] || 0) + 1;
                });

                setLocalComments(grouped);
                setLocalCommentCounts(counts);
            } catch (error) {
                console.error("Error al cargar comentarios:", error);
            }
        };

        fetchAndSetComments();
    }, []);

    // ⏰ Evaluar cada minuto si los botones deben ocultarse
    useEffect(() => {
        const updateHideModifyButtons = () => {
            const now = new Date();
            const newHidden = {};

            for (const postId in localComments) {
                localComments[postId].forEach((comment) => {
                    const created = new Date(comment.createdAt);
                    const diffMs = now - created;
                    if (diffMs > 5 * 60 * 1000) {
                        newHidden[comment._id] = true;
                    }
                });
            }

            setHideModifyButtonIds(newHidden);
        };

        updateHideModifyButtons(); // Ejecución inmediata
        const intervalId = setInterval(updateHideModifyButtons, 60 * 1000);
        return () => clearInterval(intervalId);
    }, [localComments]);

    const handleDeletePost = async (postId) => {
        try {
            const res = await fetch(`http://localhost:3003/post/${postId}`, { method: "DELETE" });
            if (res.ok) onDelete(postId);
        } catch (error) {
            console.error("Error al eliminar el post:", error);
        }
    };

    const handleCommentInputChange = (postId, value) => {
        setCommentInputs((prev) => ({ ...prev, [postId]: value }));
    };

    const handleAddComment = async (postId) => {
        const text = commentInputs[postId]?.trim();
        if (!text) return alert("Escribí un comentario antes de enviarlo.");
        try {
            const res = await fetch("http://localhost:3003/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, post: postId, user: user._id }),
            });
            if (res.ok) {
                const createdComment = await res.json();
                createdComment.user = { _id: user._id, nickName: user.nickName };
                setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
                setLocalComments((prev) => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), createdComment],
                }));
                setLocalCommentCounts((prev) => ({
                    ...prev,
                    [postId]: (prev[postId] ?? 0) + 1,
                }));
            }
        } catch (error) {
            console.error("Error al comentar:", error);
        }
    };

    const handleDeleteComment = async (commentId, postId) => {
        try {
            const res = await fetch(`http://localhost:3003/comment/${commentId}`, { method: "DELETE" });
            if (res.ok) {
                setLocalComments((prev) => ({
                    ...prev,
                    [postId]: prev[postId].filter((c) => c._id !== commentId),
                }));
                setLocalCommentCounts((prev) => ({
                    ...prev,
                    [postId]: prev[postId] - 1,
                }));
                setHideModifyButtonIds((prev) => {
                    const copy = { ...prev };
                    delete copy[commentId];
                    return copy;
                });
            }
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment._id);
        setEditingText(comment.text);
    };

    const handleSaveEditedComment = async (commentId, postId) => {
        try {
            const res = await fetch(`http://localhost:3003/comment/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: editingText }),
            });
            if (res.ok) {
                setLocalComments((prev) => ({
                    ...prev,
                    [postId]: prev[postId].map((c) =>
                        c._id === commentId ? { ...c, text: editingText } : c
                    ),
                }));
                setEditingComment(null);
                setEditingText("");
            }
        } catch (error) {
            console.error("Error al editar comentario:", error);
        }
    };

    const toggleExpanded = (postId) => {
        setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleUserClick = (clickedUserId) => {
        if (clickedUserId === user._id) {
            navigate(`/profile/${clickedUserId}`);
        }
    };

    return (
        <div className="list-group">
            {posts.map((post, index) => {
                const isLast = index === posts.length - 1;
                return (
                    <div
                        key={post._id}
                        ref={isLast ? lastPostRef : null}
                        className="list-group-item mb-5 p-4 rounded post-card"
                    >
                        <PostHeader user={user} post={post} onUserClick={handleUserClick} />

                        <div style={{ whiteSpace: "pre-wrap", marginBottom: "0.75rem" }}>
                            <MediaRenderer text={post.description} />
                        </div>

                        {post.tags?.length > 0 && (
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                {post.tags.map((tag) => (
                                    <span key={tag._id} className="badge bg-secondary">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <PostImages images={post.images} />

                        <p>Comentarios: {localCommentCounts[post._id] ?? 0}</p>

                        <div className="d-flex gap-2 flex-wrap mb-2">
                            <Link to={`/post/${post._id}`} className="btn btn-primary">
                                Ver más
                            </Link>
                            {post?.user?._id === user._id && (
                                <button className="btn btn-danger" onClick={() => handleDeletePost(post._id)}>
                                    Quitar post
                                </button>
                            )}
                        </div>

                        <CommentInput
                            value={commentInputs[post._id] || ""}
                            onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                            onSubmit={() => handleAddComment(post._id)}
                        />

                        <CommentList
                            comments={localComments[post._id] || []}
                            expanded={expandedPosts[post._id]}
                            onToggle={() => toggleExpanded(post._id)}
                            user={user}
                            editingComment={editingComment}
                            editingText={editingText}
                            onEditComment={handleEditComment}
                            onDeleteComment={(commentId) => handleDeleteComment(commentId, post._id)}
                            onSaveEditedComment={(commentId) => handleSaveEditedComment(commentId, post._id)}
                            onCancelEdit={() => setEditingComment(null)}
                            onChangeEditText={setEditingText}
                            hideModifyButtonIds={hideModifyButtonIds}
                            onUserClick={handleUserClick}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default BoxPost;

const Tag = ({ tag }) => {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.3em 0.6em",
        margin: "0.2em",
        backgroundColor: "#6f42c1",
        color: "white",
        borderRadius: "0.3em",
        fontSize: "0.9em",
        cursor: "default"
      }}
      title={`Tag: ${tag.name}`}
    >
      {tag.name}
    </span>
  );
};

export default Tag;

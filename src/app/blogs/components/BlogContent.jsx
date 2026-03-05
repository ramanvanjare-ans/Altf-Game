export default function BlogContent({ content }) {
  if (!content) return null;

  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
      {Array.isArray(content)
        ? content.map((para, index) => (
            <p key={index}>{para}</p>
          ))
        : <p>{content}</p>}
    </article>
  );
}

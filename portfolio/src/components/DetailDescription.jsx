export default function DetailDescription({ text }) {
  return (
    <p className="artwork-detail-description">
      {text?.split(/(\*[^*]+\*)/).map((part, index) => (
        index % 2 === 0 ? part : <em key={index}>{part.slice(1, -1)}</em>
      ))}
    </p>
  );
}

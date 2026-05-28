export default function Wordmark({ size = 'md' }) {
  const cls = size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : ''
  return (
    <span className={`pf-wordmark ${cls}`}>
      <span>pão</span>
      <span className="light">fresquim</span>
      <span className="dot" />
    </span>
  )
}

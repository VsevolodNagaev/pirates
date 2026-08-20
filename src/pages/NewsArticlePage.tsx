import { Link, Navigate, useParams } from 'react-router-dom'
import { formatNewsDate, newsById } from '@/content/news'

export function NewsArticlePage() {
  const { id } = useParams()
  const item = id ? newsById(id) : undefined
  if (!item) return <Navigate to="/news" replace />

  return (
    <article>
      <p className="text-xs uppercase tracking-[0.28em] text-gold">
        <Link to="/news" className="hover:underline">
          Новости
        </Link>
      </p>
      <time dateTime={item.date} className="mt-3 block text-sm text-parchment/55">
        {formatNewsDate(item.date)}
      </time>
      <h1 className="mt-2 font-display text-4xl leading-tight text-parchment">{item.title}</h1>
      <div className="mt-6 rounded-xl border border-gold/20 bg-parchment p-5 text-ink md:p-8">
        <p className="text-lg leading-relaxed text-ink/80">{item.lead}</p>
        {item.body.map((p) => (
          <p key={p} className="mt-4 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
      <p className="mt-6">
        <Link to="/news" className="text-sm text-parchment/70 underline-offset-4 hover:text-gold hover:underline">
          ← К ленте
        </Link>
      </p>
    </article>
  )
}

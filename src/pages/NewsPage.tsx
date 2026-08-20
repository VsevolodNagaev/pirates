import { Link } from 'react-router-dom'
import { formatNewsDate, sortedNews } from '@/content/news'

export function NewsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 border-b border-gold/25 pb-5">
        <p className="text-xs uppercase tracking-[0.28em] text-gold">Лента</p>
        <h1 className="mt-2 font-display text-4xl text-parchment">Новости проекта</h1>
      </header>

      <ol className="relative m-0 ml-1 list-none border-l border-gold/30 pl-8">
        {sortedNews().map((item) => (
          <li key={item.id} className="relative pb-8 last:pb-0">
            <span
              aria-hidden
              className="absolute top-2 -left-[37px] size-2.5 rounded-full border border-gold bg-gold"
            />
            <article className="rounded-lg border border-gold/20 bg-parchment p-5 text-ink md:p-6">
              <time dateTime={item.date} className="text-xs uppercase tracking-[0.18em] text-oak-mid/55">
                {formatNewsDate(item.date)}
              </time>
              <h2 className="mt-2 font-display text-2xl leading-snug md:text-[1.7rem]">
                <Link to={`/news/${item.id}`} className="hover:text-oak-mid">
                  {item.title}
                </Link>
              </h2>
              <p className="mt-2 text-[1.05rem] leading-relaxed text-ink/80">{item.lead}</p>
              {item.body.map((p) => (
                <p key={p} className="mt-3 leading-relaxed">
                  {p}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}

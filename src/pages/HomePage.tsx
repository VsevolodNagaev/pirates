import { Link } from "react-router-dom";
import { formatNewsDate, sortedNews } from "@/content/news";

const latest = sortedNews().slice(0, 3);

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-xl border border-gold/25 bg-oak-mid">
        <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_1fr] md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold">
              Ливонский ветер
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-parchment md:text-5xl">
              Капер на службе царя.
              <br />
              Балтика, 1570.
            </h1>
            <p className="mt-4 max-w-xl text-parchment/75">
              Исторический LARP в Челябинской области: эскадра Карстена Роде,
              семь островных лагерей, охота на караваны и хрупкое датское
              покровительство.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/rules"
                className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-oak hover:bg-gold/90"
              >
                Читать правила
              </Link>
              <Link
                to="/refs"
                className="rounded-md border border-gold/40 px-4 py-2 text-sm text-gold hover:bg-gold/10"
              >
                Референсы костюмов
              </Link>
            </div>
          </div>
          <dl className="grid content-start gap-3 text-sm text-parchment/80">
            <div className="rounded-md border border-gold/15 bg-oak/40 p-3">
              <dt className="text-xs uppercase tracking-widest text-gold/80">
                Когда
              </dt>
              <dd>август 2028 г.</dd>
            </div>
            <div className="rounded-md border border-gold/15 bg-oak/40 p-3">
              <dt className="text-xs uppercase tracking-widest text-gold/80">
                Где
              </dt>
              <dd>
                Челябинская область, Аргаяшский район, оз. Увильды / Аргазинское
                вдхр.
              </dd>
            </div>
            <div className="rounded-md border border-gold/15 bg-oak/40 p-3">
              <dt className="text-xs uppercase tracking-widest text-gold/80">
                Масштаб
              </dt>
              <dd>300–500 игроков · 7 лагерей</dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl text-gold">Последние новости</h2>
          <Link
            to="/news"
            className="text-sm text-parchment/70 underline-offset-4 hover:text-gold hover:underline"
          >
            Вся лента
          </Link>
        </div>
        <ol className="m-0 grid list-none gap-4">
          {latest.map((item) => (
            <li key={item.id}>
              <Link
                to={`/news/${item.id}`}
                className="block rounded-xl border border-gold/20 bg-parchment p-5 text-ink transition hover:border-gold/50 md:p-6"
              >
                <time
                  dateTime={item.date}
                  className="text-xs uppercase tracking-[0.18em] text-oak-mid/55"
                >
                  {formatNewsDate(item.date)}
                </time>
                <h3 className="mt-2 font-display text-2xl leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink/80">{item.lead}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

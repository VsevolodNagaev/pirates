import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RULES, type RuleId } from "@/content/rules";

const rawModules = import.meta.glob("../content/rules/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function markdownFor(file: string) {
  const entry = Object.entries(rawModules).find(
    ([k]) =>
      k.endsWith("/" + file) || k.endsWith("\\" + file) || k.includes(file),
  );
  return entry?.[1] ?? "_Текст главы не найден. Запустите `npm run generate`._";
}

function fileFromHref(href?: string) {
  if (!href) return null;
  const m = href.match(/(\d{2}-[a-z0-9-]+)\.md/i);
  return m?.[1] ? `${m[1]}.md` : null;
}

export function RulesPage() {
  const [tab, setTab] = useState<RuleId>(RULES[0].id);
  const bodies = useMemo(
    () => Object.fromEntries(RULES.map((r) => [r.id, markdownFor(r.file)])),
    [],
  );

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Правила</p>

      <p className="mt-3 max-w-2xl text-parchment/70">Рабочая редакция</p>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as RuleId)}
        className="mt-8 lg:flex-row lg:items-start"
      >
        <TabsList className="lg:sticky lg:top-20 lg:w-64 lg:flex-col lg:items-stretch">
          {RULES.map((r) => (
            <TabsTrigger key={r.id} value={r.id} className="lg:w-full">
              <span className="mr-2 font-mono text-[11px] text-gold/70">
                {r.num}
              </span>
              {r.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {RULES.map((r) => (
          <TabsContent key={r.id} value={r.id} className="min-w-0 flex-1">
            <article className="prose-rules rounded-xl border border-gold/20 bg-parchment p-5 md:p-8">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children }) => {
                    const file = fileFromHref(href);
                    const target = RULES.find((x) => x.file === file);
                    if (target) {
                      return (
                        <button
                          type="button"
                          className="cursor-pointer underline decoration-gold/60 underline-offset-4"
                          onClick={() => setTab(target.id)}
                        >
                          {children}
                        </button>
                      );
                    }
                    if (href?.startsWith("http")) {
                      return (
                        <a href={href} target="_blank" rel="noreferrer">
                          {children}
                        </a>
                      );
                    }
                    const internal = href?.replace(/^\.\//, "/") ?? "";
                    if (internal.startsWith("/")) {
                      return (
                        <Link
                          to={internal}
                          className="underline decoration-gold/60 underline-offset-4"
                        >
                          {children}
                        </Link>
                      );
                    }
                    return <span>{children}</span>;
                  },
                }}
              >
                {bodies[r.id]}
              </Markdown>
            </article>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

import { useMemo, useState } from "react";
import catalog from "@/content/refs.json" with { type: "json" };
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { refSrc } from "@/lib/utils";

type Item = { file: string; role: string };
type Faction = (typeof catalog)[number];

export function RefsPage() {
  const [faction, setFaction] = useState(catalog[0].id);
  const [open, setOpen] = useState<null | { folder: string; item: Item }>(null);
  const current = useMemo(
    () => catalog.find((f) => f.id === faction) as Faction,
    [faction],
  );

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold">Костюм</p>
      <h1 className="mt-2 font-display text-4xl text-parchment">
        Референсы фракций
      </h1>

      <Tabs value={faction} onValueChange={setFaction} className="mt-8">
        <TabsList>
          {catalog.map((f) => (
            <TabsTrigger key={f.id} value={f.id}>
              {f.name}
              <span className="ml-2 text-[11px] text-gold/50">{f.count}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {catalog.map((f) => (
          <TabsContent key={f.id} value={f.id}>
            <p className="mb-6 max-w-3xl text-parchment/75">{f.blurb}</p>
            <div className="space-y-10">
              {f.groups.map((g) => (
                <section key={g.title}>
                  <h2 className="mb-4 font-display text-2xl text-gold">
                    {g.title}
                  </h2>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {g.items.map((item) => (
                      <li key={item.file}>
                        <button
                          type="button"
                          onClick={() => setOpen({ folder: f.folder, item })}
                          className="group w-full overflow-hidden rounded-lg border border-gold/20 bg-oak-mid text-left"
                        >
                          <img
                            src={refSrc(f.folder, item.file)}
                            alt={item.role}
                            loading="lazy"
                            className="aspect-[3/2] w-full object-cover object-top transition group-hover:opacity-90"
                          />
                          <span className="block px-2 py-2 text-sm text-parchment/85">
                            {item.role}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          {open ? (
            <figure className="overflow-hidden rounded-xl border border-gold/30 bg-oak-mid">
              <img
                src={refSrc(open.folder, open.item.file)}
                alt={open.item.role}
                className="max-h-[80vh] w-full object-contain bg-oak"
              />
              <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
                <DialogTitle>{open.item.role}</DialogTitle>
                <span className="text-xs text-parchment/50">
                  {current.name}
                </span>
              </figcaption>
            </figure>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

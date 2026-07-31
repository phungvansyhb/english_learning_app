import Image from "next/image"
import { Clock } from "lucide-react"

import { articles } from "@/lib/data"
import type { Article } from "@/lib/types"

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group cursor-pointer">
      <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          width={480}
          height={220}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-3 text-pretty text-sm font-semibold leading-snug text-foreground">
        {article.title}
      </h3>
      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{article.category}</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" />
          {article.readingTime}
        </span>
      </div>
    </article>
  )
}

export function ArticlesSection() {
  return (
    <section>
      <h2 className="text-lg font-bold text-foreground">Top articles for you</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}

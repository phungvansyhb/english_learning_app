import { MousePointerClick } from "lucide-react"

export default function DictionaryDemoPage() {
  return (
    <main className="mx-auto max-w-3xl px-1 py-6 md:py-8">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-purple/40 px-3 py-1 text-xs font-semibold text-accent-foreground">
        <MousePointerClick className="size-3.5" /> Bôi đen từ bất kỳ để tra cứu
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        Từ điển tra cứu nhanh
      </h1>
      <p className="mt-3 text-pretty leading-7 text-muted-foreground">
        Quét (bôi đen) một từ hoặc cụm từ trong đoạn văn bên dưới. Một nút tra cứu nhỏ sẽ xuất hiện —
        nhấn vào đó để mở từ điển AI Anh–Việt ngay tại chỗ.
      </p>

      <article className="mt-8 rounded-2xl bg-card p-6 leading-8 shadow-sm ring-1 ring-foreground/10 md:p-8">
        <h2 className="mb-3 text-lg font-semibold">Sample reading passage</h2>
        <p className="text-pretty">
          Many teams need to <mark className="rounded bg-brand-mint/40 px-1">switch</mark> the way
          they work as their products grow. A thoughtful{" "}
          <mark className="rounded bg-brand-orange/30 px-1">approach</mark> helps everyone stay
          aligned while the business keeps moving. Leaders often say we need to switch to a more{" "}
          <mark className="rounded bg-brand-pink/30 px-1">sustainable</mark> way of building
          software, so that growth today does not create problems tomorrow. Try selecting any word
          in this paragraph to see the dictionary in action.
        </p>
      </article>

      <p className="mt-6 text-sm text-muted-foreground">
        Mẹo: các từ được tô màu (switch, approach, sustainable) đã có sẵn dữ liệu mẫu đầy đủ. Mọi từ
        khác vẫn hiển thị thẻ tra cứu để bạn thêm nghĩa riêng.
      </p>
    </main>
  )
}

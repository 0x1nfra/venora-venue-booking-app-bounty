export function TestimonialSection() {
  return (
    <section className="py-20 px-4 bg-card border-y border-hairline border-border">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-serif text-2xl sm:text-3xl italic text-foreground leading-relaxed mb-6">
          &ldquo;The Grand Hall transformed our company gala into something our
          team still talks about — quietly impeccable in every detail.&rdquo;
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">AR</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Aisha Rahman,{" "}
            <span className="font-medium text-foreground">
              Director of People Operations, Frontier Capital
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

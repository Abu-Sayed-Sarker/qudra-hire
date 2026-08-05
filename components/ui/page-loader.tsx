import Image from "next/image";

export default function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center py-24">
      <div className="relative flex flex-col items-center gap-5">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-2xl bg-[#4BC957]/20 animate-ping" />
          <div className="absolute inset-0 rounded-2xl bg-[#4BC957]/10 blur-xl" />
          <div className="relative h-20 w-20 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center overflow-hidden">
            <Image src="/logo.png" alt="logo" width={700} height={700} className="w-12 h-auto object-contain" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#4BC957] animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-[#4BC957] animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-[#4BC957] animate-bounce" />
        </div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}

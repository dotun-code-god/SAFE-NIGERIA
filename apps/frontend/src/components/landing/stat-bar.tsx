import React from "react";

export function StatBar() {
  const stats = [
    { value: "₦4.2T", label: "Lost to floods in Nigeria every year" },
    { value: "+40%", label: "Projected rise in relief costs by 2030" },
    { value: "36", label: "States needing hyper-local monitoring" },
    { value: "90%+", label: "Target accuracy of Sentinel telemetry" },
  ];
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto grid w-full max-w-[90%] lg:max-w-[75%] grid-cols-2 divide-x divide-border md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-8">
            <div className="font-mono text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {s.value}
            </div>
            <div className="mt-2 text-xs text-muted-foreground md:text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

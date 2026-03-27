import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Radar, ShieldCheck, LineChart } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

const features = [
  { icon: Radar, title: "Ingestion pipeline", description: "Modular collectors for Google Trends-style feeds, Reddit, and app discovery sources." },
  { icon: LineChart, title: "Transparent scoring", description: "Trend, demand, competition, and monetization models stay inspectable and reusable." },
  { icon: ShieldCheck, title: "Protected workspace", description: "Auth.js sessions, protected routes, and Prisma-backed persistence out of the box." },
];

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.2fr_0.8fr]">
      <section className="flex flex-col justify-between p-8 lg:p-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Opportunity Radar</p>
          <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-tight text-white">A real keyword intelligence workspace for founders building the next profitable product.</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">Discover durable demand, cluster noisy trend data, score commercial viability, and generate practical product recommendations.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="bg-white/5">
                <Icon className="h-5 w-5 text-sky-300" />
                <h2 className="mt-4 text-lg font-semibold text-white">{feature.title}</h2>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
      <section className="flex items-center justify-center border-l border-white/10 bg-slate-950/50 p-8 lg:p-14">
        <Card className="w-full max-w-md">
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-400">Sign in to your workspace</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Founder login</h2>
            <p className="mt-2 text-sm text-slate-500">Use the seeded account from `.env.example` after running the seed script.</p>
          </div>
          <LoginForm />
        </Card>
      </section>
    </main>
  );
}

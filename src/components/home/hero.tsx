// @ts-nocheck
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Package,
  PlayCircle,
  Search,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";

/* ------------------------------ data ------------------------------ */

const highlights = [
  {
    icon: Package,
    tone: "green",
    title: "সব কুরিয়ার",
    desc: "একই নম্বরের সব কুরিয়ারের রেকর্ড এক জায়গায়",
  },
  {
    icon: Zap,
    tone: "green",
    title: "দ্রুত ফলাফল",
    desc: "রিয়েল-টাইম রিপোর্ট দেখে সাথে সাথে সিদ্ধান্ত নিন",
  },
  {
    icon: ShieldCheck,
    tone: "gold",
    title: "স্মার্ট ঝুঁকি সংকেত",
    desc: "স্মার্ট অ্যালগরিদমে রিটার্ন ঝুঁকির সম্ভাবনা সনাক্ত",
  },
];

const steps = [
  {
    number: "১",
    icon: Smartphone,
    title: "নম্বর দিন",
    desc: "গ্রাহকের মোবাইল নম্বর দিন ও সার্চ করুন।",
  },
  {
    number: "২",
    icon: Search,
    title: "রেকর্ড মিলিয়ে দেখুন",
    desc: "সব কুরিয়ারের রেকর্ড ও ঝুঁকি সংকেত এক জায়গায় দেখুন।",
  },
  {
    number: "৩",
    icon: ShieldCheck,
    title: "সিদ্ধান্ত নিন",
    desc: "তথ্য দেখে আত্মবিশ্বাসের সাথে আপনার COD সিদ্ধান্ত নিন।",
  },
];

/* ------------------------------ hero ------------------------------ */

export default function Hero() {
  const scrollToFeatures = (event) => {
    event.preventDefault();
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-night text-white">
      {/* background image */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img
          src="/images/herobg.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="maxw relative z-10 px-4 pb-16 pt-6 sm:px-6 md:pb-24 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:justify-between lg:gap-8">
          {/* ---------- left: headline + CTAs ---------- */}
          <div className="w-full">
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-semibold tracking-[0.08em] text-accent shadow-[0_0_20px_rgba(18,197,120,0.18)] backdrop-blur-sm sm:text-base">
              রিটার্ন কমান, আয় বাড়ান
            </span>
            <h1 className="mt-5 text-2xl font-extrabold leading-[1.18] tracking-tight text-white sm:text-5xl lg:text-[2.75rem] xl:text-[3.4rem]">
              পণ্য পাঠানোর আগে কাস্টমার,
              <br />
              <span className="text-accent">বিশ্বস্ত কিনা যাচাই করুন</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
              সব কুরিয়ারের রেকর্ড এক জায়গায় এনে আপনার COD সিদ্ধান্তকে আরও সহজ
              করুন।
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-7 py-3.5 font-bold text-white shadow-lg shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-strong hover:shadow-accent/40"
              >
                শুরু করুন
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex cursor-pointer items-center gap-2 font-semibold text-white/75 transition-colors hover:text-white"
              >
                <PlayCircle className="h-6 w-6 text-accent" />
                ফিচার দেখুন
              </button>
            </div>
          </div>

          {/* ---------- right: seller dashboard mockup ---------- */}
          <div className="mx-auto w-full max-w-md lg:max-w-[480px] lg:justify-self-end">
            <img
              src="/images/dashboard.png"
              alt="কুরিয়ারবাইট সেলার ড্যাশবোর্ড প্রিভিউ"
              className="w-full rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
              loading="lazy"
            />
          </div>
        </div>

        {/* ---------- highlights strip ---------- */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur md:mt-12">
          <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 px-6 py-5"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                      item.tone === "gold"
                        ? "bg-gold/15 text-gold"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-base font-bold text-white sm:text-[17px]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/55 sm:text-[13px]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- 3 easy steps ---------- */}
        <div className="mt-16 md:mt-20">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            সহজ তিন ধাপে স্মার্ট সিদ্ধান্ত
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center gap-3 md:flex-row md:gap-6"
                >
                  <div className="relative w-full rounded-2xl border border-white/10 bg-night-soft p-4 transition-colors duration-300 hover:border-accent/40 md:flex-1">
                    <span className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xl font-extrabold text-white ring-4 ring-night">
                      {step.number}
                    </span>
                    <span className="mt-2 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-white shadow-[0_0_24px_rgba(16,185,129,0.25)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                      {step.desc}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="flex items-center justify-center text-accent/80 md:hidden"
                    >
                      <ArrowDown className="h-6 w-6" />
                    </span>
                  )}

                  {index < steps.length - 1 && (
                    <span aria-hidden className="hidden text-accent/80 md:flex">
                      <ArrowRight className="h-8 w-8" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

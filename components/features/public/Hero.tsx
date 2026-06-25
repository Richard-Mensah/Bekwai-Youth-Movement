import Image from "next/image"
import Button from "@/components/ui/Button"
import { ORG } from "@/constants/nav"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-green-900 text-white">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/history/472533608_1643728982885427_6727051425384547508_n.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="container-content relative grid gap-10 py-20 md:grid-cols-[1.4fr_1fr] md:py-28">
        <div>
          <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-blue-100">
            Sefwi Bekwai · Western North · Ghana
          </p>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
            Harnessing the potential of every young person in Sefwi Bekwai
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-200">
            The {ORG.name} is a non-political youth governance institution
            serving 32 communities through structured governance, community
            intelligence, and volunteerism — aligned with the UN SDGs 2030.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/join" size="lg" variant="secondary">
              Join the Movement
            </Button>
            <Button
              href="/about"
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              Learn about BYM
            </Button>
          </div>
          <p className="mt-6 text-sm font-medium uppercase tracking-widest text-brand-blue-100">
            {ORG.motto}
          </p>
        </div>

        <div className="hidden items-center justify-center md:flex">
          <Image
            src="/images/logo.jpg"
            alt="Bekwai Youth Movement official logo"
            width={260}
            height={260}
            className="rounded-full ring-8 ring-white/10"
          />
        </div>
      </div>
    </section>
  )
}

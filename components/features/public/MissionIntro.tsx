import Image from "next/image"
import Reveal from "@/components/ui/Reveal"
import Button from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"

/** "Who we are" — mission + the new flagship-initiatives framing. */
export default function MissionIntro() {
  return (
    <section className="section">
      <div className="container-content grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-5 bg-gold-400" />
            Who we are
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-canopy text-balance sm:text-4xl">
            A grassroots movement, now building lasting institutions
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/70 dark:text-paper/70 text-pretty">
            The Bekwai Youth Movement exists to harness the potential of all young
            people in Sefwi Bekwai and its 31 surrounding sub-communities, through
            structured governance, community intelligence, volunteerism, and
            sustained leadership development, aligned with the UN SDGs.
          </p>
          <p className="mt-4 leading-relaxed text-ink/65 dark:text-paper/65">
            To deliver on that promise, the movement is bringing on board two
            flagship initiatives: a <strong className="text-canopy dark:text-paper">Youth
            General Assembly</strong> and a <strong className="text-canopy dark:text-paper">Bekwai
            Youth Parliament</strong>, supported by a Community Intelligence
            Network that gives every community a voice and every decision an
            evidence base.
          </p>
          <div className="mt-7">
            <Button href="/about" variant="outline">
              Read our story <ArrowRight size={16} />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/images/history/472434052_1644476419477350_7263677863074049163_n.jpg"
                  alt="BYM community engagement"
                  width={400}
                  height={500}
                  className="h-56 w-full object-cover"
                />
              </div>
              <div className="rounded-2xl bg-canopy p-5 text-white">
                <p className="font-display text-3xl font-semibold text-gold-300">2021</p>
                <p className="mt-1 text-sm text-white/75">
                  Grassroots beginnings in Sefwi Bekwai
                </p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-2xl border border-canopy/10 bg-paper p-5 dark:border-white/10 dark:bg-canopy-800">
                <p className="font-display text-3xl font-semibold text-canopy dark:text-paper">31</p>
                <p className="mt-1 text-sm text-ink/65 dark:text-paper/65">
                  sub-communities united under one movement
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/images/history/482247163_1201043701742295_4815130360104201400_n.jpg"
                  alt="BYM volunteers in the community"
                  width={400}
                  height={500}
                  className="h-56 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

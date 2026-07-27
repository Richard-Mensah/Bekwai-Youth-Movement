import Button from "@/components/ui/Button"

export default function JoinBanner() {
  return (
    <section className="container-content py-16">
      <div className="canopy-texture relative overflow-hidden rounded-2xl bg-gradient-to-br from-canopy to-canopy-700 px-8 py-12 text-center text-white shadow-elevated sm:px-12">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Be part of the change in your community
        </h2>
        {/* Was text-gray-200 — a cool grey reading as dirty against the warm
            canopy. White at reduced opacity keeps it in the same light. */}
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-white/75">
          Register as a member, volunteer for an Action Team, or stand to
          represent your community as a Parliament Member, Council Representative,
          or Community Intelligence Officer.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/join" variant="secondary" size="lg">
            Register as a member
          </Button>
          <Button href="/transparency" variant="light" size="lg">
            View our transparency portal
          </Button>
        </div>
      </div>
    </section>
  )
}

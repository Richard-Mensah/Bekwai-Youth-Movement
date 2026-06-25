import Button from "@/components/ui/Button"

export default function JoinBanner() {
  return (
    <section className="container-content py-16">
      <div className="overflow-hidden rounded-2xl bg-brand-green px-8 py-12 text-center text-white sm:px-12">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
          Be part of the change in your community
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-gray-200">
          Register as a member, volunteer for an Action Team, or stand to
          represent your community as a Parliament Member, Council Representative,
          or Community Intelligence Officer.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/join" variant="secondary" size="lg">
            Register as a member
          </Button>
          <Button
            href="/transparency"
            variant="outline"
            size="lg"
            className="border-white/40 text-white hover:bg-white/10"
          >
            View our transparency portal
          </Button>
        </div>
      </div>
    </section>
  )
}

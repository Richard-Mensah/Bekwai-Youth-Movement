import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProjectById, getExpenditures } from "@/lib/data/projects"
import { placeholderImage } from "@/lib/images"
import { PROJECT_STATUS_META, ghs } from "@/constants/projects"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import BudgetMeter from "@/components/features/projects/BudgetMeter"
import ProjectControls from "@/components/features/projects/ProjectControls"
import ExpenditureForm from "@/components/features/projects/ExpenditureForm"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  const expenditures = await getExpenditures(project.id)
  const meta = PROJECT_STATUS_META[project.status]
  const spent = expenditures.reduce((s, e) => s + e.amountGhs, 0)
  const spentTotal = spent || project.spentGhs

  return (
    <>
      <Link
        href="/dashboard/cabinet"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Back to Cabinet
      </Link>
      <DashboardHeading title={project.name} subtitle={project.communityName} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card>
            <div className="relative -mx-6 -mt-6 mb-4 h-44 w-[calc(100%+3rem)] overflow-hidden rounded-t-xl bg-gray-100">
              <Image
                src={placeholderImage(project.id, 800, 360)}
                alt={project.name}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={meta.tone}>{meta.label}</Badge>
              {project.unitName && (
                <span className="text-xs text-ink/55">{project.unitName}</span>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/65">
              {project.description ?? "No description provided."}
            </p>
            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/45">
                Lifecycle actions
              </p>
              <ProjectControls projectId={project.id} status={project.status} />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-canopy">Expenditure</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-ink/45">
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Payee</th>
                    <th className="py-2 pr-4 font-medium">Purpose</th>
                    <th className="py-2 pr-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenditures.map((e) => (
                    <tr key={e.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-ink/55">{formatDate(e.spentOn)}</td>
                      <td className="py-2 pr-4 text-gray-700">{e.payee}</td>
                      <td className="py-2 pr-4 text-ink/65">{e.purpose}</td>
                      <td className="py-2 pr-4 text-right font-medium text-gray-700">
                        {ghs(e.amountGhs)}
                      </td>
                    </tr>
                  ))}
                  {expenditures.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-xs text-ink/45">
                        No expenditure recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <ExpenditureForm projectId={project.id} />
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-sm font-bold text-canopy">Budget</h3>
          <div className="mt-4">
            <BudgetMeter budget={project.budgetGhs} spent={spentTotal} />
          </div>
        </Card>
      </div>
    </>
  )
}

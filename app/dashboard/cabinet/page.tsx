import { getProjects, projectStats, budgetByStatus } from "@/lib/data/projects"
import { ghs } from "@/constants/projects"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import ProjectBoard from "@/components/features/projects/ProjectBoard"
import BudgetChart from "@/components/features/projects/BudgetChart"
import ProjectForm from "@/components/features/projects/ProjectForm"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"

export default async function CabinetDashboard() {
  const projects = await getProjects()
  const stats = projectStats(projects)

  return (
    <>
      <DashboardHeading
        title="Executive Cabinet"
        subtitle="Portfolio projects, budgets, and KPIs"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active projects" value={stats.active} hint="In progress" />
        <StatCard label="Pipeline" value={stats.pipeline} hint="Proposed + approved" accent="blue" />
        <StatCard label="Completed" value={stats.completed} hint="Delivered" />
        <StatCard label="Budget utilised" value={`${stats.utilization}%`} hint={`${ghs(stats.totalSpent)} of ${ghs(stats.totalBudget)}`} accent="red" />
      </div>

      <div className="mt-6" id="projects">
        <Card>
          <h3 className="text-sm font-bold text-canopy">Project portfolio</h3>
          <p className="mt-1 text-xs text-ink/55">
            Click a project to open its budget, expenditure, and lifecycle.
          </p>
          <div className="mt-4">
            <ProjectBoard projects={projects} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <h3 className="text-sm font-bold text-canopy">
            Budget vs spend by status
          </h3>
          <div className="mt-3">
            <BudgetChart data={budgetByStatus(projects)} />
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold text-canopy">Propose a project</h3>
          <div className="mt-4">
            <ProjectForm />
          </div>
        </Card>
      </div>
    </>
  )
}

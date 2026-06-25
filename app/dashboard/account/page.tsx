import { getSessionProfile } from "@/lib/auth"
import { ROLE_META } from "@/constants/roles"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import ChangePasswordForm from "@/components/features/account/ChangePasswordForm"
import Card from "@/components/ui/Card"

export default async function AccountPage() {
  const session = await getSessionProfile()

  return (
    <>
      <DashboardHeading title="Account settings" subtitle="Manage your sign-in details" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-bold text-canopy">Profile</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/55">Name</dt>
              <dd className="font-medium text-gray-700">{session.fullName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">Email</dt>
              <dd className="font-medium text-gray-700">{session.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">Role</dt>
              <dd className="font-medium text-gray-700">{ROLE_META[session.role].label}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">Status</dt>
              <dd className="font-medium text-gray-700 capitalize">
                {session.verificationStatus}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-canopy">Change password</h3>
          <p className="mt-1 text-xs text-ink/55">
            Set a personal password to replace any temporary one.
          </p>
          <div className="mt-4">
            <ChangePasswordForm />
          </div>
        </Card>
      </div>
    </>
  )
}

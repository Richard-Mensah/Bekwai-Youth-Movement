import { Info } from "lucide-react"

/** Shown when Supabase env keys are still placeholders. */
export default function AuthNotice() {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
      <Info size={16} className="mt-0.5 shrink-0" />
      <p>
        Authentication is not yet connected. Add your Supabase keys to{" "}
        <code className="font-mono">.env.local</code> to enable sign up and sign
        in. The form is disabled until then.
      </p>
    </div>
  )
}

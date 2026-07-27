import { Info } from "lucide-react"

/** Shown when Supabase env keys are still placeholders. */
export default function AuthNotice() {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-xl border border-gold-200 bg-gold-50 p-3 text-xs text-gold-700 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200">
      <Info size={16} className="mt-0.5 shrink-0" />
      <p>
        Authentication is not yet connected. Add your Supabase keys to{" "}
        <code className="font-mono">.env.local</code> to enable sign up and sign
        in. The form is disabled until then.
      </p>
    </div>
  )
}

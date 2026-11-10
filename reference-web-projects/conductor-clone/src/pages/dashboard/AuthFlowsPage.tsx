export default function AuthFlowsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Auth Flows</h1><p className="mt-1 text-sm text-muted-foreground">Manage authentication flows for end-users.</p></div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold">Default Auth Flow</h3>
        <p className="mt-2 text-sm text-muted-foreground">Interactive auth flow for end-users to connect their QuickBooks Desktop.</p>
        <div className="mt-4 rounded-md border p-4 font-mono text-xs">
          <p className="text-muted-foreground">Auth Session URL:</p>
          <p className="mt-1">https://connect.conductor.is/auth?session=sess_abc123</p>
        </div>
      </div>
    </div>
  );
}

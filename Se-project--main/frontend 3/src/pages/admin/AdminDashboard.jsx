export default function AdminDashboard() {
  const actions = [
    {
      title: "Add Subject",
      description: "Create new subjects and configure maximum allowed leaves.",
      cta: "Create Subject",
      href: "/admin/add-subject",
    },
    {
      title: "Assign Teacher",
      description: "Map available teachers to specific subjects or batches.",
      cta: "Assign Now",
      href: "/admin/assign-teacher",
    },
    {
      title: "View Subjects",
      description: "Review the full catalog with current ownership at a glance.",
      cta: "Open Directory",
      href: "/admin/view-subjects",
    },
    {
      title: "Add Teacher",
      description: "Onboard new faculty members with secure credentials.",
      cta: "Add Teacher",
      href: "/admin/add-teacher",
    },
  ];

  return (
    <div className="page-center">
      <div className="main-card">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Admin Console</p>
            <h1 className="page-title">Control Center</h1>
            <p className="text-muted">Manage subjects, teachers, and assignments in one place.</p>
          </div>
        </header>

        <div className="grid admin-action-grid">
          {actions.map((action) => (
            <div className="widget" key={action.title}>
              <h3>{action.title}</h3>
              <p className="text-muted" style={{ margin: "10px 0 16px" }}>
                {action.description}
              </p>
              <button className="main-btn" onClick={() => (window.location.href = action.href)}>
                {action.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

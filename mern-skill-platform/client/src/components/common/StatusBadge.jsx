export default function StatusBadge({ status }) {
  const map = {
    Verified:           'badge-verified',
    Approved:           'badge-verified',
    Pending:            'badge-pending',
    Rejected:           'badge-rejected',
    'Needs Improvement':'badge-improve',
  }
  return <span className={map[status] || 'badge-pending'}>{status}</span>
}

"use client"
import { Activity } from "lucide-react"

// Mock activity data
const mockActivities = [
  {
    id: "1",
    test: "Complete Blood Count (CBC)",
    date: "2025-01-10",
    status: "Completed",
    statusColor: "bg-blue-100 text-blue-700",
    flag: "Normal",
  },
  {
    id: "2",
    test: "Lipid Panel",
    date: "2025-01-08",
    status: "Completed",
    statusColor: "bg-blue-100 text-blue-700",
    flag: "Normal",
  },
  {
    id: "3",
    test: "Thyroid Function Test",
    date: "2025-01-05",
    status: "In Progress",
    statusColor: "bg-amber-100 text-amber-700",
  },
]

export default function RecentActivity() {
  // const dispatch = useDispatch()
  // const { activities, loading } = useSelector(state => state.activities)
  // useEffect(() => {
  //   dispatch(fetchActivitiesRequest())
  // }, [])

  return (
    <div className="bg-white rounded-lg border border-border p-6 lg:col-span-2">
      <h3 className="text-lg font-semibold text-foreground mb-2">Recent Activity</h3>
      <p className="text-sm text-muted-foreground mb-4">Latest test orders and results</p>

      <div className="space-y-3">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg hover:bg-muted/80">
            <Activity className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.test}</p>
              <p className="text-xs text-muted-foreground">{activity.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs font-medium rounded ${activity.statusColor}`}>{activity.status}</span>
              {activity.flag && <span className="text-xs text-muted-foreground">{activity.flag}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

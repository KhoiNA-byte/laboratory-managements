"use client"
import { FileText, Clock, Calendar } from "lucide-react"

// Mock stats data
const mockStats = [
  {
    id: "1",
    label: "Total Tests",
    value: "24",
    subtext: "All time",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    id: "2",
    label: "Pending",
    value: "1",
    subtext: "In progress",
    icon: Clock,
    color: "text-amber-500",
  },
  {
    id: "3",
    label: "Last Visit",
    value: "3d",
    subtext: "ago",
    icon: Calendar,
    color: "text-green-500",
  },
]

export default function ProfileStats() {
  // const dispatch = useDispatch()
  // const { stats, loading } = useSelector(state => state.stats)
  // useEffect(() => {
  //   dispatch(fetchStatsRequest())
  // }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {mockStats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.id} className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
          </div>
        )
      })}
    </div>
  )
}

"use client"
import { Phone, Mail, MapPin } from "lucide-react"

// Mock user data - replace with actual Redux selector
const mockUser = {
  name: "John Doe",
  mrn: "MRN-2024-001",
  avatar: "JD",
  age: 40,
  gender: "male",
  dob: "15/3/1985",
  phone: "+1 (555) 123-4567",
  email: "john.doe@email.com",
  address: "123 Main St, New York, NY 10001",
}

export default function ProfileInfo() {
  // const dispatch = useDispatch()
  // const { user, loading } = useSelector(state => state.users)
  // useEffect(() => {
  //   dispatch(fetchUserRequest())
  // }, [])

  return (
    <div className="bg-white rounded-lg border border-border p-6 lg:col-span-1">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold mb-4">
          {mockUser.avatar}
        </div>
        <h2 className="text-xl font-semibold text-foreground">{mockUser.name}</h2>
        <p className="text-sm text-muted-foreground mb-6">{mockUser.mrn}</p>

        <div className="w-full space-y-4 text-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="text-muted-foreground font-medium w-24">Age / Gender</span>
            <span className="text-foreground">
              {mockUser.age} years / {mockUser.gender}
            </span>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="text-muted-foreground font-medium w-24">Date of Birth</span>
            <span className="text-foreground">{mockUser.dob}</span>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground">{mockUser.phone}</span>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground">{mockUser.email}</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span className="text-foreground">{mockUser.address}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

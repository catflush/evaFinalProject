const events = [
  {
    id: 1,
    title: "Team Meeting",
    startTime: "09:00",
    endTime: "10:00",
    color: "bg-blue-500",
    day: 1,
    description: "Weekly team sync-up",
    location: "Conference Room A",
    attendees: ["John Doe", "Jane Smith", "Bob Johnson"],
    organizer: "Alice Brown",
  },
  {
    id: 2,
    title: "Lunch with Sarah",
    startTime: "12:30",
    endTime: "13:30",
    color: "bg-green-500",
    day: 1,
    description: "Discuss project timeline",
    location: "Cafe Nero",
    attendees: ["Sarah Lee"],
    organizer: "You",
  },
  {
    id: 3,
    title: "Project Review",
    startTime: "14:00",
    endTime: "15:30",
    color: "bg-purple-500",
    day: 3,
    description: "Q2 project progress review",
    location: "Meeting Room 3",
    attendees: ["Team Alpha", "Stakeholders"],
    organizer: "Project Manager",
  },
  {
    id: 4,
    title: "Client Call",
    startTime: "10:00",
    endTime: "11:00",
    color: "bg-yellow-500",
    day: 2,
    description: "Quarterly review with major client",
    location: "Zoom Meeting",
    attendees: ["Client Team", "Sales Team"],
    organizer: "Account Manager",
  },
  {
    id: 5,
    title: "Team Brainstorm",
    startTime: "13:00",
    endTime: "14:30",
    color: "bg-indigo-500",
    day: 4,
    description: "Ideation session for new product features",
    location: "Creative Space",
    attendees: ["Product Team", "Design Team"],
    organizer: "Product Owner",
  },
  {
    id: 6,
    title: "Product Demo",
    startTime: "11:00",
    endTime: "12:00",
    color: "bg-pink-500",
    day: 5,
    description: "Showcase new features to stakeholders",
    location: "Demo Room",
    attendees: ["Stakeholders", "Dev Team"],
    organizer: "Tech Lead",
  },
  {
    id: 7,
    title: "Marketing Meeting",
    startTime: "13:00",
    endTime: "14:00",
    color: "bg-teal-500",
    day: 6,
    description: "Discuss Q3 marketing strategy",
    location: "Marketing Office",
    attendees: ["Marketing Team"],
    organizer: "Marketing Director",
  },
  {
    id: 8,
    title: "Code Review",
    startTime: "15:00",
    endTime: "16:00",
    color: "bg-cyan-500",
    day: 7,
    description: "Review pull requests for new feature",
    location: "Dev Area",
    attendees: ["Dev Team"],
    organizer: "Senior Developer",
  },
  {
    id: 9,
    title: "Morning Standup",
    startTime: "08:30",
    endTime: "09:30", // Changed from "09:00" to "09:30"
    color: "bg-blue-400",
    day: 2,
    description: "Daily team standup",
    location: "Slack Huddle",
    attendees: ["Development Team"],
    organizer: "Scrum Master",
  },
  {
    id: 10,
    title: "Design Review",
    startTime: "14:30",
    endTime: "15:45",
    color: "bg-purple-400",
    day: 5,
    description: "Review new UI designs",
    location: "Design Lab",
    attendees: ["UX Team", "Product Manager"],
    organizer: "Lead Designer",
  },
  {
    id: 11,
    title: "Investor Meeting",
    startTime: "10:30",
    endTime: "12:00",
    color: "bg-red-400",
    day: 7,
    description: "Quarterly investor update",
    location: "Board Room",
    attendees: ["Executive Team", "Investors"],
    organizer: "CEO",
  },
  {
    id: 12,
    title: "Team Training",
    startTime: "09:30",
    endTime: "11:30",
    color: "bg-green-400",
    day: 4,
    description: "New tool onboarding session",
    location: "Training Room",
    attendees: ["All Departments"],
    organizer: "HR",
  },
  {
    id: 13,
    title: "Budget Review",
    startTime: "13:30",
    endTime: "15:00",
    color: "bg-yellow-400",
    day: 3,
    description: "Quarterly budget analysis",
    location: "Finance Office",
    attendees: ["Finance Team", "Department Heads"],
    organizer: "CFO",
  },
  {
    id: 14,
    title: "Client Presentation",
    startTime: "11:00",
    endTime: "12:30",
    color: "bg-orange-400",
    day: 6,
    description: "Present new project proposal",
    location: "Client Office",
    attendees: ["Sales Team", "Client Representatives"],
    organizer: "Account Executive",
  },
  {
    id: 15,
    title: "Product Planning",
    startTime: "14:00",
    endTime: "15:30",
    color: "bg-pink-400",
    day: 1,
    description: "Roadmap discussion for Q3",
    location: "Strategy Room",
    attendees: ["Product Team", "Engineering Leads"],
    organizer: "Product Manager",
  },
];

export default events;

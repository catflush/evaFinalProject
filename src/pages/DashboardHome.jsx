import { useState } from "react";
import { FaChartBar, FaUsers, FaCalendarCheck, FaEnvelope } from "react-icons/fa";

const DashboardHome = () => {
  const [recentActivity] = useState([
    { id: 1, type: "login", message: "You logged in from a new device", time: "2 hours ago" },
    { id: 2, type: "profile", message: "You updated your profile information", time: "1 day ago" },
    { id: 3, type: "booking", message: "New booking confirmed for next week", time: "2 days ago" },
    { id: 4, type: "message", message: "You received a new message from John", time: "3 days ago" },
  ]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-8">
                      {activity.type === "login" && <FaUsers className="h-4 w-4" />}
                      {activity.type === "profile" && <FaUsers className="h-4 w-4" />}
                      {activity.type === "booking" && <FaCalendarCheck className="h-4 w-4" />}
                      {activity.type === "message" && <FaEnvelope className="h-4 w-4" />}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-base-content/70">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Quick Stats</h3>
            <div className="stats stats-vertical shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <FaChartBar className="h-6 w-6" />
                </div>
                <div className="stat-title">Total Bookings</div>
                <div className="stat-value">31</div>
                <div className="stat-desc">↗︎ 12% more than last month</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaUsers className="h-6 w-6" />
                </div>
                <div className="stat-title">Active Users</div>
                <div className="stat-value">2,100</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaEnvelope className="h-6 w-6" />
                </div>
                <div className="stat-title">Unread Messages</div>
                <div className="stat-value">3</div>
                <div className="stat-desc">↘︎ 2 less than yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body">
          <h3 className="card-title">Upcoming Events</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Team Meeting</td>
                  <td>Apr 10, 2023</td>
                  <td>10:00 AM</td>
                  <td>Conference Room A</td>
                  <td><span className="badge badge-success">Confirmed</span></td>
                </tr>
                <tr>
                  <td>Client Presentation</td>
                  <td>Apr 12, 2023</td>
                  <td>2:00 PM</td>
                  <td>Virtual</td>
                  <td><span className="badge badge-warning">Pending</span></td>
                </tr>
                <tr>
                  <td>Project Deadline</td>
                  <td>Apr 15, 2023</td>
                  <td>5:00 PM</td>
                  <td>N/A</td>
                  <td><span className="badge badge-error">Urgent</span></td>
                </tr>
                <tr>
                  <td>Training Session</td>
                  <td>Apr 18, 2023</td>
                  <td>11:00 AM</td>
                  <td>Training Room</td>
                  <td><span className="badge badge-success">Confirmed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 
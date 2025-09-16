import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit } from "lucide-react";

const recentEvents = [
  {
    id: "TR001",
    date: "2024-01-15",
    employee: "John Smith",
    topic: "React Fundamentals",
    trainer: "Sarah Wilson",
    mode: "Online",
    status: "scheduled"
  },
  {
    id: "TR002", 
    date: "2024-01-16",
    employee: "Emily Johnson",
    topic: "TypeScript Basics",
    trainer: "Mike Davis",
    mode: "Hybrid",
    status: "in-progress"
  },
  {
    id: "TR003",
    date: "2024-01-17",
    employee: "David Brown",
    topic: "Advanced JavaScript",
    trainer: "Lisa Garcia",
    mode: "Offline",
    status: "completed"
  },
  {
    id: "TR004",
    date: "2024-01-18",
    employee: "Maria Rodriguez",
    topic: "Database Design",
    trainer: "Tom Anderson",
    mode: "Online",
    status: "scheduled"
  },
  {
    id: "TR005",
    date: "2024-01-19",
    employee: "James Wilson",
    topic: "API Development",
    trainer: "Anna Taylor",
    mode: "Hybrid",
    status: "pending-approval"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
    case "in-progress":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>;
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    case "pending-approval":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pending Approval</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getModeBadge = (mode: string) => {
  switch (mode) {
    case "Online":
      return <Badge variant="outline" className="border-blue-300 text-blue-700">Online</Badge>;
    case "Offline":
      return <Badge variant="outline" className="border-green-300 text-green-700">Offline</Badge>;
    case "Hybrid":
      return <Badge variant="outline" className="border-purple-300 text-purple-700">Hybrid</Badge>;
    default:
      return <Badge variant="outline">{mode}</Badge>;
  }
};

export function RecentEvents() {
  return (
    <Card className="ps-card-elevated">
      <CardHeader className="pb-4">
        <CardTitle className="heading-secondary flex items-center justify-between">
          Recent / Upcoming Training Events
          <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="font-semibold text-foreground">Date</TableHead>
                <TableHead className="font-semibold text-foreground">Employee</TableHead>
                <TableHead className="font-semibold text-foreground">Topic</TableHead>
                <TableHead className="font-semibold text-foreground">Trainer</TableHead>
                <TableHead className="font-semibold text-foreground">Mode</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-accent/50 ps-transition">
                  <TableCell className="font-medium">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>{event.employee}</TableCell>
                  <TableCell className="max-w-48 truncate">{event.topic}</TableCell>
                  <TableCell>{event.trainer}</TableCell>
                  <TableCell>
                    {getModeBadge(event.mode)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(event.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
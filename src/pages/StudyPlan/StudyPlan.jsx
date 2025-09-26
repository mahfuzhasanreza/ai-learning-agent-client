import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  ListTodo,
  ClipboardList,
  BookOpenText,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Link as LinkIcon,
  Upload,
  Trash2,
} from "lucide-react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * STUDY PLAN — Single-file demo UI
 *
 * Matches the user's spec:
 * - Topbar with dropdown: Add Task, Add Assignment, Add CT's Date
 * - Calendar-style visualization of deadlines + pending items
 * - Search/filter across Tasks, Assignments, CTs
 * - Cards list with mark-as-done
 * - "Completed" view (another page) accessible via button/tabs
 * - File uploads captured locally and displayed by filename
 *
 * Data is kept in component state and also mirrored to localStorage for demo persistence.
 */

const seedNow = new Date();
const yyyyMmDd = (d) => d.toISOString().slice(0, 10);

const sampleData = {
  tasks: [
    {
      id: crypto.randomUUID(),
      title: "Read Chapter 3",
      description: "Focus on dynamic programming intro.",
      deadline: yyyyMmDd(new Date(seedNow.getFullYear(), seedNow.getMonth(), Math.min(10, 28))),
      links: ["https://example.com/ch3"],
      files: [],
      done: false,
      type: "task",
      createdAt: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      title: "Group meeting",
      description: "Plan assignment outline.",
      deadline: yyyyMmDd(new Date(seedNow.getFullYear(), seedNow.getMonth(), Math.min(15, 28))),
      links: [],
      files: [],
      done: false,
      type: "task",
      createdAt: Date.now(),
    },
  ],
  assignments: [
    {
      id: crypto.randomUUID(),
      title: "DSA Assignment 1",
      description: "Implement stack & queue.",
      deadline: yyyyMmDd(new Date(seedNow.getFullYear(), seedNow.getMonth(), Math.min(18, 28))),
      question: "Implement Stack & Queue using arrays.",
      files: ["Slides Week 2.pdf"],
      done: false,
      type: "assignment",
      createdAt: Date.now(),
    },
  ],
  cts: [
    {
      id: crypto.randomUUID(),
      courseName: "CSE 2201",
      ctNo: "CT-2",
      syllabus: "Ch 1–3, recursion basics",
      date: yyyyMmDd(new Date(seedNow.getFullYear(), seedNow.getMonth(), Math.min(22, 28))),
      time: "10:30",
      done: false,
      type: "ct",
      createdAt: Date.now(),
    },
  ],
};

function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

function dayKey(d) {
  return yyyyMmDd(d);
}

function withinMonth(dateStr, year, month) {
  const d = new Date(dateStr);
  return d.getFullYear() === year && d.getMonth() === month;
}

function groupByDate(items) {
  return items.reduce((acc, item) => {
    const dateStr = item.type === "ct" ? item.date : item.deadline;
    if (!dateStr) return acc;
    acc[dateStr] = acc[dateStr] || [];
    acc[dateStr].push(item);
    return acc;
  }, {});
}

function CalendarGrid({ year, month, itemsByDate, onPickDate }) {
  const firstDay = new Date(year, month, 1);
  const startDay = new Date(year, month, 1 - ((firstDay.getDay() + 6) % 7)); // start Monday
  const weeks = [];
  let current = new Date(startDay);
  for (let w = 0; w < 6; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const key = dayKey(current);
      const inMonth = current.getMonth() === month;
      const items = itemsByDate[key] || [];
      const hasPending = items.some((i) => !i.done);
      days.push(
        <button
          key={key}
          onClick={() => onPickDate(key)}
          className={`group relative flex h-24 w-full flex-col items-start justify-start rounded-2xl border ${
            inMonth ? "bg-white" : "bg-muted/40"
          } p-2 text-left shadow-sm transition hover:shadow-md`}
        >
          <div className="flex w-full items-center justify-between">
            <span className={`text-sm ${inMonth ? "" : "text-muted-foreground"}`}>
              {current.getDate()}
            </span>
            {items.length > 0 && (
              <Badge className="rounded-full px-2 py-0 text-[10px]" variant={hasPending ? "default" : "secondary"}>
                {items.length}
              </Badge>
            )}
          </div>
          <div className="mt-2 flex w-full flex-wrap gap-1">
            {items.slice(0, 3).map((i) => (
              <span
                key={i.id}
                className={`inline-flex items-center gap-1 rounded-full border px-2 text-[10px] ${
                  i.type === "task"
                    ? ""
                    : i.type === "assignment"
                    ? ""
                    : ""
                }`}
              >
                {i.type === "task" && <ListTodo className="h-3 w-3" />}
                {i.type === "assignment" && <ClipboardList className="h-3 w-3" />}
                {i.type === "ct" && <BookOpenText className="h-3 w-3" />}
                {i.type === "ct" ? i.ctNo : i.title?.slice(0, 10) || "Item"}
              </span>
            ))}
          </div>
        </button>
      );
      current.setDate(current.getDate() + 1);
    }
    weeks.push(
      <div key={w} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="flex flex-col gap-2">{weeks}</div>
    </div>
  );
}

function AddTaskDialog({ open, setOpen, onAdd }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [links, setLinks] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);

  const submit = () => {
    if (!title || !deadline) return;
    onAdd({
      id: crypto.randomUUID(),
      title,
      description: desc,
      deadline,
      links: links
        .split(/\s|,|;\s*/)
        .map((s) => s.trim())
        .filter(Boolean),
      files: Array.from(files).map((f) => f.name),
      done: false,
      type: "task",
      createdAt: Date.now(),
    });
    setOpen(false);
    setTitle("");
    setDeadline("");
    setLinks("");
    setDesc("");
    setFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Task title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Revise lecture 5" />
          </div>
          <div className="grid gap-2">
            <Label>Deadline</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Necessary links</Label>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <Input value={links} onChange={(e) => setLinks(e.target.value)} placeholder="Paste links, separated by space or comma" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Short description</Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional context" />
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload file (pdf, picture)</Label>
            <Input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
            {files && files.length > 0 && (
              <div className="text-xs text-muted-foreground">{Array.from(files).map((f) => f.name).join(", ")}</div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddAssignmentDialog({ open, setOpen, onAdd }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [question, setQuestion] = useState("");
  const [files, setFiles] = useState([]);

  const submit = () => {
    if (!title || !deadline) return;
    onAdd({
      id: crypto.randomUUID(),
      title,
      description: "",
      deadline,
      question,
      files: Array.from(files).map((f) => f.name),
      done: false,
      type: "assignment",
      createdAt: Date.now(),
    });
    setOpen(false);
    setTitle("");
    setDeadline("");
    setQuestion("");
    setFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Assignment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., OOP Assignment 2" />
          </div>
          <div className="grid gap-2">
            <Label>Deadline</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Assignment question</Label>
            <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Paste or write the question" />
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center gap-2"><Upload className="h-4 w-4" /> Add multiple files (Class notes, Slides)</Label>
            <Input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
            {files && files.length > 0 && (
              <div className="text-xs text-muted-foreground">{Array.from(files).map((f) => f.name).join(", ")}</div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddCTDialog({ open, setOpen, onAdd }) {
  const [course, setCourse] = useState("");
  const [ctNo, setCtNo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [syllabus, setSyllabus] = useState("");

  const submit = () => {
    if (!course || !ctNo || !date) return;
    onAdd({
      id: crypto.randomUUID(),
      courseName: course,
      ctNo,
      date,
      time,
      syllabus,
      done: false,
      type: "ct",
      createdAt: Date.now(),
    });
    setOpen(false);
    setCourse("");
    setCtNo("");
    setDate("");
    setTime("");
    setSyllabus("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add CT's Date</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Course name</Label>
            <Input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g., CSE 2201" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>CT No</Label>
              <Input value={ctNo} onChange={(e) => setCtNo(e.target.value)} placeholder="CT 2/3" />
            </div>
            <div className="grid gap-2">
              <Label>CT date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Syllabus</Label>
            <Textarea value={syllabus} onChange={(e) => setSyllabus(e.target.value)} placeholder="Topics to study" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ItemCard({ item, onToggleDone, onDelete }) {
  const isCT = item.type === "ct";
  const deadline = isCT ? item.date : item.deadline;
  const overdue = !item.done && deadline && new Date(deadline) < new Date(new Date().toDateString());
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              {item.type === "task" && <ListTodo className="h-5 w-5" />}
              {item.type === "assignment" && <ClipboardList className="h-5 w-5" />}
              {item.type === "ct" && <BookOpenText className="h-5 w-5" />}            
              <CardTitle className="text-lg">
                {isCT ? `${item.courseName} • ${item.ctNo}` : item.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {overdue && <Badge variant="destructive">Overdue</Badge>}
              {item.done ? (
                <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Done</Badge>
              ) : (
                <Badge variant="default">Pending</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-1"><CalendarIcon className="h-4 w-4" /> {deadline || "—"}</div>
            {isCT && item.time && <div className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {item.time}</div>}
          </div>
          {isCT ? (
            <p className="text-sm">Syllabus: {item.syllabus || "—"}</p>
          ) : (
            <p className="text-sm">{item.description || ""}</p>
          )}
          {item.links && item.links.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {item.links.map((l, idx) => (
                <a key={idx} href={l} target="_blank" rel="noreferrer" className="rounded-full border px-2 py-1 underline">
                  {l}
                </a>
              ))}
            </div>
          )}
          {item.files && item.files.length > 0 && (
            <div className="text-xs text-muted-foreground">Files: {item.files.join(", ")}</div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button size="sm" variant={item.done ? "secondary" : "default"} onClick={() => onToggleDone(item)} className="rounded-xl">
              <CheckCircle2 className="mr-2 h-4 w-4" /> {item.done ? "Mark as Undone" : "Mark as Done"}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(item)}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function StudyPlanUI() {
  const [data, setData] = useLocalState("study-plan-data", sampleData);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all | task | assignment | ct
  const [view, setView] = useState("active"); // active | completed
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [openTask, setOpenTask] = useState(false);
  const [openAssignment, setOpenAssignment] = useState(false);
  const [openCT, setOpenCT] = useState(false);

  const allItems = useMemo(() => {
    const t = data.tasks.map((t) => ({ ...t, type: "task" }));
    const a = data.assignments.map((a) => ({ ...a, type: "assignment" }));
    const c = data.cts.map((c) => ({ ...c, type: "ct" }));
    return [...t, ...a, ...c].sort((x, y) => (x.createdAt || 0) - (y.createdAt || 0));
  }, [data]);

  const itemsByDate = useMemo(() => groupByDate(allItems), [allItems]);

  const pendingCount = allItems.filter((i) => !i.done).length;

  const filtered = useMemo(() => {
    return allItems
      .filter((i) => (view === "active" ? !i.done : i.done))
      .filter((i) => (typeFilter === "all" ? true : i.type === typeFilter))
      .filter((i) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        if (i.type === "ct") {
          return (
            i.courseName?.toLowerCase().includes(q) ||
            i.ctNo?.toLowerCase().includes(q) ||
            i.syllabus?.toLowerCase().includes(q)
          );
        }
        return (
          i.title?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          (Array.isArray(i.links) && i.links.some((l) => l.toLowerCase().includes(q)))
        );
      })
      .sort((a, b) => {
        const da = a.type === "ct" ? a.date : a.deadline;
        const db = b.type === "ct" ? b.date : b.deadline;
        return (da || "") > (db || "") ? 1 : -1;
      });
  }, [allItems, view, typeFilter, search]);

  const monthItems = useMemo(() => allItems.filter((i) => {
    const d = i.type === "ct" ? i.date : i.deadline;
    return d && withinMonth(d, year, month);
  }), [allItems, year, month]);

  const monthPending = monthItems.filter((i) => !i.done).length;

  function addTask(newTask) {
    setData((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  }
  function addAssignment(newAssignment) {
    setData((prev) => ({ ...prev, assignments: [newAssignment, ...prev.assignments] }));
  }
  function addCT(newCT) {
    setData((prev) => ({ ...prev, cts: [newCT, ...prev.cts] }));
  }

  function toggleDone(item) {
    setData((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const listKey = item.type === "task" ? "tasks" : item.type === "assignment" ? "assignments" : "cts";
      clone[listKey] = clone[listKey].map((x) => (x.id === item.id ? { ...x, done: !x.done } : x));
      return clone;
    });
  }

  function deleteItem(item) {
    setData((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const listKey = item.type === "task" ? "tasks" : item.type === "assignment" ? "assignments" : "cts";
      clone[listKey] = clone[listKey].filter((x) => x.id !== item.id);
      return clone;
    });
  }

  function gotoPrevMonth() {
    const d = new Date(year, month - 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }
  function gotoNextMonth() {
    const d = new Date(year, month + 1, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function handlePickDate(dateStr) {
    setSearch(dateStr); // quick filter by date
  }

  const headerTitle = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      {/* Topbar */}
      <div className="mx-auto mb-6 flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center rounded-2xl bg-white p-3 shadow-sm">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold leading-none">Study Plan</h1>
            <p className="text-sm text-muted-foreground">Track Tasks • Assignments • CTs</p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-sm">
            <Search className="ml-1 h-4 w-4" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, course, date (YYYY-MM-DD), link…"
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="flex gap-2">
            <div className="rounded-2xl bg-white p-1 shadow-sm">
              <Tabs value={view} onValueChange={setView} className="w-full">
                <TabsList className="grid grid-cols-2 rounded-2xl">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-2xl shadow-sm" size="lg">
                  <Plus className="mr-2 h-5 w-5" /> Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl">
                <DropdownMenuLabel>Add new</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpenTask(true)} className="gap-2">
                  <ListTodo className="h-4 w-4" /> Add Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenAssignment(true)} className="gap-2">
                  <ClipboardList className="h-4 w-4" /> Add Assignment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenCT(true)} className="gap-2">
                  <BookOpenText className="h-4 w-4" /> Add CT's Date
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Counts & filters */}
      <div className="mx-auto mb-6 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3 pt-0">
            <Badge className="rounded-xl">{monthItems.length} items</Badge>
            <Badge variant="secondary" className="rounded-xl">{monthPending} pending</Badge>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">All</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3 pt-0">
            <Badge className="rounded-xl">{allItems.length} total</Badge>
            <Badge variant="secondary" className="rounded-xl">{pendingCount} pending</Badge>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Filter Type</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 pt-0">
            <Button variant={typeFilter === "all" ? "default" : "secondary"} className="rounded-xl" size="sm" onClick={() => setTypeFilter("all")}>All</Button>
            <Button variant={typeFilter === "task" ? "default" : "secondary"} className="rounded-xl" size="sm" onClick={() => setTypeFilter("task")}><ListTodo className="mr-1 h-4 w-4" /> Task</Button>
            <Button variant={typeFilter === "assignment" ? "default" : "secondary"} className="rounded-xl" size="sm" onClick={() => setTypeFilter("assignment")}><ClipboardList className="mr-1 h-4 w-4" /> Assignment</Button>
            <Button variant={typeFilter === "ct" ? "default" : "secondary"} className="rounded-xl" size="sm" onClick={() => setTypeFilter("ct")}><BookOpenText className="mr-1 h-4 w-4" /> CT</Button>
          </CardContent>
        </Card>
      </div>

      {/* Calendar + List */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={gotoPrevMonth} className="rounded-xl"><ChevronLeft className="h-5 w-5" /></Button>
              <h2 className="text-lg font-medium">{headerTitle}</h2>
              <Button variant="ghost" size="icon" onClick={gotoNextMonth} className="rounded-xl"><ChevronRight className="h-5 w-5" /></Button>
            </div>
            <div className="text-sm text-muted-foreground">Click a date to filter</div>
          </div>
          <CalendarGrid
            year={year}
            month={month}
            itemsByDate={itemsByDate}
            onPickDate={handlePickDate}
          />
        </div>
        <div className="lg:col-span-3">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{view === "active" ? "Pending Items" : "Completed Items"}</CardTitle>
                {search && (
                  <Badge variant="secondary" className="rounded-xl">Filtered by: {search}</Badge>
                )}
              </div>
              {search && (
                <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setSearch("")}>Clear filter</Button>
              )}
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[560px] p-4">
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid place-items-center py-20 text-center text-sm text-muted-foreground"
                    >
                      No items match your filters. Try adding something from the <strong className="mx-1">Add</strong> menu.
                    </motion.div>
                  )}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {filtered.map((item) => (
                      <ItemCard key={item.id} item={item} onToggleDone={toggleDone} onDelete={deleteItem} />
                    ))}
                  </div>
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AddTaskDialog open={openTask} setOpen={setOpenTask} onAdd={addTask} />
      <AddAssignmentDialog open={openAssignment} setOpen={setOpenAssignment} onAdd={addAssignment} />
      <AddCTDialog open={openCT} setOpen={setOpenCT} onAdd={addCT} />

      <div className="mx-auto mt-8 max-w-6xl text-center text-xs text-muted-foreground">
        Tip: Use the search box to filter by <em>YYYY-MM-DD</em> date, course name, title, link, or syllabus keywords.
      </div>
    </div>
  );
}

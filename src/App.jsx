import { useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/pages/Dashboard";
import { TicketList } from "@/pages/TicketList";
import { TicketDetail } from "@/pages/TicketDetail";
import { TicketFormDialog } from "@/components/TicketFormDialog";
import { useTickets } from "@/hooks/useTickets";
import { useTheme } from "@/hooks/useTheme";
import { OPEN_STATUSES } from "@/lib/constants";

export default function App() {
  const { tickets, createTicket, updateTicket, addComment, deleteTicket } =
    useTickets();
  const { theme, toggle } = useTheme();

  const [view, setView] = useState("dashboard");
  const [activeId, setActiveId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const activeTicket = useMemo(
    () => tickets.find((t) => t.id === activeId) || null,
    [tickets, activeId]
  );

  const openCount = useMemo(
    () => tickets.filter((t) => OPEN_STATUSES.includes(t.status)).length,
    [tickets]
  );

  const openTicket = (id) => {
    setActiveId(id);
    setView("detail");
  };

  const navigate = (key) => {
    if (key === "new") {
      setFormOpen(true);
      return;
    }
    setActiveId(null);
    setView(key);
  };

  const sidebarView =
    view === "detail" ? "tickets" : view;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        view={sidebarView}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggle}
        openCount={openCount}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {view === "dashboard" && (
            <Dashboard tickets={tickets} onOpenTicket={openTicket} />
          )}
          {view === "tickets" && (
            <TicketList
              tickets={tickets}
              onOpenTicket={openTicket}
              onNew={() => setFormOpen(true)}
            />
          )}
          {view === "detail" && activeTicket && (
            <TicketDetail
              ticket={activeTicket}
              onBack={() => navigate("tickets")}
              onUpdate={updateTicket}
              onAddComment={addComment}
              onDelete={deleteTicket}
            />
          )}
          {view === "detail" && !activeTicket && (
            <div className="py-20 text-center text-muted-foreground">
              <p>This ticket no longer exists.</p>
            </div>
          )}
        </div>
      </main>

      <TicketFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onCreate={(data) => {
          createTicket(data);
          setView("tickets");
        }}
      />
    </div>
  );
}

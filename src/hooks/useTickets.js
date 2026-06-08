import { useCallback, useEffect, useState } from "react";
import { SEED_TICKETS, nextTicketNumber } from "@/lib/seed";

const STORAGE_KEY = "itsm-desk.tickets.v1";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore */
  }
  return SEED_TICKETS;
}

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function useTickets() {
  const [tickets, setTickets] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
      /* ignore */
    }
  }, [tickets]);

  const createTicket = useCallback((data) => {
    setTickets((prev) => {
      const id = nextTicketNumber(prev);
      const ts = new Date().toISOString();
      const ticket = {
        id,
        title: data.title,
        description: data.description || "",
        category: data.category,
        priority: data.priority,
        status: data.status || "Open",
        assignee: data.assignee || "Unassigned",
        requester: data.requester,
        createdAt: ts,
        updatedAt: ts,
        activity: [
          { id: uid(), type: "created", text: "Ticket created", at: ts },
        ],
      };
      return [ticket, ...prev];
    });
  }, []);

  const updateTicket = useCallback((id, patch, activityEntries = []) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const ts = new Date().toISOString();
        const stamped = activityEntries.map((e) => ({
          id: uid(),
          at: ts,
          ...e,
        }));
        return {
          ...t,
          ...patch,
          updatedAt: ts,
          activity: [...t.activity, ...stamped],
        };
      })
    );
  }, []);

  const addComment = useCallback((id, text, author) => {
    if (!text.trim()) return;
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const ts = new Date().toISOString();
        return {
          ...t,
          updatedAt: ts,
          activity: [
            ...t.activity,
            { id: uid(), type: "comment", text, author, at: ts },
          ],
        };
      })
    );
  }, []);

  const deleteTicket = useCallback((id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tickets, createTicket, updateTicket, addComment, deleteTicket };
}

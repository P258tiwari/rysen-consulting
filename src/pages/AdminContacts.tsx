import { useEffect, useMemo, useState } from "react";
import { Inbox, Mail, Phone, Save, Search, Trash2 } from "lucide-react";
import { Seo } from "../components/Seo";
import { deleteContactEntry, getContactEntries, updateContactEntry, type ContactEntry } from "../utils/api";

export function AdminContacts() {
  const [entries, setEntries] = useState<ContactEntry[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Loading contact entries…");

  async function refresh() {
    setEntries(await getContactEntries());
  }

  useEffect(() => {
    refresh()
      .then(() => setMessage(""))
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not load contact entries."));
  }, []);

  const visibleEntries = useMemo(() => {
    const target = query.trim().toLowerCase();
    if (!target) return entries;
    return entries.filter((entry) =>
      `${entry.name} ${entry.email} ${entry.organisation} ${entry.interest} ${entry.status}`.toLowerCase().includes(target),
    );
  }, [entries, query]);

  async function save(entry: ContactEntry, status: ContactEntry["status"], notes: string) {
    try {
      const updated = await updateContactEntry(entry.id, { status, notes });
      setEntries((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setMessage(`Saved follow-up details for ${entry.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Contact entry could not be updated.");
    }
  }

  async function remove(entry: ContactEntry) {
    if (!window.confirm(`Delete the contact entry from ${entry.name}?`)) return;
    try {
      await deleteContactEntry(entry.id);
      setEntries((current) => current.filter((item) => item.id !== entry.id));
      setMessage("Contact entry deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Contact entry could not be deleted.");
    }
  }

  return (
    <>
      <Seo title="Contact Entries Admin" description="Review and manage RYSEN contact submissions." path="/admin/contacts" />
      <section className="bg-rysen-ink py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Admin Dashboard</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Contact entry manager</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">Review every enquiry, record follow-up notes, and track its progress from new to closed.</p>
        </div>
      </section>
      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Inbox className="h-6 w-6 text-rysen-orange" aria-hidden="true" />
              <div><h2 className="text-2xl font-semibold text-rysen-ink">Saved enquiries</h2><p className="text-sm text-rysen-charcoal/55">{entries.length} total · {entries.filter((entry) => entry.status === "New").length} new</p></div>
            </div>
            <label className="relative min-w-64">
              <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-rysen-charcoal/40" aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search enquiries" className="min-h-11 w-full rounded-full border border-rysen-ink/10 pl-11 pr-4 outline-none focus:border-rysen-orange" />
            </label>
          </div>

          {message && <p className="mt-5 rounded-lg bg-rysen-ivory px-4 py-3 text-sm font-semibold text-rysen-charcoal/75">{message}</p>}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {visibleEntries.map((entry) => <ContactEntryCard key={entry.id} entry={entry} onSave={save} onDelete={remove} />)}
          </div>
          {visibleEntries.length === 0 && <p className="mt-6 rounded-xl bg-white p-8 text-center font-semibold text-rysen-charcoal/60">No matching contact entries.</p>}
        </div>
      </section>
    </>
  );
}

function ContactEntryCard({ entry, onSave, onDelete }: {
  entry: ContactEntry;
  onSave: (entry: ContactEntry, status: ContactEntry["status"], notes: string) => Promise<void>;
  onDelete: (entry: ContactEntry) => Promise<void>;
}) {
  const [status, setStatus] = useState(entry.status);
  const [notes, setNotes] = useState(entry.notes);

  useEffect(() => {
    setStatus(entry.status);
    setNotes(entry.notes);
  }, [entry]);

  return (
    <article className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rysen-orange">{entry.interest}</p>
          <h3 className="mt-2 text-2xl font-semibold text-rysen-ink">{entry.name}</h3>
          <p className="mt-1 text-sm text-rysen-charcoal/50">{new Date(entry.createdAt).toLocaleString()}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${status === "New" ? "bg-orange-100 text-orange-800" : status === "Contacted" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{status}</span>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-rysen-charcoal/70">
        <a href={`mailto:${entry.email}`} className="inline-flex items-center gap-2 font-semibold hover:text-rysen-orange"><Mail className="h-4 w-4" /> {entry.email}</a>
        {entry.phone && <a href={`tel:${entry.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 font-semibold hover:text-rysen-orange"><Phone className="h-4 w-4" /> {entry.phone}</a>}
        {entry.organisation && <p><strong className="text-rysen-ink">Organisation:</strong> {entry.organisation}</p>}
        {entry.role && <p><strong className="text-rysen-ink">Role:</strong> {entry.role}</p>}
      </div>

      <div className="mt-5 rounded-lg bg-rysen-ivory p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-rysen-charcoal/45">Message</p>
        <p className="mt-2 whitespace-pre-wrap leading-7 text-rysen-charcoal/75">{entry.message}</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[0.4fr_1fr]">
        <label><span className="text-xs font-bold uppercase tracking-[0.16em] text-rysen-charcoal/45">Status</span><select value={status} onChange={(event) => setStatus(event.target.value as ContactEntry["status"])} className="mt-2 min-h-11 w-full rounded-md border border-rysen-ink/10 px-3"><option>New</option><option>Contacted</option><option>Closed</option></select></label>
        <label><span className="text-xs font-bold uppercase tracking-[0.16em] text-rysen-charcoal/45">Follow-up Notes</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-md border border-rysen-ink/10 p-3 outline-none focus:border-rysen-orange" /></label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-rysen-ink/10 pt-5">
        <button type="button" onClick={() => onSave(entry, status, notes)} className="inline-flex items-center gap-2 rounded-full bg-rysen-ink px-4 py-2 text-sm font-bold text-white"><Save className="h-4 w-4" /> Save Follow-up</button>
        <button type="button" onClick={() => onDelete(entry)} className="inline-flex items-center gap-2 rounded-full border border-rysen-ink/10 px-4 py-2 text-sm font-bold text-rysen-charcoal hover:text-rysen-ember"><Trash2 className="h-4 w-4" /> Delete</button>
      </div>
    </article>
  );
}

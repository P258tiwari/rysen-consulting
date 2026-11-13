import { AdminPageHeader } from "../components/AdminPageHeader";
import { useEffect, useMemo, useState } from "react";
import { Inbox, Mail, Phone, Save, Search, Trash2 } from "lucide-react";
import { Seo } from "../components/Seo";
import { deleteContactEntry, getContactEntries, updateContactEntry, type ContactEntry } from "../utils/api";

export function AdminContacts() {
  const [entries, setEntries] = useState<ContactEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [busy, setBusy] = useState(false);
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
    return entries.filter((entry) => (filter === "All" || entry.status === filter) && `${entry.name} ${entry.email} ${entry.organisation} ${entry.interest} ${entry.status}`.toLowerCase().includes(target));
  }, [entries, query, filter]);

  async function save(entry: ContactEntry, status: ContactEntry["status"], notes: string) {
    if (busy) return;
    setBusy(true);
    try {
      const updated = await updateContactEntry(entry.id, { status, notes });
      setEntries((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setMessage(`Saved follow-up details for ${entry.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Contact entry could not be updated.");
    } finally { setBusy(false); }
  }

  async function remove(entry: ContactEntry) {
    if (!window.confirm(`Delete the contact entry from ${entry.name}?`)) return;
    if (busy) return;
    setBusy(true);
    try {
      await deleteContactEntry(entry.id);
      setEntries((current) => current.filter((item) => item.id !== entry.id));
      setMessage("Contact entry deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Contact entry could not be deleted.");
    } finally { setBusy(false); }
  }

  const selected = visibleEntries.find((entry) => entry.id === selectedId) ?? visibleEntries[0];
  return (
    <>
      <Seo title="Enquiries Admin" description="Manage RYSEN enquiries and follow-ups." path="/admin/contacts" />
      <AdminPageHeader eyebrow="Relationships" title="Enquiry inbox" description="Every conversation, organised. Review new enquiries and keep the next step clear." />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 grid grid-cols-3 gap-3">{["New", "Contacted", "Closed"].map(status => <button type="button" key={status} onClick={() => setFilter(filter === status ? "All" : status)} className={`rounded-xl border p-4 text-left transition ${filter === status ? "border-rysen-orange bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"}`}><p className="text-xs font-semibold text-slate-500">{status}</p><p className="mt-2 text-3xl font-semibold">{entries.filter(entry => entry.status === status).length}</p></button>)}</div>
        {message && <p role="status" className="mb-4 rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 text-sm">{message}</p>}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-4"><div className="flex items-center gap-2"><Inbox className="h-5 w-5 text-rysen-orange" /><h2 className="font-semibold">{filter === "All" ? "All enquiries" : filter + " enquiries"}</h2><span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">{visibleEntries.length}</span>{filter !== "All" && <button type="button" onClick={() => setFilter("All")} className="text-xs text-rysen-orange">Clear filter</button>}</div><label className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><span className="sr-only">Search enquiries</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, email or company" className="h-10 w-full border pl-10 pr-3 text-sm" /></label></div>
          <div className="grid lg:grid-cols-[minmax(240px,.65fr)_minmax(0,1.35fr)]">
            <div className="max-h-72 overflow-y-auto border-b border-slate-200 lg:max-h-[750px] lg:border-b-0 lg:border-r">{visibleEntries.map(entry => <button type="button" key={entry.id} onClick={() => setSelectedId(entry.id)} aria-pressed={entry.id === selected?.id} className={`block w-full border-b border-slate-100 p-5 text-left transition ${entry.id === selected?.id ? "border-l-4 border-l-rysen-orange bg-orange-50/60" : "border-l-4 border-l-transparent hover:bg-slate-50"}`}><div className="flex items-start justify-between gap-3"><p className="font-semibold">{entry.name}</p><span className="shrink-0 text-[10px] font-semibold text-slate-500">{entry.status}</span></div><p className="mt-1 truncate text-xs text-slate-500">{entry.organisation || entry.email}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{entry.message}</p><p className="mt-3 text-xs text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</p></button>)}{!visibleEntries.length && <p className="p-8 text-sm text-slate-500">No enquiries match this view.</p>}</div>
            <div className="min-w-0">{selected ? <ContactEntryCard key={selected.id} entry={selected} busy={busy} onSave={save} onDelete={remove} /> : <div className="grid min-h-80 place-content-center p-8 text-center text-slate-400"><Inbox className="mx-auto mb-4 h-9 w-9" /><p>Select an enquiry to view the conversation.</p></div>}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactEntryCard({ entry, busy, onSave, onDelete }: {
  entry: ContactEntry;
  busy: boolean;
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
    <article className="bg-white p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rysen-orange">{entry.interest}</p>
          <h3 className="mt-2 text-2xl font-semibold text-rysen-ink">{entry.name}</h3>
          <p className="mt-1 text-sm text-rysen-charcoal/50">{new Date(entry.createdAt).toLocaleString()}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${status === "New" ? "bg-orange-100 text-orange-800" : status === "Contacted" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{status}</span>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-rysen-charcoal/70">
        <a href={`mailto:${entry.email}`} className="inline-flex items-center gap-2 break-all font-semibold hover:text-rysen-orange"><Mail className="h-4 w-4" /> {entry.email}</a>
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
        <button type="button" disabled={busy} onClick={() => onSave(entry, status, notes)} className="inline-flex items-center gap-2 rounded-full bg-rysen-ink px-4 py-2 text-sm font-bold text-white"><Save className="h-4 w-4" /> Save Follow-up</button>
        <button type="button" disabled={busy} onClick={() => onDelete(entry)} className="inline-flex items-center gap-2 rounded-full border border-rysen-ink/10 px-4 py-2 text-sm font-bold text-rysen-charcoal hover:text-rysen-ember"><Trash2 className="h-4 w-4" /> Delete</button>
      </div>
    </article>
  );
}

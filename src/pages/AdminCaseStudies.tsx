import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Edit3, FileImage, Plus, Save, Trash2 } from "lucide-react";
import { Seo } from "../components/Seo";
import {
  createBackendCaseStudy,
  deleteBackendCaseStudy,
  getBackendCaseStudies,
  updateBackendCaseStudy,
  type BackendCaseStudy,
} from "../utils/api";
import { fileToDataUrl } from "../utils/resourceStore";

type CaseStudyForm = {
  title: string;
  practiceArea: string;
  challenge: string;
  solution: string;
  impact: string;
  image: string;
  imageAlt: string;
  status: "Draft" | "Published";
};

const emptyForm: CaseStudyForm = {
  title: "",
  practiceArea: "Leadership Development",
  challenge: "",
  solution: "",
  impact: "",
  image: "/assets/images/case-studies/hipo-infrastructure-journey-ai.webp",
  imageAlt: "",
  status: "Published",
};

const inputClass = "min-h-11 rounded-md border border-rysen-ink/10 bg-white px-3 py-2 text-sm text-rysen-ink outline-none focus:border-rysen-orange focus:ring-4 focus:ring-rysen-orange/10";
const labelClass = "text-xs font-bold uppercase tracking-[0.18em] text-rysen-charcoal/55";

export function AdminCaseStudies() {
  const [studies, setStudies] = useState<BackendCaseStudy[]>([]);
  const [form, setForm] = useState<CaseStudyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading case studies…");

  async function refresh() {
    const items = await getBackendCaseStudies();
    setStudies(items);
  }

  useEffect(() => {
    refresh()
      .then(() => setMessage(""))
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not load case studies."));
  }, []);

  function update<K extends keyof CaseStudyForm>(field: K, value: CaseStudyForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((current) => ({ ...current, image: dataUrl, imageAlt: current.imageAlt || file.name.replace(/\.[^.]+$/, "") }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      title: form.title,
      practiceArea: form.practiceArea,
      challenge: form.challenge.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
      solution: form.solution.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
      impact: form.impact.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
      image: form.image,
      imageAlt: form.imageAlt,
      status: form.status,
    };
    try {
      if (editingId) await updateBackendCaseStudy(editingId, payload);
      else await createBackendCaseStudy(payload);
      await refresh();
      reset();
      setMessage(editingId ? "Case study updated." : "Case study created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Case study could not be saved.");
    }
  }

  function edit(study: BackendCaseStudy) {
    setEditingId(study.id);
    setForm({
      title: study.title,
      practiceArea: study.practiceArea,
      challenge: study.challenge.join("\n"),
      solution: study.solution.join("\n"),
      impact: study.impact.join("\n"),
      image: study.image,
      imageAlt: study.imageAlt,
      status: study.status,
    });
    setMessage("");
  }

  async function remove(study: BackendCaseStudy) {
    if (!window.confirm(`Delete “${study.title}”?`)) return;
    try {
      await deleteBackendCaseStudy(study.id);
      await refresh();
      if (editingId === study.id) reset();
      setMessage("Case study deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Case study could not be deleted.");
    }
  }

  return (
    <>
      <Seo title="Case Studies Admin" description="Manage RYSEN case studies." path="/admin/case-studies" />
      <section className="bg-rysen-ink py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Admin Dashboard</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Case studies manager</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/70">Create, edit, publish, and remove measurable transformation stories.</p>
        </div>
      </section>
      <section className="section bg-rysen-soft">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <aside className="rounded-xl bg-rysen-ink p-6 text-white">
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-rysen-orange" aria-hidden="true" />
              <h2 className="text-2xl font-semibold">Backend case studies</h2>
            </div>
            <p className="mt-2 text-sm text-white/55">{studies.length} saved</p>
            <div className="mt-5 max-h-[720px] space-y-3 overflow-auto pr-1">
              {studies.map((study) => (
                <article key={study.id} className="rounded-lg bg-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-rysen-orange">{study.practiceArea}</p>
                  <h3 className="mt-2 font-semibold leading-snug">{study.title}</h3>
                  <p className="mt-2 text-xs text-white/50">{study.status}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => edit(study)} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20"><Edit3 className="h-3.5 w-3.5" /> Edit</button>
                    <button type="button" onClick={() => remove(study)} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold hover:text-rysen-ember"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </div>
                </article>
              ))}
              {studies.length === 0 && <p className="rounded-lg bg-white/10 p-4 text-sm text-white/60">No backend case studies yet.</p>}
            </div>
          </aside>

          <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow-executive">
            <div className="flex flex-col gap-4 border-b border-rysen-ink/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-rysen-orange">Case study editor</p>
                <h2 className="mt-2 text-3xl font-semibold text-rysen-ink">{editingId ? "Edit case study" : "Create case study"}</h2>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={reset} className="rounded-full border border-rysen-ink/10 px-5 py-2 text-sm font-bold">New</button>
                <button className="inline-flex items-center gap-2 rounded-full bg-orange-sheen px-5 py-2 text-sm font-bold text-white"><Save className="h-4 w-4" /> Save</button>
              </div>
            </div>

            {message && <p className="mt-5 rounded-lg bg-rysen-ivory px-4 py-3 text-sm font-semibold text-rysen-charcoal/75">{message}</p>}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="md:col-span-2"><span className={labelClass}>Title</span><input className={`${inputClass} mt-2 w-full`} value={form.title} onChange={(event) => update("title", event.target.value)} /></label>
              <label><span className={labelClass}>Practice Area</span><input className={`${inputClass} mt-2 w-full`} value={form.practiceArea} onChange={(event) => update("practiceArea", event.target.value)} /></label>
              <label><span className={labelClass}>Status</span><select className={`${inputClass} mt-2 w-full`} value={form.status} onChange={(event) => update("status", event.target.value as CaseStudyForm["status"])}><option>Draft</option><option>Published</option></select></label>
              <label className="md:col-span-2"><span className={labelClass}>Challenges — one per line</span><textarea className={`${inputClass} mt-2 min-h-32 w-full resize-y`} value={form.challenge} onChange={(event) => update("challenge", event.target.value)} /></label>
              <label className="md:col-span-2"><span className={labelClass}>Solutions — one per line</span><textarea className={`${inputClass} mt-2 min-h-32 w-full resize-y`} value={form.solution} onChange={(event) => update("solution", event.target.value)} /></label>
              <label className="md:col-span-2"><span className={labelClass}>Measured impacts — one per line</span><textarea className={`${inputClass} mt-2 min-h-32 w-full resize-y`} value={form.impact} onChange={(event) => update("impact", event.target.value)} /></label>
            </div>

            <div className="mt-7 border-t border-rysen-ink/10 pt-6">
              <div className="flex items-center gap-3"><FileImage className="h-5 w-5 text-rysen-orange" /><h3 className="text-xl font-semibold">Case-study image</h3></div>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label><span className={labelClass}>Image URL</span><input className={`${inputClass} mt-2 w-full`} value={form.image} onChange={(event) => update("image", event.target.value)} /></label>
                <label><span className={labelClass}>Upload Image</span><input type="file" accept="image/*" className={`${inputClass} mt-2 w-full file:mr-2 file:rounded-full file:border-0 file:bg-rysen-ink file:px-3 file:py-2 file:text-white`} onChange={uploadImage} /></label>
                <label className="md:col-span-2"><span className={labelClass}>Image Alt Text</span><input className={`${inputClass} mt-2 w-full`} value={form.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} /></label>
              </div>
              {form.image && <img src={form.image} alt={form.imageAlt || "Case study preview"} className="mt-5 aspect-[16/8] w-full rounded-lg object-cover" />}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

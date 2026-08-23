import { ArrowLeft, FileImage, Save, Send } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { createBackendCaseStudy, getBackendCaseStudies, updateBackendCaseStudy } from "../utils/api";
import { getSeedAdminStudies } from "../utils/adminContent";
import { fileToDataUrl } from "../utils/resourceStore";

type StudyForm = { title: string; practiceArea: string; challenge: string; solution: string; impact: string; image: string; imageAlt: string; status: "Draft" | "Published" };
const emptyForm: StudyForm = { title: "", practiceArea: "Leadership Development", challenge: "", solution: "", impact: "", image: "/assets/images/case-studies/hipo-infrastructure-journey-ai.webp", imageAlt: "", status: "Draft" };
const inputClass = "mt-2 min-h-11 w-full rounded-md border border-rysen-ink/10 bg-white px-3 py-2 text-sm text-rysen-ink outline-none focus:border-rysen-orange focus:ring-4 focus:ring-rysen-orange/10";
const labelClass = "text-xs font-bold uppercase tracking-[0.18em] text-rysen-charcoal/55";

export function AdminCaseStudyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<StudyForm>(emptyForm);
  const [backendId, setBackendId] = useState<string | null>(null);
  const [seedSource, setSeedSource] = useState(false);
  const [message, setMessage] = useState(id ? "Loading case study…" : "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBackendCaseStudies().then((backend) => {
      const managed = backend.find((study) => study.id === id);
      const seed = getSeedAdminStudies().find((study) => study.id === id);
      const study = managed ?? seed;
      if (!study) throw new Error("Case study not found.");
      setForm({ title: study.title, practiceArea: study.practiceArea, challenge: study.challenge.join("\n"), solution: study.solution.join("\n"), impact: study.impact.join("\n"), image: study.image, imageAlt: study.imageAlt, status: study.status });
      setBackendId(managed?.id ?? null);
      setSeedSource(!managed);
      setMessage("");
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Could not load case study."));
  }, [id]);

  function update<K extends keyof StudyForm>(field: K, value: StudyForm[K]) { setForm((current) => ({ ...current, [field]: value })); setMessage(""); }
  async function uploadImage(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; update("image", await fileToDataUrl(file)); if (!form.imageAlt) update("imageAlt", file.name.replace(/\.[^.]+$/, "")); }

  async function save(status: "Draft" | "Published") {
    const split = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    if (!form.title.trim() || !form.practiceArea.trim() || !split(form.challenge).length || !split(form.solution).length || !split(form.impact).length) { setMessage("Title, practice area, challenge, solution, and measured impact are required."); return; }
    setSaving(true);
    const payload = { title: form.title.trim(), practiceArea: form.practiceArea.trim(), challenge: split(form.challenge), solution: split(form.solution), impact: split(form.impact), image: form.image, imageAlt: form.imageAlt || form.title, status };
    try {
      const saved = backendId ? await updateBackendCaseStudy(backendId, payload) : await createBackendCaseStudy(payload);
      navigate(`/admin/case-studies/${saved.id}/view`, { replace: true, state: { message: status === "Published" ? "Case study published successfully." : "Draft saved successfully." } });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Case study could not be saved."); setSaving(false); }
  }

  return (
    <>
      <Seo title={`${id ? "Edit" : "Create"} Case Study`} description="RYSEN case study editor." path={id ? `/admin/case-studies/${id}/edit` : "/admin/case-studies/new"} />
      <section className="border-b border-rysen-ink/10 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div><Link to="/admin/case-studies" className="inline-flex items-center gap-2 text-sm font-bold text-rysen-charcoal/60 hover:text-rysen-orange"><ArrowLeft className="h-4 w-4" /> Back to case studies</Link><p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-rysen-orange">Case Study Editor</p><h1 className="mt-2 font-display text-4xl md:text-5xl">{id ? "Edit case study" : "Create a new case study"}</h1>{seedSource && <p className="mt-2 text-sm text-rysen-charcoal/60">Saving creates an editable managed version of this built-in story.</p>}</div>
          <div className="flex flex-wrap gap-3"><button type="button" disabled={saving} onClick={() => save("Draft")} className="inline-flex items-center gap-2 rounded-full border border-rysen-ink/15 px-5 py-3 text-sm font-bold"><Save className="h-4 w-4" /> Save Draft</button><button type="button" disabled={saving} onClick={() => save("Published")} className="inline-flex items-center gap-2 rounded-full bg-orange-sheen px-5 py-3 text-sm font-bold text-white"><Send className="h-4 w-4" /> {saving ? "Saving…" : "Publish Case Study"}</button></div>
        </div>
      </section>
      <section className="section bg-rysen-soft">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          {message && <p role="alert" className="rounded-lg border border-rysen-orange/20 bg-rysen-ivory px-4 py-3 text-sm font-semibold text-rysen-charcoal/75">{message}</p>}
          <section className="rounded-xl border border-rysen-ink/8 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Story overview</h2><p className="mt-1 text-sm text-rysen-charcoal/55">Name the engagement and identify its leadership practice area.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2"><label className="md:col-span-2"><span className={labelClass}>Title *</span><input value={form.title} onChange={(event) => update("title", event.target.value)} className={inputClass} placeholder="Leadership transformation at…" /></label><label><span className={labelClass}>Practice area *</span><input value={form.practiceArea} onChange={(event) => update("practiceArea", event.target.value)} className={inputClass} /></label><label><span className={labelClass}>Current status</span><div className={`${inputClass} flex items-center bg-rysen-soft text-rysen-charcoal/65`}>{form.status} · Choose Save Draft or Publish above</div></label></div>
          </section>
          <section className="rounded-xl border border-rysen-ink/8 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Transformation narrative</h2><p className="mt-1 text-sm text-rysen-charcoal/55">Add one clear point per line. Each line becomes a readable item on the website.</p>
            <div className="mt-6 space-y-5"><label className="block"><span className={labelClass}>Challenge *</span><textarea value={form.challenge} onChange={(event) => update("challenge", event.target.value)} className={`${inputClass} min-h-40 resize-y leading-7`} placeholder="One challenge per line" /></label><label className="block"><span className={labelClass}>Solution *</span><textarea value={form.solution} onChange={(event) => update("solution", event.target.value)} className={`${inputClass} min-h-40 resize-y leading-7`} placeholder="One solution per line" /></label><label className="block"><span className={labelClass}>Measured impact *</span><textarea value={form.impact} onChange={(event) => update("impact", event.target.value)} className={`${inputClass} min-h-40 resize-y leading-7`} placeholder="One measurable result per line" /></label></div>
          </section>
          <section className="rounded-xl border border-rysen-ink/8 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><FileImage className="h-5 w-5 text-rysen-orange" /><h2 className="text-2xl font-semibold">Case-study image</h2></div>
            <div className="mt-6 grid gap-5 md:grid-cols-2"><label><span className={labelClass}>Image URL</span><input value={form.image} onChange={(event) => update("image", event.target.value)} className={inputClass} /></label><label><span className={labelClass}>Upload image</span><input type="file" accept="image/*" onChange={uploadImage} className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-rysen-ink file:px-3 file:py-2 file:text-white`} /></label><label className="md:col-span-2"><span className={labelClass}>Image alt text</span><input value={form.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} className={inputClass} /></label></div>
            {form.image && <img src={form.image} alt={form.imageAlt || "Case study preview"} className="mt-5 aspect-[16/7] w-full rounded-lg object-cover" />}
          </section>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link to="/admin/case-studies" className="rounded-full border border-rysen-ink/15 px-6 py-3 text-center text-sm font-bold">Cancel</Link><button type="button" onClick={() => save("Draft")} className="inline-flex items-center justify-center gap-2 rounded-full border border-rysen-ink/15 bg-white px-6 py-3 text-sm font-bold"><Save className="h-4 w-4" /> Save Draft</button><button type="button" onClick={() => save("Published")} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-sheen px-6 py-3 text-sm font-bold text-white"><Send className="h-4 w-4" /> Publish Case Study</button></div>
        </div>
      </section>
    </>
  );
}

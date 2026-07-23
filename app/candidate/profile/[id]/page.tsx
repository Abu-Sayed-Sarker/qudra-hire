"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Trash2,
  UploadCloud,
  FileText,
  Eye,
  Download,
  RefreshCw,
  Plus,
  X,
  Mail,
  Phone,
  MapPin,
  LinkIcon,
  Loader2,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetCandidateProfileByIdQuery,
  usePatchCandidateProfileMutation,
  useDeleteCandidateProfileMutation,
} from "@/store/authApi";
import type {
  CandidateProfile,
  ProfileEducation,
  ProfileExperience,
  ProfileSkill,
  ProfileProject,
  ProfileCertification,
} from "@/store/authApi";

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const { data: profileRes, isLoading, error } = useGetCandidateProfileByIdQuery(id, { skip: !id });
  const [patchProfile, { isLoading: isSaving }] = usePatchCandidateProfileMutation();
  const [deleteProfile, { isLoading: isDeleting }] = useDeleteCandidateProfileMutation();

  const profile = profileRes?.data;

  // ── Form state ──
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    role_title: "",
    industry: "",
    about_me: "",
    phone_whatsapp: "",
    location: "",
    linkedin: "",
    website_portfolio: "",
    age: "",
    gender: "",
  });

  const [educations, setEducations] = useState<ProfileEducation[]>([]);
  const [experiences, setExperiences] = useState<ProfileExperience[]>([]);
  const [skills, setSkills] = useState<ProfileSkill[]>([]);
  const [projects, setProjects] = useState<ProfileProject[]>([]);
  const [certifications, setCertifications] = useState<ProfileCertification[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Snapshot to revert on cancel
  const snapshotRef = React.useRef<{
    form: typeof form;
    educations: ProfileEducation[];
    experiences: ProfileExperience[];
    skills: ProfileSkill[];
    projects: ProfileProject[];
    certifications: ProfileCertification[];
  } | null>(null);

  // ── Hydrate form from API data ──
  useEffect(() => {
    if (!profile) return;
    setForm({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      role_title: profile.role_title ?? "",
      industry: profile.industry ?? "",
      about_me: profile.about_me ?? "",
      phone_whatsapp: profile.phone_whatsapp ?? "",
      location: profile.location ?? "",
      linkedin: profile.linkedin ?? "",
      website_portfolio: profile.website_portfolio ?? "",
      age: profile.age != null ? String(profile.age) : "",
      gender: profile.gender ?? "",
    });
    setEducations(profile.educations ?? []);
    setExperiences(profile.experiences ?? []);
    setSkills(profile.skills ?? []);
    setProjects(profile.projects ?? []);
    setCertifications(profile.certifications ?? []);
  }, [profile]);

  // ── Generic field updater ──
  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Education helpers ──
  function addEducation() {
    setEducations((prev) => [
      ...prev,
      { school: "", degree: "", field_of_study: "", start_year: "", end_year: "" },
    ]);
  }
  function updateEducation(index: number, key: keyof ProfileEducation, value: string) {
    setEducations((prev) => prev.map((e, i) => (i === index ? { ...e, [key]: value } : e)));
  }
  function removeEducation(index: number) {
    setEducations((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Experience helpers ──
  function addExperience() {
    setExperiences((prev) => [
      ...prev,
      { company: "", job_title: "", start_date: "", end_date: "", is_current: false, description: "" },
    ]);
  }
  function updateExperience(index: number, key: keyof ProfileExperience, value: string | boolean) {
    setExperiences((prev) => prev.map((e, i) => (i === index ? { ...e, [key]: value } : e)));
  }
  function removeExperience(index: number) {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Skill helpers ──
  function addSkill() {
    const name = skillInput.trim();
    if (!name) return;
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      toast.warning("Skill already added");
      return;
    }
    setSkills((prev) => [...prev, { name }]);
    setSkillInput("");
  }
  function removeSkill(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Project helpers ──
  function addProject() {
    setProjects((prev) => [
      ...prev,
      { title: "", description: "", url: "", technologies: "", start_date: "", end_date: "" },
    ]);
  }
  function updateProject(index: number, key: keyof ProfileProject, value: string) {
    setProjects((prev) => prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
  }
  function removeProject(index: number) {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Certification helpers ──
  function addCertification() {
    setCertifications((prev) => [
      ...prev,
      { name: "", issuing_organization: "", issue_date: "", expiration_date: "", credential_id: "", credential_url: "" },
    ]);
  }
  function updateCertification(index: number, key: keyof ProfileCertification, value: string) {
    setCertifications((prev) => prev.map((c, i) => (i === index ? { ...c, [key]: value } : c)));
  }
  function removeCertification(index: number) {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Save (PATCH) ──
  async function handleSave() {
    try {
      const body: Record<string, any> = {
        first_name: form.first_name,
        last_name: form.last_name,
        role_title: form.role_title,
        industry: form.industry || null,
        about_me: form.about_me || null,
        phone_whatsapp: form.phone_whatsapp || null,
        location: form.location || null,
        linkedin: form.linkedin || null,
        website_portfolio: form.website_portfolio || null,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        educations: educations.map(({ id, ...rest }) => id ? { id, ...rest } : rest),
        experiences: experiences.map(({ id, ...rest }) => id ? { id, ...rest } : rest),
        skills: skills.map(({ id, ...rest }) => id ? { id, ...rest } : rest),
        projects: projects.map(({ id, ...rest }) => id ? { id, ...rest } : rest),
        certifications: certifications.map(({ id, ...rest }) => id ? { id, ...rest } : rest),
      };
      await patchProfile({ id, body }).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.data?.details ?? "Failed to update profile");
    }
  }

  // ── Edit mode ──
  function handleEdit() {
    snapshotRef.current = {
      form: { ...form },
      educations: educations.map((e) => ({ ...e })),
      experiences: experiences.map((e) => ({ ...e })),
      skills: skills.map((s) => ({ ...s })),
      projects: projects.map((p) => ({ ...p })),
      certifications: certifications.map((c) => ({ ...c })),
    };
    setIsEditing(true);
  }

  function handleCancel() {
    if (snapshotRef.current) {
      setForm(snapshotRef.current.form);
      setEducations(snapshotRef.current.educations);
      setExperiences(snapshotRef.current.experiences);
      setSkills(snapshotRef.current.skills);
      setProjects(snapshotRef.current.projects);
      setCertifications(snapshotRef.current.certifications);
      snapshotRef.current = null;
    }
    setIsEditing(false);
  }

  // ── Delete ──
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this profile? This action cannot be undone.")) return;
    try {
      await deleteProfile(id).unwrap();
      toast.success("Profile deleted");
      router.push("/candidate");
    } catch (err: any) {
      toast.error(err?.data?.details ?? "Failed to delete profile");
    }
  }

  // ── Loading / Error states ──
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-semibold text-foreground">Failed to load profile</p>
        <p className="text-sm text-muted-foreground">The profile could not be found or you don&apos;t have access.</p>
        <button onClick={() => router.push("/candidate")} className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-5 py-2 rounded-lg transition-colors">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const initials = `${form.first_name.charAt(0)}${form.last_name.charAt(0)}`.toUpperCase();
  const ro = !isEditing;

  return (
    <div className="min-h-full bg-background text-foreground pb-20">
      <div className="max-w-full mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">Keep your profile up to date to stand out to potential employers.</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="text-sm font-semibold border border-border bg-card hover:bg-muted text-foreground px-4 py-2 rounded-lg transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin inline mr-1" />}
                  Save changes
                </button>
              </>
            ) : (
              <>
                <button onClick={handleDelete} disabled={isDeleting} className="text-sm font-semibold border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-destructive px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin inline mr-1" /> : <Trash2 className="h-4 w-4 inline mr-1" />}
                  Delete
                </button>
                <button onClick={handleEdit} className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex gap-8">
            <div className="relative! shrink-0 ">
              <div className="w-20 h-20 bg-muted border border-border rounded-full flex items-center justify-center text-xl font-bold text-foreground">
                {initials || "?"}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-[#4BC957] text-white p-1.5 rounded-full shadow-sm hover:bg-[#3DAF49]">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">First name *</label>
                <input type="text" value={form.first_name} onChange={(e) => setField("first_name", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Last name *</label>
                <input type="text" value={form.last_name} onChange={(e) => setField("last_name", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Age</label>
                <input type="number" min={0} value={form.age} onChange={(e) => setField("age", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Gender</label>
                <select value={form.gender} onChange={(e) => setField("gender", e.target.value)} disabled={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Role title *</label>
                <input type="text" value={form.role_title} onChange={(e) => setField("role_title", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Industry</label>
                <input type="text" value={form.industry} onChange={(e) => setField("industry", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* About me */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#4BC957] text-lg leading-none mt-[-2px]">★</span>
            <h2 className="text-base font-bold text-foreground">About me</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Brief summary of your skills and experience.</p>
          <div className="relative">
            <textarea
              rows={4}
              value={form.about_me}
              onChange={(e) => setField("about_me", e.target.value)}
              readOnly={ro}
              className={`w-full border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`}
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">{form.about_me.length}/500</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4">Contact info</h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Mail className="w-3 h-3 text-[#4BC957]"/> Email</label>
              <input type="email" value={profile.email} disabled className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#4BC957]"/> Phone (WhatsApp)</label>
              <input type="text" value={form.phone_whatsapp} onChange={(e) => setField("phone_whatsapp", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#4BC957]"/> Location</label>
              <input type="text" value={form.location} onChange={(e) => setField("location", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><LinkIcon className="w-3 h-3 text-[#4BC957]"/> LinkedIn</label>
              <input type="text" value={form.linkedin} onChange={(e) => setField("linkedin", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><LinkIcon className="w-3 h-3 text-[#4BC957]"/> Website / Portfolio</label>
              <input type="text" value={form.website_portfolio} onChange={(e) => setField("website_portfolio", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
            </div>
          </div>
        </div>

        {/* CV / Resume */}
        {profile.cv && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4BC957]" />
                <h2 className="text-base font-bold text-foreground">CV / Resume</h2>
              </div>
              <button className="text-xs font-semibold border border-border hover:bg-muted px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
                <UploadCloud className="w-3.5 h-3.5" /> Upload CV
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">PDF or DOCX, max 10MB.</p>

            <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#4BC957]/10 rounded flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#4BC957]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Current CV</p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[300px]">{profile.cv}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold bg-[#4BC957]/10 hover:bg-[#4BC957]/20 text-[#4BC957] px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> View CV
                </a>
                <a href={profile.cv} download className="text-xs font-semibold border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Education */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[#4BC957] text-lg leading-none mt-[-2px]">◇</span>
              <h2 className="text-base font-bold text-foreground">Education</h2>
            </div>
            {isEditing && (
              <button onClick={addEducation} className="text-xs font-semibold border border-border hover:bg-muted px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
                <Plus className="w-3 h-3" /> Add education
              </button>
            )}
          </div>

          <div className="space-y-6">
            {educations.map((edu, i) => (
              <div key={edu.id ?? `new-edu-${i}`} className="border border-border rounded-xl p-5 relative">
                {isEditing && (
                  <button onClick={() => removeEducation(i)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <h3 className="text-sm font-bold text-foreground mb-4">{edu.school || `Education ${i + 1}`}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">School / University *</label>
                    <input type="text" value={edu.school} onChange={(e) => updateEducation(i, "school", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Degree</label>
                    <input type="text" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Field of study</label>
                    <input type="text" value={edu.field_of_study} onChange={(e) => updateEducation(i, "field_of_study", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-muted-foreground">From</label>
                      <input type="date" value={edu.start_year?.slice(0, 10) ?? ""} onChange={(e) => updateEducation(i, "start_year", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-muted-foreground">To</label>
                      <input type="date" value={edu.end_year?.slice(0, 10) ?? ""} onChange={(e) => updateEducation(i, "end_year", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {educations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No education entries yet. Click &quot;Add education&quot; to get started.</p>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[#4BC957] text-lg leading-none mt-[-2px]">▤</span>
              <h2 className="text-base font-bold text-foreground">Experience</h2>
            </div>
            {isEditing && (
              <button onClick={addExperience} className="text-xs font-semibold border border-border hover:bg-muted px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
                <Plus className="w-3 h-3" /> Add experience
              </button>
            )}
          </div>

          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <div key={exp.id ?? `new-exp-${i}`} className="border border-border rounded-xl p-5 relative">
                {isEditing && (
                  <button onClick={() => removeExperience(i)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <h3 className="text-sm font-bold text-foreground mb-4">{exp.job_title || `Experience ${i + 1}`}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Company / Organization *</label>
                    <input type="text" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Job Title</label>
                    <input type="text" value={exp.job_title} onChange={(e) => updateExperience(i, "job_title", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-muted-foreground">From</label>
                      <input type="date" value={exp.start_date?.slice(0, 10) ?? ""} onChange={(e) => updateExperience(i, "start_date", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-muted-foreground">To</label>
                      <input type="date" value={exp.end_date?.slice(0, 10) ?? ""} onChange={(e) => updateExperience(i, "end_date", e.target.value)} disabled={ro || exp.is_current} className={`w-full border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring ${(ro || exp.is_current) ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" checked={exp.is_current} onChange={(e) => updateExperience(i, "is_current", e.target.checked)} id={`current-${i}`} disabled={ro} className="accent-[#4BC957]" />
                    <label htmlFor={`current-${i}`} className="text-[11px] font-semibold text-muted-foreground">Currently working here</label>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Description</label>
                    <textarea rows={3} value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} readOnly={ro} className={`w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none ${ro ? "bg-muted cursor-not-allowed" : "bg-background"}`} />
                  </div>
                </div>
              </div>
            ))}
            {experiences.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No experience entries yet. Click &quot;Add experience&quot; to get started.</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-1">Skills</h2>
          <p className="text-xs text-muted-foreground mb-4">Add up to 20 skills. Used for AI matching and filtering.</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, i) => (
              <span key={skill.id ?? `skill-${i}`} className="inline-flex items-center gap-1.5 bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 px-3 py-1 rounded-full text-xs font-semibold">
                {skill.name}
                {isEditing && (
                  <button onClick={() => removeSkill(i)} className="hover:text-[#3DAF49]"><X className="w-3 h-3" /></button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="relative">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="Add a skill (e.g. Project Management)"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 pr-16 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button onClick={addSkill} className="absolute right-2 top-1.5 text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground px-2 py-1 rounded">
                + Add
              </button>
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[#4BC957] text-lg leading-none mt-[-2px]">◆</span>
              <h2 className="text-base font-bold text-foreground">Projects</h2>
            </div>
            <button onClick={addProject} className="text-xs font-semibold border border-border hover:bg-muted px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
              <Plus className="w-3 h-3" /> Add project
            </button>
          </div>

          <div className="space-y-6">
            {projects.map((proj, i) => (
              <div key={proj.id ?? `new-proj-${i}`} className="border border-border rounded-xl p-5 relative">
                <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-bold text-foreground mb-4">{proj.title || `Project ${i + 1}`}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Title *</label>
                    <input type="text" value={proj.title} onChange={(e) => updateProject(i, "title", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Description</label>
                    <textarea rows={2} value={proj.description} onChange={(e) => updateProject(i, "description", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">URL</label>
                    <input type="text" value={proj.url} onChange={(e) => updateProject(i, "url", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Technologies</label>
                    <input type="text" value={proj.technologies} onChange={(e) => updateProject(i, "technologies", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Start date</label>
                    <input type="date" value={proj.start_date?.slice(0, 10) ?? ""} onChange={(e) => updateProject(i, "start_date", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">End date</label>
                    <input type="date" value={proj.end_date?.slice(0, 10) ?? ""} onChange={(e) => updateProject(i, "end_date", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No projects yet. Click &quot;Add project&quot; to get started.</p>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[#4BC957] text-lg leading-none mt-[-2px]">◈</span>
              <h2 className="text-base font-bold text-foreground">Certifications</h2>
            </div>
            <button onClick={addCertification} className="text-xs font-semibold border border-border hover:bg-muted px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
              <Plus className="w-3 h-3" /> Add certification
            </button>
          </div>

          <div className="space-y-6">
            {certifications.map((cert, i) => (
              <div key={cert.id ?? `new-cert-${i}`} className="border border-border rounded-xl p-5 relative">
                <button onClick={() => removeCertification(i)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-bold text-foreground mb-4">{cert.name || `Certification ${i + 1}`}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Name *</label>
                    <input type="text" value={cert.name} onChange={(e) => updateCertification(i, "name", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Issuing organization</label>
                    <input type="text" value={cert.issuing_organization} onChange={(e) => updateCertification(i, "issuing_organization", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Issue date</label>
                    <input type="date" value={cert.issue_date?.slice(0, 10) ?? ""} onChange={(e) => updateCertification(i, "issue_date", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Expiration date</label>
                    <input type="date" value={cert.expiration_date?.slice(0, 10) ?? ""} onChange={(e) => updateCertification(i, "expiration_date", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Credential ID</label>
                    <input type="text" value={cert.credential_id} onChange={(e) => updateCertification(i, "credential_id", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">Credential URL</label>
                    <input type="text" value={cert.credential_url} onChange={(e) => updateCertification(i, "credential_url", e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </div>
              </div>
            ))}
            {certifications.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No certifications yet. Click &quot;Add certification&quot; to get started.</p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-8">
          <button onClick={() => router.back()} className="text-sm font-semibold text-foreground hover:bg-muted px-4 py-2 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving} className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin inline mr-1" />}
            Save changes
          </button>
        </div>

      </div>
    </div>
  );
}

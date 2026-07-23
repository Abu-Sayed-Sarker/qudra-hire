"use client";

import React from "react";
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
  LinkIcon
} from "lucide-react";

import { useParams } from "next/navigation";

const MOCK_PROFILES = {
  "senior-product-designer": {
    role: "Senior Product Designer (UX/UI)",
    about: "Product designer with 7+ years of building mobile-first fintech in the GCC. I love design systems, comprehensive research in UX/UI, and close partnering with engineers to move fast without breaking trust."
  },
  "ux-research-lead": {
    role: "UX Research Lead",
    about: "Experienced UX Researcher specializing in qualitative analysis and user testing to inform product strategy. Adept at driving user-centric decisions across cross-functional teams."
  }
};

export default function CandidateProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const profileData = MOCK_PROFILES[id as keyof typeof MOCK_PROFILES] || MOCK_PROFILES["senior-product-designer"];

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
            <button className="text-sm font-semibold border border-border bg-card hover:bg-muted text-foreground px-4 py-2 rounded-lg transition-colors">
              Cancel
            </button>
            <button className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-4 py-2 rounded-lg transition-colors">
              Save changes
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex gap-8">
            <div className="relative! shrink-0 ">
              <div className="w-20 h-20 bg-muted border border-border rounded-full flex items-center justify-center text-xl font-bold text-foreground">
                LA
              </div>
              <button className="absolute bottom-0 right-0 bg-[#4BC957] text-white p-1.5 rounded-full shadow-sm hover:bg-[#3DAF49]">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">First name</label>
                <input type="text" defaultValue="Layla" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Last name</label>
                <input type="text" defaultValue="Al-Mansoori" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Age</label>
                <input type="text" defaultValue="28" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Gender</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none">
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Role</label>
                <input type="text" defaultValue={profileData.role} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
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
              defaultValue={profileData.about}
              className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
            <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">178/500</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4">Contact info</h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Mail className="w-3 h-3 text-[#4BC957]"/> Email</label>
              <input type="email" defaultValue="layla.mansoori@example.com" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#4BC957]"/> Phone (WhatsApp)</label>
              <input type="text" defaultValue="+971 50 145 1107" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#4BC957]"/> Location</label>
              <input type="text" defaultValue="Dubai, UAE" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><LinkIcon className="w-3 h-3 text-[#4BC957]"/> LinkedIn</label>
              <input type="text" defaultValue="linkedin.com/in/laylamansoori" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5"><LinkIcon className="w-3 h-3 text-[#4BC957]"/> Website / Portfolio</label>
              <input type="text" defaultValue="layla.design" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
        </div>

        {/* CV / Resume */}
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
          <p className="text-xs text-muted-foreground mb-4">PDF or DOCX, max 10MB. Allowed to have up to 3 options.</p>
          
          <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#4BC957]/10 rounded flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#4BC957]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Layla_AlMansoori_CV.pdf</p>
                <p className="text-[11px] text-muted-foreground">392 KB • Updated 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold bg-[#4BC957]/10 text-[#4BC957] px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4BC957]"></span> Primary
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button className="text-xs font-semibold bg-[#4BC957]/10 hover:bg-[#4BC957]/20 text-[#4BC957] px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
              <Eye className="w-3.5 h-3.5" /> View CV
            </button>
            <button className="text-xs font-semibold border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button className="text-xs font-semibold border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Update
            </button>
            <button className="text-xs font-semibold hover:bg-destructive/10 text-destructive px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>

        {/* Education */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[#4BC957] text-lg leading-none mt-[-2px]">◇</span>
              <h2 className="text-base font-bold text-foreground">Education</h2>
            </div>
            <button className="text-xs font-semibold border border-border hover:bg-muted px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
              <Plus className="w-3 h-3" /> Add education
            </button>
          </div>

          <div className="space-y-6">
            {/* Ed 1 */}
            <div className="border border-border rounded-xl p-5 relative">
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold text-foreground mb-4">American University of Sharjah</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">School / University</label>
                  <input type="text" defaultValue="American University of Sharjah" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Degree</label>
                  <input type="text" defaultValue="BFA" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Field of study</label>
                  <input type="text" defaultValue="Visual Communication" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">From</label>
                    <input type="text" defaultValue="2014" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">To</label>
                    <input type="text" defaultValue="2018" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </div>
              </div>
            </div>

            {/* Ed 2 */}
            <div className="border border-border rounded-xl p-5 relative">
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold text-foreground mb-4">Interaction Design Foundation</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">School / University</label>
                  <input type="text" defaultValue="Interaction Design Foundation" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Degree</label>
                  <input type="text" defaultValue="Certificate" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Field of study</label>
                  <input type="text" defaultValue="Human-Computer Interaction" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">From</label>
                    <input type="text" defaultValue="2019" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">To</label>
                    <input type="text" defaultValue="2020" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[#4BC957] text-lg leading-none mt-[-2px]">▤</span>
              <h2 className="text-base font-bold text-foreground">Experience</h2>
            </div>
            <button className="text-xs font-semibold border border-border hover:bg-muted px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
              <Plus className="w-3 h-3" /> Add experience
            </button>
          </div>

          <div className="space-y-6">
            {/* Exp 1 */}
            <div className="border border-border rounded-xl p-5 relative">
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold text-foreground mb-4">Careem</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Company / Organization</label>
                  <input type="text" defaultValue="Careem" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Job Title</label>
                  <input type="text" defaultValue="Senior Product Designer" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">From</label>
                    <input type="text" defaultValue="10/14/2022" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">To</label>
                    <input type="text" defaultValue="Present" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Description</label>
                  <textarea rows={3} defaultValue="Lead design system and shipped 2 flagship features." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                </div>
              </div>
            </div>

            {/* Exp 2 */}
            <div className="border border-border rounded-xl p-5 relative">
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold text-foreground mb-4">Stripe</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Company / Organization</label>
                  <input type="text" defaultValue="Stripe" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Job Title</label>
                  <input type="text" defaultValue="Product Designer" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">From</label>
                    <input type="text" defaultValue="03/10/2019" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground">To</label>
                    <input type="text" defaultValue="09/30/2022" className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground">Description</label>
                  <textarea rows={3} defaultValue="Maintained core checkout flow and reduced bounce rate by 4%." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-1">Skills</h2>
          <p className="text-xs text-muted-foreground mb-4">Add up to 20 skills. Used for AI matching and filtering.</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {["Figma", "Design Systems", "Prototyping", "UX Research", "Wireframing", "User Interviews"].map(skill => (
              <span key={skill} className="inline-flex items-center gap-1.5 bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 px-3 py-1 rounded-full text-xs font-semibold">
                {skill}
                <button className="hover:text-[#3DAF49]"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>

          <div className="relative">
            <input type="text" placeholder="Add a skill (e.g. Interaction Design)" className="w-full bg-background border border-border rounded-lg px-3 py-2 pr-16 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            <button className="absolute right-2 top-1.5 text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground px-2 py-1 rounded">
              + Add
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-8">
          <button className="text-sm font-semibold text-foreground hover:bg-muted px-4 py-2 rounded-lg transition-colors">
            Cancel
          </button>
          <button className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-5 py-2 rounded-lg transition-colors">
            Save changes
          </button>
        </div>

      </div>
    </div>
  );
}

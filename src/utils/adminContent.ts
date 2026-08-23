import { caseStudies as seededStudies, type CaseStudy } from "../data/content";
import type { BackendCaseStudy } from "./api";

export type AdminStudy =
  | (CaseStudy & { status: "Published"; source: "seed"; createdAt: string; updatedAt: string })
  | BackendCaseStudy;

export function getSeedAdminStudies(): AdminStudy[] {
  return seededStudies.map((study) => ({
    ...study,
    status: "Published",
    source: "seed",
    createdAt: "",
    updatedAt: "",
  }));
}

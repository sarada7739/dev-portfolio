import featuredJson from "./featured.json";
import worksJson from "./works.json";
import howIWorkJson from "./how-i-work.json";
import siteJson from "./site.json";
import type { Featured, HowIWorkItem, SiteMeta, Work } from "./types";

export const featured = featuredJson satisfies Featured;
export const works = worksJson satisfies Work[];
// JSON 由来の marker/markerColor は string 型に広がるため satisfies では絞れず as を使う
export const howIWork = howIWorkJson as HowIWorkItem[];
export const site = siteJson satisfies SiteMeta;

export type { Featured, HowIWorkItem, SiteMeta, Work };

export interface TemplateLayer {
  type: "text" | "rect" | "circle";
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fill?: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  radius?: number;
  fontWeight?: string;
  textAlign?: string;
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: "Streetwear" | "Minimal" | "Typography" | "Graphics";
  thumbnail: string;
  layers: TemplateLayer[];
}

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: "temp-01",
    name: "CYBER CORE",
    category: "Streetwear",
    thumbnail: "/templates/temp-01.jpg",
    layers: [
      { type: "text", text: "CYBER", fontFamily: "Inter", fontSize: 80, fontWeight: "black", fill: "#39FF14", left: 100, top: 150, textAlign: "center" },
      { type: "text", text: "2026 DEPLOYMENT", fontFamily: "Inter", fontSize: 20, fontWeight: "bold", fill: "#ffffff", left: 140, top: 230, textAlign: "center" }
    ]
  },
  {
    id: "temp-02",
    name: "MINIMALIST LOGO",
    category: "Minimal",
    thumbnail: "/templates/temp-02.jpg",
    layers: [
      { type: "rect", width: 100, height: 100, fill: "#39FF14", left: 200, top: 200 },
      { type: "text", text: "KIRO", fontFamily: "Inter", fontSize: 30, fontWeight: "black", fill: "#ffffff", left: 215, top: 310 }
    ]
  },
  {
    id: "temp-03",
    name: "HYPER TYPO",
    category: "Typography",
    thumbnail: "/templates/temp-03.jpg",
    layers: [
      { type: "text", text: "TO THE", fontFamily: "Inter", fontSize: 40, fontWeight: "light", fill: "#555", left: 150, top: 150 },
      { type: "text", text: "FUTURE", fontFamily: "Inter", fontSize: 90, fontWeight: "black", fill: "#ffffff", left: 100, top: 180 }
    ]
  },
  {
    id: "temp-04",
    name: "INDUSTRIAL ARC",
    category: "Graphics",
    thumbnail: "/templates/temp-04.jpg",
    layers: [
      { type: "circle", radius: 50, fill: "transparent", left: 200, top: 200 }, // Fabric doesn't support stroke in this simplified interface easily, but we'll use fill
      { type: "text", text: "KIRO LABS", fontFamily: "Inter", fontSize: 25, fontWeight: "bold", fill: "#39FF14", left: 190, top: 240 }
    ]
  }
];

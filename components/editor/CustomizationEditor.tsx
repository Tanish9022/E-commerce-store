"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import { Upload, Type, Trash2, Layers, MoveUp, MoveDown, Eye, EyeOff, Lock, Unlock, Undo, Redo, ShoppingBag, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { DESIGN_TEMPLATES, DesignTemplate } from "@/data/designTemplates";
import { debounce } from "lodash";

const MAX_HISTORY = 50;

export default function CustomizationEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"tools" | "templates">("tools");
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState("All");
  
  // Layer & Object State
  const [layers, setLayers] = useState<fabric.Object[]>([]);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  
  // History State
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isHistoryUpdate = useRef(false);

  // Text Properties
  const [textProps, setTextProps] = useState({
    fontFamily: "Inter",
    fontSize: 40,
    fill: "#ffffff",
    textAlign: "left",
    fontWeight: "normal",
    fontStyle: "normal"
  });

  const addItem = useCartStore(state => state.addItem);

  // 1. Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: "#111",
      preserveObjectStacking: true,
    });

    setCanvas(c);

    return () => {
      c.dispose();
    };
  }, []);

  const syncLayers = useCallback(() => {
    if (!canvas) return;
    setLayers([...canvas.getObjects()].reverse());
  }, [canvas]);

  const handleSelection = useCallback(() => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    setActiveObject(obj || null);
    if (obj && obj.type === "i-text") {
      const t = obj as fabric.IText;
      setTextProps({
        fontFamily: t.fontFamily || "Inter",
        fontSize: t.fontSize || 40,
        fill: t.fill as string || "#ffffff",
        textAlign: t.textAlign || "left",
        fontWeight: t.fontWeight as string || "normal",
        fontStyle: t.fontStyle as string || "normal"
      });
    }
  }, [canvas]);

  // Debounced history saver
  const saveHistory = useCallback(debounce(() => {
    if (!canvas || isHistoryUpdate.current) {
      isHistoryUpdate.current = false;
      return;
    }
    const json = JSON.stringify(canvas.toJSON());
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(json);
      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return newHistory;
    });
    
    setHistoryIndex(prev => {
      const next = prev + 1;
      return next >= MAX_HISTORY ? MAX_HISTORY - 1 : next;
    });
    
    syncLayers();
  }, 300), [canvas, historyIndex, syncLayers]);

  // 2. Event Listeners
  useEffect(() => {
    if (!canvas) return;

    canvas.on("object:added", saveHistory);
    canvas.on("object:modified", saveHistory);
    canvas.on("object:removed", saveHistory);
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setActiveObject(null));

    // Initial history state
    if (history.length === 0) {
      const json = JSON.stringify(canvas.toJSON());
      setHistory([json]);
      setHistoryIndex(0);
      syncLayers();
    }

    return () => {
      canvas.off("object:added");
      canvas.off("object:modified");
      canvas.off("object:removed");
      canvas.off("selection:created");
      canvas.off("selection:updated");
      canvas.off("selection:cleared");
    };
  }, [canvas, saveHistory, handleSelection]); // Removed history from dependencies to avoid re-attaching

  // 3. History Controls
  const undo = () => {
    if (!canvas || historyIndex <= 0) return;
    isHistoryUpdate.current = true;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      syncLayers();
    });
  };

  const redo = () => {
    if (!canvas || historyIndex >= history.length - 1) return;
    isHistoryUpdate.current = true;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      syncLayers();
    });
  };

  // 4. Tools & Templates
  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText("NEW TEXT", {
      left: 150, top: 250,
      fontFamily: textProps.fontFamily,
      fill: textProps.fill,
      fontSize: textProps.fontSize,
      fontWeight: textProps.fontWeight as any,
      textAlign: textProps.textAlign as any,
    });
    (text as any).id = `text_${Date.now()}`;
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const addShape = (type: "rect" | "circle") => {
    if (!canvas) return;
    let shape;
    if (type === "rect") {
      shape = new fabric.Rect({
        left: 200, top: 200,
        width: 100, height: 100,
        fill: "#39FF14",
      });
    } else {
      shape = new fabric.Circle({
        left: 200, top: 200,
        radius: 50,
        fill: "#39FF14",
      });
    }
    (shape as any).id = `shape_${Date.now()}`;
    canvas.add(shape);
    canvas.setActiveObject(shape);
  };

  const handleDesignUpload = async (url: string) => {
    if (!canvas) return;
    const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    img.scaleToWidth(250);
    (img as any).id = `img_${Date.now()}`;
    canvas.add(img);
    canvas.centerObject(img);
    canvas.setActiveObject(img);
  };

  const loadTemplate = (template: DesignTemplate) => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#111";
    
    template.layers.forEach((layer) => {
      let obj;
      if (layer.type === "text") {
        obj = new fabric.IText(layer.text || "", {
          left: layer.left, top: layer.top,
          fontFamily: layer.fontFamily,
          fontSize: layer.fontSize,
          fontWeight: layer.fontWeight as any,
          fill: layer.fill,
          textAlign: layer.textAlign as any,
        });
      } else if (layer.type === "rect") {
        obj = new fabric.Rect({
          left: layer.left, top: layer.top,
          width: layer.width, height: layer.height,
          fill: layer.fill,
        });
      } else if (layer.type === "circle") {
        obj = new fabric.Circle({
          left: layer.left, top: layer.top,
          radius: layer.radius,
          fill: layer.fill,
        });
      }
      
      if (obj) {
        (obj as any).id = `temp_${Date.now()}_${Math.random()}`;
        canvas.add(obj);
      }
    });
    
    canvas.renderAll();
    saveHistory(); // Manual trigger for template load
  };

  const filteredTemplates = selectedTemplateCategory === "All" 
    ? DESIGN_TEMPLATES 
    : DESIGN_TEMPLATES.filter(t => t.category === selectedTemplateCategory);

  // 5. Property Controls
  const updateTextProp = (key: string, value: string | number) => {
    if (!canvas || !activeObject || activeObject.type !== "i-text") return;
    (activeObject as any).set(key, value);
    canvas.renderAll();
    setTextProps(prev => ({ ...prev, [key]: value }));
    saveHistory(); // Trigger history update
  };

  // 6. Layer Controls
  const deleteObject = (obj: fabric.Object) => {
    if (!canvas) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
  };

  const toggleVisibility = (obj: fabric.Object) => {
    if (!canvas) return;
    obj.set("visible", !obj.visible);
    canvas.renderAll();
    saveHistory();
  };

  const toggleLock = (obj: fabric.Object) => {
    if (!canvas) return;
    const isLocked = obj.lockMovementX;
    obj.set({
      lockMovementX: !isLocked, lockMovementY: !isLocked,
      lockRotation: !isLocked, lockScalingX: !isLocked, lockScalingY: !isLocked,
      hasControls: isLocked, selectable: isLocked
    });
    canvas.renderAll();
    saveHistory();
  };

  const moveLayer = (obj: fabric.Object, direction: "up" | "down") => {
    if (!canvas) return;
    direction === "up" ? canvas.bringObjectForward(obj) : canvas.sendObjectBackwards(obj);
    canvas.renderAll();
    syncLayers();
    saveHistory();
  };

  const handleAddToCart = async () => {
    if (!canvas) return;
    const previewUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    addItem({
      id: "custom-product-1",
      name: "Custom Kiro Hoodie",
      price: 120,
      size: "M",
      quantity: 1,
      image: previewUrl,
      customizationData: { json: canvas.toJSON(), preview: previewUrl }
    });
    window.location.href = "/checkout";
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-stretch h-[800px]">
      
      {/* LEFT: Tools & Templates Panel */}
      <div className="w-full xl:w-80 glass-card rounded-3xl flex flex-col h-full overflow-hidden border-white/5">
        <div className="flex border-b border-white/5">
          <button 
            onClick={() => setActiveTab("tools")}
            className={cn(
              "flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
              activeTab === "tools" ? "text-accent bg-accent/5" : "text-zinc-500 hover:text-white"
            )}
          >
            Studio Tools
          </button>
          <button 
            onClick={() => setActiveTab("templates")}
            className={cn(
              "flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
              activeTab === "templates" ? "text-accent bg-accent/5" : "text-zinc-500 hover:text-white"
            )}
          >
            Presets
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-8">
          {activeTab === "tools" ? (
            <>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 px-2">Components</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={addText} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-zinc-900/50 hover:bg-accent/10 hover:text-accent transition-all border border-white/5 group">
                    <Type className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Add Text</span>
                  </button>
                  <div className="border border-white/5 rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
                    <ImageUploader folder="user-designs" label="Upload" onUploadSuccess={handleDesignUpload} className="p-0 border-none bg-transparent" />
                  </div>
                  <button onClick={() => addShape("rect")} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-zinc-900/50 hover:bg-accent/10 hover:text-accent transition-all border border-white/5 group">
                    <div className="w-5 h-5 border-2 border-current rounded-sm group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Square</span>
                  </button>
                  <button onClick={() => addShape("circle")} className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-zinc-900/50 hover:bg-accent/10 hover:text-accent transition-all border border-white/5 group">
                    <div className="w-5 h-5 border-2 border-current rounded-full group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Circle</span>
                  </button>
                </div>
              </div>

              {activeObject && activeObject.type === "i-text" && (
                <div className="space-y-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-left-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2">Text Properties</h3>
                  <div className="space-y-4 px-2">
                    <input 
                      type="color" value={textProps.fill} 
                      onChange={(e) => updateTextProp("fill", e.target.value)}
                      className="w-full h-12 rounded-xl cursor-pointer bg-zinc-900 border border-white/10 p-1"
                    />
                    <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5">
                      {[
                        { icon: AlignLeft, value: "left" },
                        { icon: AlignCenter, value: "center" },
                        { icon: AlignRight, value: "right" }
                      ].map((btn) => (
                        <button 
                          key={btn.value} onClick={() => updateTextProp("textAlign", btn.value)}
                          className={cn("flex-1 p-3 rounded-lg flex justify-center transition-colors", textProps.textAlign === btn.value ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white")}
                        >
                          <btn.icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateTextProp("fontWeight", textProps.fontWeight === "bold" ? "normal" : "bold")}
                        className={cn("flex-1 p-4 rounded-xl border transition-all", textProps.fontWeight === "bold" ? "bg-white text-black border-white shadow-lg shadow-white/10" : "bg-zinc-900 border-white/5 text-zinc-400")}
                      >
                        <Bold className="w-4 h-4 mx-auto" />
                      </button>
                      <button 
                        onClick={() => updateTextProp("fontStyle", textProps.fontStyle === "italic" ? "normal" : "italic")}
                        className={cn("flex-1 p-4 rounded-xl border transition-all", textProps.fontStyle === "italic" ? "bg-white text-black border-white shadow-lg shadow-white/10" : "bg-zinc-900 border-white/5 text-zinc-400")}
                      >
                        <Italic className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 px-2">Library Filters</h3>
                <div className="flex flex-wrap gap-2 px-2">
                  {["All", "Streetwear", "Minimal", "Typography"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedTemplateCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                        selectedTemplateCategory === cat ? "bg-white text-black border-white" : "border-white/10 text-zinc-500 hover:border-white/30"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 px-2">Design Presets</h3>
                <div className="grid grid-cols-1 gap-4">
                  {filteredTemplates.map((template) => (
                    <div 
                      key={template.id}
                      onClick={() => loadTemplate(template)}
                      className="group relative aspect-video rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden cursor-pointer hover:border-accent/50 transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                      <div className="absolute inset-0 flex items-center justify-center bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                         <span className="bg-white text-black px-4 py-2 rounded-full font-black text-[8px] uppercase tracking-widest transform scale-90 group-hover:scale-100 transition-transform">Apply Preset</span>
                      </div>
                      <div className="absolute bottom-4 left-4 z-20">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white">{template.name}</p>
                        <p className="text-[7px] font-bold uppercase tracking-widest text-accent mt-1">{template.category}</p>
                      </div>
                      <div className="w-full h-full bg-zinc-800 animate-pulse group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Canvas Studio */}
      <div className="flex-1 glass-card rounded-[3rem] p-8 flex flex-col items-center justify-center relative bg-[url('/assets/grid.png')] bg-repeat bg-center overflow-hidden">
        <div className="absolute top-6 left-8 right-8 flex justify-between items-center z-10">
          <div className="flex gap-2">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-3 rounded-full bg-black/50 backdrop-blur border border-white/10 text-white disabled:opacity-30 transition-all hover:bg-white/10">
              <Undo className="w-4 h-4" />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-3 rounded-full bg-black/50 backdrop-blur border border-white/10 text-white disabled:opacity-30 transition-all hover:bg-white/10">
              <Redo className="w-4 h-4" />
            </button>
          </div>
          <span className="px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest backdrop-blur">
            Live Preview
          </span>
        </div>
        <div className="relative shadow-2xl shadow-black/50 border border-white/10 rounded-lg">
           <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-accent/20 rounded-lg" />
           <canvas ref={canvasRef} className="rounded-lg" />
        </div>
      </div>

      {/* RIGHT: Layers & Checkout */}
      <div className="w-full xl:w-80 flex flex-col gap-6 h-full">
        <div className="glass-card rounded-3xl p-6 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
            <Layers className="w-5 h-5 text-accent" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Layer Stack</h3>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-2">
            {layers.length === 0 ? (
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-center mt-10">No layers active</p>
            ) : (
              layers.map((layer: any, i) => (
                <div 
                  key={layer.id || i}
                  onClick={() => { canvas?.setActiveObject(layer); canvas?.renderAll(); }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
                    activeObject === layer ? "bg-white/10 border-white/20" : "bg-zinc-900/50 border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    {layer.type === "i-text" ? <Type className="w-3 h-3 text-accent" /> : (layer.type === "rect" || layer.type === "circle") ? <div className="w-3 h-3 border border-zinc-400 rounded-sm" /> : <Upload className="w-3 h-3 text-zinc-400" />}
                    <span className="text-xs font-bold truncate max-w-[100px]">
                      {layer.type === "i-text" ? layer.text : layer.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); toggleVisibility(layer); }} className="p-1.5 hover:text-white text-zinc-500">
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleLock(layer); }} className="p-1.5 hover:text-white text-zinc-500">
                      {layer.lockMovementX ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                    <div className="flex flex-col -space-y-1 px-1">
                      <button onClick={(e) => { e.stopPropagation(); moveLayer(layer, "up"); }} className="hover:text-accent text-zinc-500"><MoveUp className="w-3 h-3" /></button>
                      <button onClick={(e) => { e.stopPropagation(); moveLayer(layer, "down"); }} className="hover:text-accent text-zinc-500"><MoveDown className="w-3 h-3" /></button>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteObject(layer); }} className="p-1.5 hover:text-red-500 text-zinc-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6 border-accent/20">
          <Button variant="accent" size="lg" className="w-full" onClick={handleAddToCart}>
            <ShoppingBag className="w-4 h-4 mr-3" />
            Complete Design
          </Button>
        </div>
      </div>
    </div>
  );
}

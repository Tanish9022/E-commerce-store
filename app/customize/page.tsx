import Navbar from "@/components/Navbar";
import CustomizationEditor from "@/components/editor/CustomizationEditor";

export default function CustomizePage() {
  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-accent font-black uppercase tracking-[0.3em] text-xs mb-4 block underline underline-offset-8">Studio</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Design Your <span className="text-accent italic">Legacy.</span>
          </h1>
          <p className="text-zinc-500 mt-6 max-w-xl font-light">
            Every masterpiece starts with a blank canvas. Upload your art, add your message, and let us bring it to life on premium fabrics.
          </p>
        </div>

        <CustomizationEditor />
      </div>
    </main>
  );
}

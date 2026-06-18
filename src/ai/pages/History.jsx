import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Trash2, Download, ImageOff, Loader2, Sparkles } from 'lucide-react';
import { genApi } from '../services/aiService';

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await genApi.list({ type: 'image', limit: 60 });
      setItems(data.items || []);
    } catch {
      toast.error('Could not load history');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
    try {
      await genApi.remove(id);
    } catch {
      toast.error('Delete failed');
      load();
    }
  };

  const download = async (url) => {
    try {
      const blob = await (await fetch(url)).blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `aether-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">History</h1>
        <p className="text-sm text-white/45">Everything you've created with Aether.</p>
      </div>

      {loading ? (
        <div className="grid place-items-center py-24 text-white/40">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="ae-card grid place-items-center gap-3 py-20 text-center">
          <ImageOff className="h-10 w-10 text-white/25" />
          <p className="text-white/50">No generations yet.</p>
          <a href="/app" className="ae-btn mt-1">
            <Sparkles className="h-4 w-4" /> Create your first
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className="group relative overflow-hidden rounded-2xl ae-glass"
            >
              <div className="aspect-square">
                <img src={it.url} alt={it.prompt} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 opacity-0 transition group-hover:opacity-100">
                <div className="flex justify-end gap-1.5">
                  <IconBtn onClick={() => download(it.url)}><Download className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn onClick={() => remove(it._id)} danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                </div>
                <p className="line-clamp-2 text-[11px] leading-snug text-white/85">{it.prompt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white backdrop-blur transition hover:bg-black/70 ${danger ? 'hover:text-red-300' : ''}`}
    >
      {children}
    </button>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ImageIcon, Video, Sparkles, Loader2, Download, Wand2, Clapperboard } from 'lucide-react';
import { genApi } from '../services/aiService';
import { setCredits } from '../store/slices/authSlice';
import {
  ASPECT_RATIOS, STYLES, QUALITIES, VIDEO_DURATIONS, VIDEO_FORMATS, VIDEO_RESOLUTIONS,
} from '../lib/constants';

export default function Dashboard() {
  const [tab, setTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [result, setResult] = useState(null); // { url } for image
  const [img, setImg] = useState({ aspectRatio: '1:1', style: 'none', quality: 'standard' });
  const [vid, setVid] = useState({ duration: '5', format: 'horizontal', resolution: '720p' });

  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error('Enter a prompt first');
    setLoading(true);
    setResult(null);
    setImgLoaded(false);
    try {
      if (tab === 'image') {
        const data = await genApi.image({ prompt, ...img });
        setResult({ url: data.generation.url });
        if (data.credits !== null && data.credits !== undefined) dispatch(setCredits(data.credits));
      } else {
        const res = await genApi.video({ prompt, ...vid });
        toast(res.message || 'Video generation is coming soon', { icon: '🎬', duration: 6000 });
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || 'Generation failed';
      if (status === 402) {
        toast.error(msg);
        navigate('/subscription');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    try {
      const blob = await (await fetch(result.url)).blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `nyra-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(result.url, '_blank');
    }
  };

  const aspectClass =
    tab === 'image'
      ? { '1:1': 'aspect-square', '16:9': 'aspect-video', '9:16': 'aspect-[9/16]' }[img.aspectRatio]
      : vid.format === 'vertical' ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Create with <span className="ae-gradient-text">AI</span>
        </h1>
        <p className="text-sm text-white/45">Describe anything. Nyra brings it to life.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 inline-flex rounded-2xl ae-glass p-1.5">
        <TabBtn active={tab === 'image'} onClick={() => { setTab('image'); setResult(null); }} icon={ImageIcon} label="Image" />
        <TabBtn active={tab === 'video'} onClick={() => { setTab('video'); setResult(null); }} icon={Video} label="Video" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        {/* Left: prompt + result */}
        <div className="space-y-5">
          <div className="ae-card p-4 sm:p-5">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              placeholder={
                tab === 'image'
                  ? "Describe your image in English...\nExample: A lion sitting on a mountain at sunset"
                  : "Describe your video in English...\nExample: A car driving through a city at night"
              }
              className="ae-input min-h-[120px] resize-none border-0 bg-transparent px-1 text-base focus:ring-0"
            />
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
              <span className="text-xs text-white/35">
                {tab === 'image' ? '1 credit' : '10 credits'} per generation
              </span>
              <button onClick={handleGenerate} disabled={loading} className="ae-btn">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Generate
              </button>
            </div>
          </div>

          {/* Result canvas */}
          <div className={`relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl ae-glass ${aspectClass}`}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center">
                  <div className="flex flex-col items-center gap-3 text-white/50">
                    <div className="relative">
                      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-brand" />
                      <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-brand-soft" />
                    </div>
                    <p className="text-sm">Generating…</p>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,transparent,rgba(168,85,247,0.08),transparent)]" />
                </motion.div>
              ) : result?.url && tab === 'image' ? (
                <motion.div key="img" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} className="group absolute inset-0">
                  {!imgLoaded && (
                    <div className="absolute inset-0 grid place-items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white/40" />
                    </div>
                  )}
                  <img
                    src={result.url}
                    alt="result"
                    onLoad={() => setImgLoaded(true)}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                  {imgLoaded && (
                    <button onClick={download} className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-black/50 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-black/70 opacity-0 group-hover:opacity-100">
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 grid place-items-center text-center">
                  <div className="flex flex-col items-center gap-2 text-white/25">
                    {tab === 'image' ? <ImageIcon className="h-10 w-10" /> : <Clapperboard className="h-10 w-10" />}
                    <p className="text-sm">Your {tab} will appear here</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: options */}
        <div className="ae-card h-fit space-y-5 p-5">
          <h3 className="text-sm font-semibold text-white/80">Options</h3>
          {tab === 'image' ? (
            <>
              <OptionRow label="Aspect ratio">
                {ASPECT_RATIOS.map((a) => (
                  <button key={a.id} onClick={() => setImg((s) => ({ ...s, aspectRatio: a.id }))} className={`ae-chip flex items-center gap-2 ${img.aspectRatio === a.id ? 'ae-chip-on' : 'ae-chip-off'}`}>
                    <span className={`rounded-[3px] border border-current ${a.box}`} /> {a.label}
                  </button>
                ))}
              </OptionRow>
              <OptionRow label="Style">
                {STYLES.map((s) => (
                  <Chip key={s.id} on={img.style === s.id} onClick={() => setImg((p) => ({ ...p, style: s.id }))}>{s.label}</Chip>
                ))}
              </OptionRow>
              <OptionRow label="Quality">
                {QUALITIES.map((q) => (
                  <Chip key={q.id} on={img.quality === q.id} onClick={() => setImg((p) => ({ ...p, quality: q.id }))}>{q.label}</Chip>
                ))}
              </OptionRow>
            </>
          ) : (
            <>
              <OptionRow label="Duration">
                {VIDEO_DURATIONS.map((d) => (
                  <Chip key={d.id} on={vid.duration === d.id} onClick={() => setVid((p) => ({ ...p, duration: d.id }))}>{d.label}</Chip>
                ))}
              </OptionRow>
              <OptionRow label="Format">
                {VIDEO_FORMATS.map((f) => (
                  <Chip key={f.id} on={vid.format === f.id} onClick={() => setVid((p) => ({ ...p, format: f.id }))}>{f.label}</Chip>
                ))}
              </OptionRow>
              <OptionRow label="Resolution">
                {VIDEO_RESOLUTIONS.map((r) => (
                  <Chip key={r.id} on={vid.resolution === r.id} onClick={() => setVid((p) => ({ ...p, resolution: r.id }))}>{r.label}</Chip>
                ))}
              </OptionRow>
              <p className="rounded-xl border border-brand/20 bg-brand/5 p-3 text-xs text-white/55">
                🎬 Video generation launches soon. Pro & Ultra plans unlock it at launch.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${active ? 'bg-brand-grad text-white shadow-glow-sm' : 'text-white/55 hover:text-white'}`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function OptionRow({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/35">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }) {
  return (
    <button onClick={onClick} className={`ae-chip ${on ? 'ae-chip-on' : 'ae-chip-off'}`}>
      {children}
    </button>
  );
}

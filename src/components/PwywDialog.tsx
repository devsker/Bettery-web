import { createSignal, Show, For, createMemo } from "solid-js";
import { Dialog } from "@kobalte/core/dialog";
import {
  ArrowRight,
  Download,
  ChevronLeft,
  Heart,
  Coffee,
  CircleDollarSign,
  Star,
  Copy,
  Check
} from "lucide-solid";

export interface Binary {
  name: string;
  browser_download_url: string;
  is_recommended?: boolean;
}

interface PwywDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  binaries: Binary[];
  paypalUrl?: string;
  projectName?: string;
}

type Stage = "amount" | "payment" | "format" | "downloaded";

export function PwywDialog(props: PwywDialogProps) {
  const [stage, setStage] = createSignal<Stage>("amount");
  const [amount, setAmount] = createSignal<number | null>(null);
  const [customAmount, setCustomAmount] = createSignal<string>("");

  const presets = [
    { label: "Free", value: 0, icon: Download },
    { label: "$3", value: 3, icon: Coffee },
    { label: "$5", value: 5, icon: Heart },
    { label: "$10", value: 10, icon: CircleDollarSign },
  ];

  const currentAmount = createMemo(() => {
    const val = amount();
    if (val !== null) return val;
    const parsed = parseFloat(customAmount());
    return isNaN(parsed) ? 0 : parsed;
  });

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    if (/^\d*\.?\d*$/.test(val)) {
      setCustomAmount(val);
      setAmount(null);
    }
  };

  const triggerDownload = (url: string) => {
    window.location.href = url;
    setStage("downloaded");
  };

  const handleContinue = () => {
    const val = currentAmount();
    if (val === 0) {
      if (props.binaries.length === 1) {
        triggerDownload(props.binaries[0].browser_download_url);
      } else {
        setStage("format");
      }
    } else {
      setStage("payment");
    }
  };

  const handlePaymentConfirm = () => {
    if (props.paypalUrl) {
      window.open(props.paypalUrl, "_blank");
    }
    if (props.binaries.length === 1) {
      triggerDownload(props.binaries[0].browser_download_url);
    } else {
      setStage("format");
    }
  };

  const [copied, setCopied] = createSignal(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStage("amount");
    setAmount(null);
    setCustomAmount("");
    setCopied(false);
  };

  return (
    <Dialog open={props.open} onOpenChange={(o) => { if (!o) reset(); props.onOpenChange(o); }}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content class="w-full max-w-[440px] bg-white dark:bg-neutral-950 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-neutral-100 dark:border-neutral-900 relative">
            
            <div class="p-12">
              <Show when={stage() === "amount"}>
                <div class="flex flex-col">
                  <div class="space-y-3">
                    <Dialog.Title class="text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-50">
                      Support {props.projectName || "the project"}
                    </Dialog.Title>
                    <Dialog.Description class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Your contribution helps keep development alive.
                    </Dialog.Description>
                  </div>

                  <div class="mt-16 grid grid-cols-2 gap-4">
                    <For each={presets}>
                      {(preset) => (
                        <button
                          onClick={() => handleAmountSelect(preset.value)}
                          class={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${
                            amount() === preset.value
                              ? "border-neutral-800 dark:border-neutral-50 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-50 shadow-sm"
                              : "border-neutral-100 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-500 dark:text-neutral-400"
                          }`}
                        >
                          <span class="text-xs font-semibold">{preset.label}</span>
                          <preset.icon size={14} class={amount() === preset.value ? "text-neutral-800 dark:text-neutral-50" : ""} />
                        </button>
                      )}
                    </For>
                  </div>

                  <div class="mt-14 space-y-4">
                    <label class="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest px-1">
                      Custom amount ($)
                    </label>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={customAmount()}
                      onInput={handleCustomAmountChange}
                      class="w-full px-4 py-2 rounded-xl border border-neutral-100 dark:border-neutral-900 bg-transparent focus:border-neutral-800 dark:focus:border-neutral-50 focus:ring-1 focus:ring-neutral-800 dark:focus:ring-neutral-50 outline-none transition-all text-sm text-neutral-800 dark:text-neutral-50"
                    />
                  </div>

                  <div class="mt-16">
                    <button
                      onClick={handleContinue}
                      class="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-neutral-800 dark:bg-gray-50 text-white dark:text-gray-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
                    >
                      {currentAmount() === 0 ? "Download Free" : `Continue with $${currentAmount()}`}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </Show>

              <Show when={stage() === "payment"}>
                <div class="flex flex-col">
                  <button 
                    onClick={() => setStage("amount")}
                    class="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-50 transition"
                  >
                    <ChevronLeft size={14} />
                    Back
                  </button>

                  <div class="mt-10 space-y-2">
                    <Dialog.Title class="text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-50">
                      Complete Payment
                    </Dialog.Title>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Supporting with <strong class="text-neutral-800 dark:text-neutral-50 font-semibold">${currentAmount()}</strong>.
                    </p>
                  </div>

                  <div class="mt-14 p-5 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-900 leading-relaxed">
                    PayPal will open in a new tab. Return here to start your download.
                  </div>

                  <div class="mt-16">
                    <button
                      onClick={handlePaymentConfirm}
                      class="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-neutral-800 dark:bg-gray-50 text-white dark:text-gray-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
                    >
                      Pay & Download
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </Show>

              <Show when={stage() === "format"}>
                <div class="flex flex-col">
                  <Show when={currentAmount() > 0}>
                    <button 
                      onClick={() => setStage("payment")}
                      class="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-50 transition"
                    >
                      <ChevronLeft size={14} />
                      Back
                    </button>
                  </Show>
                  <Show when={currentAmount() === 0}>
                    <button 
                      onClick={() => setStage("amount")}
                      class="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-50 transition"
                    >
                      <ChevronLeft size={14} />
                      Back
                    </button>
                  </Show>

                  <div class="mt-10 space-y-2">
                    <Dialog.Title class="text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-50">
                      Select Version
                    </Dialog.Title>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">
                      Choose the format for your system.
                    </p>
                  </div>

                  <div class="mt-14 space-y-4">
                    <For each={props.binaries}>
                      {(binary) => (
                        <a
                          href={binary.browser_download_url}
                          onClick={(e) => { e.preventDefault(); triggerDownload(binary.browser_download_url); }}
                          class="flex items-center justify-between px-5 py-4 rounded-xl border border-neutral-100 dark:border-neutral-900 hover:border-neutral-800 dark:hover:border-neutral-50 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-all group cursor-pointer"
                        >
                          <div class="flex items-center gap-4">
                            <div class={`p-2 rounded-lg ${binary.is_recommended ? 'bg-neutral-800 dark:bg-neutral-50 text-white dark:text-neutral-900' : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-400'}`}>
                              <Download size={14} />
                            </div>
                            <div class="flex flex-col gap-0.5">
                              <span class="text-sm font-semibold text-neutral-800 dark:text-neutral-50">{binary.name}</span>
                              <Show when={binary.is_recommended}>
                                <span class="text-[9px] uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                                  <Star size={9} fill="currentColor" />
                                  Recommended
                                </span>
                              </Show>
                            </div>
                          </div>
                          <ArrowRight size={14} class="text-neutral-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-50 transition-colors" />
                        </a>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
              <Show when={stage() === "downloaded"}>
                <div class="flex flex-col gap-8">
                  <div class="space-y-1.5">
                    <Dialog.Title class="text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-50">
                      Download started
                    </Dialog.Title>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">
                      If macOS blocks the app, run this in Terminal:
                    </p>
                  </div>

                  <div class="flex items-center justify-between gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-900">
                    <code class="text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate">
                      xattr -cr ~/Downloads/{props.projectName || "Bettery"}.app
                    </code>
                    <button
                      onClick={() => handleCopy(`xattr -cr ~/Downloads/${props.projectName || "Bettery"}.app`)}
                      class="shrink-0 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-50 transition-colors"
                    >
                      <Show when={copied()} fallback={<Copy size={14} />}>
                        <Check size={14} class="text-green-500" />
                      </Show>
                    </button>
                  </div>

                  <button
                    onClick={() => { reset(); props.onOpenChange(false); }}
                    class="w-full px-6 py-2.5 rounded-full bg-neutral-800 dark:bg-gray-50 text-white dark:text-gray-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </Show>
            </div>

            <Dialog.CloseButton class="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Dialog.CloseButton>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
}

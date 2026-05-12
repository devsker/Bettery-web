import { createSignal, createResource, Show } from "solid-js";
import { PwywDialog, type Binary } from "./components/PwywDialog";

const fetchReleases = async () => {
  const response = await fetch("https://codeberg.org/api/v1/repos/sker/bettery/releases/latest");
  if (!response.ok) throw new Error("Failed to fetch releases");
  const data = await response.json();
  return data.assets.map((asset: any) => ({
    name: asset.name,
    browser_download_url: asset.browser_download_url,
    is_recommended: asset.name.toLowerCase().includes("universal") || asset.name.toLowerCase().includes("apple"),
  })) as Binary[];
};

function App() {
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);
  const [binaries] = createResource(fetchReleases);

  return (
    <main class="flex flex-col gap-24 flex-1 px-8 py-16 md:px-6 md:py-12 lg:gap-32">
      <header class="flex items-center justify-between">
        <div class="inline-flex items-center gap-2.5 font-semibold text-neutral-800 dark:text-neutral-50 text-lg">
          <img src="/favicon.png" alt="Bettery" class="w-6 h-6" />
          <span>Bettery</span>
        </div>
        <a href="#features" class="text-neutral-600 dark:text-neutral-400 text-sm hover:text-neutral-800 dark:hover:text-neutral-50 transition-colors">
          Features
        </a>
      </header>

      <section class="max-w-6xl mx-auto w-full mt-20 md:mt-8 flex items-center gap-12">
        <div class="flex-1 flex justify-center">
          <img
            src="https://codeberg.org/sker/Bettery/media/branch/main/.sker/app-screenshot.png"
            alt="Bettery screenshot"
            class="max-w-xs w-full h-auto drop-shadow-2xl rounded-lg"
          />
        </div>

        <div class="flex-1 flex flex-col items-start gap-5">
          <h1 class="text-5xl md:text-3xl leading-tight tracking-tight text-neutral-800 dark:text-neutral-50">
            Your battery, beautifully detailed.
          </h1>
          <p class="text-lg leading-relaxed">
            A lightweight, customizable menu bar app that gives you insights into
            your battery percentage, remaining time, and power status, exactly how
            you want to see it.
          </p>
          <div class="flex gap-3 flex-wrap mt-2">
            <button
              onClick={() => setIsDialogOpen(true)}
              disabled={binaries.loading}
              class="inline-flex items-center px-6 py-3 rounded-full bg-neutral-800 dark:bg-gray-50 text-white dark:text-gray-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Show when={binaries.loading} fallback="Download for macOS">
                Fetching releases...
              </Show>
            </button>
          </div>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 opacity-75">
            Free · Apple Silicon &amp; Intel · macOS 13+
          </p>
        </div>
      </section>

      <PwywDialog 
        open={isDialogOpen()} 
        onOpenChange={setIsDialogOpen} 
        binaries={binaries() || []}
        projectName="Bettery"
        paypalUrl="https://paypal.me/proxyscripts"
      />

      <section id="features" class="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900 rounded-xl overflow-hidden">
        <div class="bg-white dark:bg-neutral-950 p-7">
          <h3 class="m-0 text-base font-semibold text-neutral-800 dark:text-neutral-50 tracking-tighter">
            Customizable icons
          </h3>
          <p class="text-sm leading-relaxed">
            Text inside the battery icon, or alongside it. Your choice.
          </p>
        </div>
        <div class="bg-white dark:bg-neutral-950 p-7">
          <h3 class="m-0 text-base font-semibold text-neutral-800 dark:text-neutral-50 tracking-tighter">
            Percentage or time
          </h3>
          <p class="text-sm leading-relaxed">
            Toggle between battery percentage and estimated time remaining.
          </p>
        </div>
        <div class="bg-white dark:bg-neutral-950 p-7">
          <h3 class="m-0 text-base font-semibold text-neutral-800 dark:text-neutral-50 tracking-tighter">
            Smart status
          </h3>
          <p class="text-sm leading-relaxed">
            Detects charging, Low Power Mode, and calculating states automatically.
          </p>
        </div>
        <div class="bg-white dark:bg-neutral-950 p-7">
          <h3 class="m-0 text-base font-semibold text-neutral-800 dark:text-neutral-50 tracking-tighter">
            Launch at login
          </h3>
          <p class="text-sm leading-relaxed">
            Starts quietly with your Mac. Configure window behavior on startup.
          </p>
        </div>
        <div class="bg-white dark:bg-neutral-950 p-7">
          <h3 class="m-0 text-base font-semibold text-neutral-800 dark:text-neutral-50 tracking-tighter">
            Native SwiftUI
          </h3>
          <p class="text-sm leading-relaxed">
            Built for modern macOS with a low-impact menu bar footprint.
          </p>
        </div>
        <div class="bg-white dark:bg-neutral-950 p-7">
          <h3 class="m-0 text-base font-semibold text-neutral-800 dark:text-neutral-50 tracking-tighter">
            Stays out of the way
          </h3>
          <p class="text-sm leading-relaxed">
            Quit or access settings anytime, right from the menu bar.
          </p>
        </div>
      </section>

      <footer class="mt-auto pt-8 flex gap-2 justify-center text-xs text-neutral-500 dark:text-neutral-400 opacity-70">
        <span>© {new Date().getFullYear()} Bettery</span>
        <span class="opacity-50">·</span>
        <a href="https://codeberg.org/sker/bettery" target="_blank" class="hover:text-neutral-800 dark:hover:text-neutral-50 transition-colors">Source</a>
        <span class="opacity-50">·</span>
        <a href="https://sker.lol" target="_blank" class="hover:text-neutral-800 dark:hover:text-neutral-50 transition-colors">by sker</a>
      </footer>
    </main>
  );
}

export default App;

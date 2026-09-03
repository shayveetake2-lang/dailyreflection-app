import { useEffect, useRef } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="backdrop:bg-brand-950/20 backdrop:backdrop-blur-sm open:animate-fade-in m-auto rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-2xl backdrop-blur-md dark:border-brand-800 dark:bg-brand-900/95 dark:text-brand-50 sm:p-8 w-[calc(100%-2rem)] max-w-md"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-brand-900 dark:text-brand-100">
            How to use this app
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100/50 text-brand-600 transition hover:bg-brand-200 hover:text-brand-800 dark:bg-brand-800/50 dark:text-brand-300 dark:hover:bg-brand-700 dark:hover:text-brand-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5 text-base leading-relaxed text-brand-800 dark:text-brand-200">
          <section>
            <h3 className="mb-2 font-medium text-brand-900 dark:text-brand-100">
              1. Write your thoughts ✍️
            </h3>
            <p>
              Fill out the form with your name, how you felt, and what you learned today. When you're done, click the <strong>Add reflection</strong> button at the bottom!
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-medium text-brand-900 dark:text-brand-100">
              2. Share with your teacher 💬
            </h3>
            <p className="mb-2">
              After you save, your reflection will pop up on the screen. To send it to your teacher on Slack, follow these easy steps:
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Click the <strong>💬 Slack</strong> button on your reflection. (This secretly copies your words!)</li>
              <li>Open your <strong>Slack</strong> app.</li>
              <li>Find your <strong>teacher's name</strong> and open a chat with them.</li>
              <li>
                Paste your message! Press <strong>Command + V</strong> (if you are on a Mac) or <strong>Control + V</strong> (if you are on Windows).
              </li>
              <li>Hit send! 🚀</li>
            </ol>
          </section>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-xl bg-brand-600 py-3 font-medium text-white transition hover:bg-brand-700 active:scale-[0.98]"
        >
          Got it!
        </button>
      </div>
    </dialog>
  );
}


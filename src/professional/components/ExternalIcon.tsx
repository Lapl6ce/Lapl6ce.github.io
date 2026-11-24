/** Drawn arrow after a link that opens in a new tab, with the same fact for screen readers. */
export default function ExternalIcon() {
  return (
    <>
      <svg className="ext" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
        <path d="M3 1.5h5.5V7M8.5 1.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="sr-only"> (opens in a new tab)</span>
    </>
  );
}

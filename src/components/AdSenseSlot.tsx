// src/components/AdSenseSlot.tsx
// Renders a standard Google AdSense leaderboard unit.
// The AdSense script in layout.tsx (see comment) fills this automatically.
// Props: dataAdClient = your publisher ID (e.g. "ca-pub-XXXXXXXXXXXXXXXX")
//        dataAdSlot   = the specific ad unit slot ID from AdSense dashboard

export default function AdSenseSlot({
  dataAdClient = "ca-pub-XXXXXXXXXXXXXXXX",
  dataAdSlot = "XXXXXXXXXX",
  className = "",
}: {
  dataAdClient?: string;
  dataAdSlot?: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "728px", height: "90px" }}
        data-ad-client={dataAdClient}
        data-ad-slot={dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
export { AdSenseSlot };

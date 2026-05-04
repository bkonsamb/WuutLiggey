interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "rectangle" | "vertical";
  className?: string;
}

export default function AdBanner({ format = "horizontal", className = "" }: AdBannerProps) {
  const sizes = {
    horizontal: "h-24 md:h-20",
    rectangle: "h-64",
    vertical: "h-96",
  };

  return (
    <div className={`w-full ${sizes[format]} ${className} bg-gradient-to-r from-gray-50 to-gray-100 border border-dashed border-gray-200 rounded-xl flex items-center justify-center`}>
      {/* Replace the content below with your actual Google AdSense code */}
      {/* 
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
      <div className="text-center">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Publicité</p>
        <p className="text-[10px] text-gray-300 mt-1">
          Espace publicitaire — Google AdSense
        </p>
      </div>
    </div>
  );
}

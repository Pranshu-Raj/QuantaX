import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

const scriptUrl = "https://s3.tradingview.com/external-embedding/embed-widget-";

interface StockDetailsProps {
  params: Promise<{ symbol: string }>;
}

const StockDetails = async ({ params }: StockDetailsProps) => {
  const { symbol } = await params;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <section className="lg:col-span-2 flex flex-col gap-6">
        <TradingViewWidget
          title=""
          scriptUrl={`${scriptUrl}symbol-info.js`}
          config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
          height={170}
          className="custom-chart"
        />
        <TradingViewWidget
          title=""
          scriptUrl={`${scriptUrl}advanced-chart.js`}
          config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
          height={600}
          className="custom-chart"
        />
        <TradingViewWidget
          title=""
          scriptUrl={`${scriptUrl}advanced-chart.js`}
          config={BASELINE_WIDGET_CONFIG(symbol)}
          height={600}
          className="custom-chart"
        />
      </section>

      <section className="flex flex-col gap-6">
        <WatchlistButton symbol={symbol} />
        <TradingViewWidget
          title=""
          scriptUrl={`${scriptUrl}technical-analysis.js`}
          config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
          height={400}
          className="custom-chart"
        />
        <TradingViewWidget
          title=""
          scriptUrl={`${scriptUrl}symbol-profile.js`}
          config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
          height={440}
          className="custom-chart"
        />
        <TradingViewWidget
          title=""
          scriptUrl={`${scriptUrl}financials.js`}
          config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
          height={464}
          className="custom-chart"
        />
      </section>
    </div>
  );
};

export default StockDetails;


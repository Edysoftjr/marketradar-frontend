"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

// ---------- Chart Container ----------
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ReactNode;
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children as React.ReactElement}
        </RechartsPrimitive.ResponsiveContainer>

      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

// ---------- Chart Style ----------
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, conf]) => conf.theme || conf.color
  );

  if (!colorConfig.length) return null;

  const styleContent = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const lines = colorConfig
        .map(([key, conf]) => {
          const color =
            (conf as any).theme && theme in (conf as any).theme
              ? (conf as any).theme[theme]
              : (conf as any).color;
          return color ? `  --color-${key}: ${color};` : "";
        })
        .filter(Boolean)
        .join("\n");

      return `${prefix} [data-chart=${id}] {\n${lines}\n}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: styleContent }} />;
};

// ---------- Tooltip ----------
const ChartTooltip = RechartsPrimitive.Tooltip;

interface ChartTooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  payload?: any[];
  label?: string | number;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  formatter?: (...args: any[]) => React.ReactNode;
  labelFormatter?: (...args: any[]) => React.ReactNode;
  color?: string;
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      label,
      hideLabel,
      labelFormatter,
      className,
      hideIndicator = false,
      indicator = "dot",
      formatter,
      color,
      nameKey,
      labelKey,
      ...rest
    },
    ref
  ) => {
    const { config } = useChart();
    if (!active || !payload?.length) return null;

    const tooltipLabel = (() => {
      if (hideLabel) return null;
      const [item] = payload;
      const key = labelKey || item.dataKey || item.name || "value";
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? (config[label as keyof typeof config]?.label as any) || label
          : itemConfig?.label ?? label;

      if (labelFormatter) {
        return (
          <div className="font-medium">
            {labelFormatter(value, payload)}
          </div>
        );
      }

      return value ? <div className="font-medium">{value}</div> : null;
    })();

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        {...rest}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item: any, index: number) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload?.fill || item.color;

            return (
              <div
                key={item.dataKey ?? index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {!hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px]",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1 h-2.5": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                          }
                        )}
                        style={{
                          backgroundColor: indicatorColor,
                          borderColor: indicatorColor,
                        }}
                      />
                    )}
                    <div className="flex flex-1 justify-between leading-none">
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {typeof item.value === "number"
                          ? item.value.toLocaleString()
                          : String(item.value)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

// ---------- Legend ----------
const ChartLegend = RechartsPrimitive.Legend;

interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: any[];
  verticalAlign?: "top" | "bottom" | "middle";
  hideIcon?: boolean;
  nameKey?: string;
}

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, payload, hideIcon = false, verticalAlign = "bottom", nameKey, ...props }, ref) => {
    const { config } = useChart();
    if (!payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
        {...props}
      >
        {payload.map((item: any) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div key={item.value ?? key} className="flex items-center gap-1.5">
              {!hideIcon && (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label ?? item.value ?? item.name}
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

// ---------- Helper ----------
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;

  const inner =
    "payload" in (payload as any) && typeof (payload as any).payload === "object"
      ? (payload as any).payload
      : undefined;

  let resolvedKey = key;

  if (
    key in (payload as any) &&
    typeof (payload as any)[key] === "string"
  ) {
    resolvedKey = (payload as any)[key];
  } else if (inner && typeof inner[key] === "string") {
    resolvedKey = inner[key];
  }

  return (config as any)[resolvedKey] ?? (config as any)[key];
}

// ---------- Exports ----------
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};

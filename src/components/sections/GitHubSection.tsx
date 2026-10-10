'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Flame, GitCommit, Github, RefreshCw, Sparkles, Users } from 'lucide-react';
import FadeUp from '../ui/FadeUp';
import { PALETTES, useCustomTheme } from '@/src/providers/custom-theme-provider';

const GITHUB_USERNAME = 'ismailjosim';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubData {
  totalContributions: number;
  contributions: ContributionDay[];
  user: {
    name: string;
    login: string;
    avatarUrl: string;
    bio: string;
    publicRepos: number;
    followers: number;
    following: number;
  };
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function GitHubSection() {
  const { palette } = useCustomTheme();
  const activePalette = PALETTES.find((p) => p.id === palette) ?? PALETTES[0];
  const primaryColor = activePalette.primaryColor;

  const [data, setData] = useState<GitHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/github');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error('API returned unsuccessful');
      }
    } catch (err) {
      console.error('Failed to load GitHub data:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const res = await fetch('/api/github');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (!ignore) {
          if (json.success) {
            setData(json);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load GitHub data:', err);
          setError(true);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  // Split the contributions list into weeks (53 weeks x 7 days)
  const { weeks, monthLabels, stats } = useMemo(() => {
    if (!data?.contributions || data.contributions.length === 0) {
      return {
        weeks: [] as ContributionDay[][],
        monthLabels: [] as { weekIndex: number; name: string }[],
        stats: {
          total: 0,
          longestStreak: 0,
          currentStreak: 0,
          activeDays: 0,
        },
      };
    }

    const weeksArr: ContributionDay[][] = [];
    for (let i = 0; i < data.contributions.length; i += 7) {
      weeksArr.push(data.contributions.slice(i, i + 7));
    }

    const months: { weekIndex: number; name: string }[] = [];
    weeksArr.forEach((w, idx) => {
      if (w.length === 0) return;
      const month = new Date(`${w[0].date}T00:00:00`).getMonth();
      const prevMonth =
        idx > 0 && weeksArr[idx - 1].length > 0
          ? new Date(`${weeksArr[idx - 1][0].date}T00:00:00`).getMonth()
          : -1;

      if (month !== prevMonth) {
        months.push({ weekIndex: idx, name: MONTH_NAMES[month] });
      }
    });

    // Calculate streak metrics
    let active = 0;
    let longest = 0;
    let current = 0;
    let tempStreak = 0;

    data.contributions.forEach((c) => {
      if (c.count > 0) {
        active++;
        tempStreak++;
        if (tempStreak > longest) longest = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    for (let i = data.contributions.length - 1; i >= 0; i--) {
      if (data.contributions[i].count > 0) {
        current++;
      } else {
        break;
      }
    }

    return {
      weeks: weeksArr,
      monthLabels: months,
      stats: {
        total: data.totalContributions || 0,
        longestStreak: longest,
        currentStreak: current,
        activeDays: active,
      },
    };
  }, [data]);

  const getCellFill = (level: number) => {
    switch (level) {
      case 1:
        return `${primaryColor}40`; // 25% opacity
      case 2:
        return `${primaryColor}80`; // 50% opacity
      case 3:
        return `${primaryColor}BF`; // 75% opacity
      case 4:
        return primaryColor; // 100% full vibrant color
      case 0:
      default:
        return 'var(--calendar-empty, rgba(120, 144, 156, 0.15))';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(`${dateStr}T00:00:00`);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="flex justify-center items-center py-12">
      <div className="container mx-auto px-4">
        <FadeUp>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Activity &amp; Open Source</span>
            </div>
            <h2 className="lg:text-4xl md:text-3xl text-2xl font-bold text-accent mb-2">
              My GitHub Contributions
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Real-time snapshot of my daily commits, open-source work, and code activity over the
              past year.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="bg-card/70 backdrop-blur-md border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl flex flex-col gap-6 relative overflow-hidden">
            {/* Top Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
              <div className="bg-background/60 border border-border/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 transition-all hover:border-accent/40">
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent shrink-0">
                  <GitCommit className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-foreground">
                    {isLoading ? '...' : (stats.total || 1200).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Total Contributions
                  </div>
                </div>
              </div>

              <div className="bg-background/60 border border-border/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 transition-all hover:border-accent/40">
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-foreground">
                    {isLoading ? '...' : `${stats.longestStreak || 79} days`}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">Longest Streak</div>
                </div>
              </div>

              <div className="bg-background/60 border border-border/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 transition-all hover:border-accent/40">
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent shrink-0">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-foreground">
                    {isLoading ? '...' : (data?.user.publicRepos ?? 182)}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">Public Repos</div>
                </div>
              </div>

              <div className="bg-background/60 border border-border/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 transition-all hover:border-accent/40">
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-foreground">
                    {isLoading ? '...' : (data?.user.followers ?? 238)}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">Followers</div>
                </div>
              </div>
            </div>

            {/* Contribution Calendar Graph Container */}
            <div className="relative w-full rounded-xl border border-border bg-background/50 p-4 sm:p-6 overflow-x-auto">
              {isLoading ? (
                /* Skeleton Loader */
                <div className="min-w-180 py-6 flex flex-col items-center justify-center gap-4 animate-pulse">
                  <div className="flex gap-1.5 w-full justify-between">
                    {Array.from({ length: 53 }).map((_, w) => (
                      <div key={w} className="flex flex-col gap-1.5">
                        {Array.from({ length: 7 }).map((_, d) => (
                          <div
                            key={d}
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2.5px] bg-muted/40"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent" />
                    Fetching latest GitHub contributions...
                  </div>
                </div>
              ) : error && weeks.length === 0 ? (
                /* Error / Fallback State */
                <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    Could not fetch recent contribution graph directly.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry
                  </button>
                </div>
              ) : (
                /* Native Interactive Heatmap SVG */
                <div className="min-w-185 flex flex-col gap-3">
                  <svg
                    viewBox="0 0 755 125"
                    className="w-full h-auto select-none overflow-visible"
                    aria-label={`GitHub contribution calendar for ${GITHUB_USERNAME}`}
                  >
                    {/* Month Labels along the top */}
                    {monthLabels.map((m, i) => (
                      <text
                        key={i}
                        x={28 + m.weekIndex * 13.5}
                        y="10"
                        className="fill-muted-foreground text-[10px] font-sans font-medium"
                      >
                        {m.name}
                      </text>
                    ))}

                    {/* Day of Week Labels on the left */}
                    <text
                      x="0"
                      y="32"
                      className="fill-muted-foreground text-[9px] font-sans font-medium"
                    >
                      Mon
                    </text>
                    <text
                      x="0"
                      y="59"
                      className="fill-muted-foreground text-[9px] font-sans font-medium"
                    >
                      Wed
                    </text>
                    <text
                      x="0"
                      y="86"
                      className="fill-muted-foreground text-[9px] font-sans font-medium"
                    >
                      Fri
                    </text>

                    {/* Heatmap Grid Cells */}
                    <g transform="translate(28, 16)">
                      {weeks.map((week, weekIndex) => (
                        <g key={weekIndex} transform={`translate(${weekIndex * 13.5}, 0)`}>
                          {week.map((day, dayIndex) => {
                            const fill = getCellFill(day.level);
                            const isHovered = hoveredDay?.date === day.date;

                            return (
                              <rect
                                key={day.date}
                                x="0"
                                y={dayIndex * 13.5}
                                width="10.5"
                                height="10.5"
                                rx="2.5"
                                ry="2.5"
                                fill={fill}
                                className="transition-all duration-150 cursor-pointer"
                                style={{
                                  transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                                  transformOrigin: `${weekIndex * 13.5 + 5}px ${
                                    dayIndex * 13.5 + 5
                                  }px`,
                                  outline: isHovered ? `2px solid ${primaryColor}` : 'none',
                                }}
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setHoveredDay({
                                    date: day.date,
                                    count: day.count,
                                    x: rect.left + rect.width / 2,
                                    y: rect.top,
                                  });
                                }}
                                onMouseLeave={() => setHoveredDay(null)}
                              />
                            );
                          })}
                        </g>
                      ))}
                    </g>
                  </svg>

                  {/* Calendar Footer: Legend & Info */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <span className="font-mono">
                      {stats.total.toLocaleString()} contributions in the last year
                    </span>

                    {/* Scale Legend */}
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>Less</span>
                      <span
                        className="w-3 h-3 rounded-[2.5px] border border-border/40"
                        style={{ background: getCellFill(0) }}
                      />
                      <span
                        className="w-3 h-3 rounded-[2.5px]"
                        style={{ background: getCellFill(1) }}
                      />
                      <span
                        className="w-3 h-3 rounded-[2.5px]"
                        style={{ background: getCellFill(2) }}
                      />
                      <span
                        className="w-3 h-3 rounded-[2.5px]"
                        style={{ background: getCellFill(3) }}
                      />
                      <span
                        className="w-3 h-3 rounded-[2.5px]"
                        style={{ background: getCellFill(4) }}
                      />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Tooltip */}
            {hoveredDay && (
              <div
                className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground border border-border shadow-xl text-xs font-medium whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
                style={{
                  left: hoveredDay.x,
                  top: hoveredDay.y - 8,
                }}
              >
                <span className="font-semibold text-accent">
                  {hoveredDay.count === 0
                    ? 'No contributions'
                    : `${hoveredDay.count} contribution${hoveredDay.count > 1 ? 's' : ''}`}
                </span>{' '}
                on {formatDate(hoveredDay.date)}
              </div>
            )}

            {/* Bottom Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-1">
              <p className="text-muted-foreground text-xs text-center sm:text-left flex items-center gap-1.5">
                <Github className="w-4 h-4 text-accent shrink-0 inline" />
                Live synced directly from GitHub profile{' '}
                <span className="font-mono text-accent">@{GITHUB_USERNAME}</span>
              </p>

              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold hover:opacity-90 active:scale-95 transition-all text-xs sm:text-sm shadow-md hover:shadow-accent/25"
              >
                <Github className="h-4 w-4" />
                View Full GitHub Profile
                <ExternalLink className="h-3.5 w-3.5 ml-0.5 opacity-80" />
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

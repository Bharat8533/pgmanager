import React from "react";
import { RecentActivity } from "@/types/owner";
import { UserCheck, CreditCard, AlertCircle, BedDouble, Clock } from "lucide-react";

interface RecentActivitiesListProps {
  activities: RecentActivity[];
}

export function RecentActivitiesList({ activities }: RecentActivitiesListProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tenant":
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-emerald-700" />;
      case "complaint":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <BedDouble className="w-4 h-4 text-brand-charcoal" />;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-2xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
          <div>
            <h3 className="text-sm font-bold text-brand-charcoal">Recent Activities</h3>
            <p className="text-xs text-brand-muted">Operational log across your PG properties</p>
          </div>
          <span className="text-[10px] font-semibold bg-brand-offwhite text-brand-charcoal px-2 py-0.5 rounded-full border border-brand-border">
            Live Feed
          </span>
        </div>

        <div className="space-y-3.5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-brand-offwhite border border-brand-border flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-white transition-colors">
                {getCategoryIcon(activity.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-brand-charcoal truncate">
                    {activity.title}
                  </h4>
                  <span className="text-[10px] text-brand-muted flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-2.5 h-2.5" />
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-0.5 leading-snug">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-brand-border text-center">
        <button
          type="button"
          onClick={() => alert("Activity Log: Complete chronological audit history will be available in Phase 2.")}
          className="text-xs font-semibold text-brand-charcoal hover:underline"
        >
          View Full Activity Log →
        </button>
      </div>
    </div>
  );
}

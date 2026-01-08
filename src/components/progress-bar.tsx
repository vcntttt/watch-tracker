import type { WorkType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
	current: number;
	total: number;
	type: WorkType;
	showLabel?: boolean;
	className?: string;
}

const progressColors: Record<WorkType, string> = {
	book: "bg-emerald-500",
	movie: "bg-blue-500",
	series: "bg-orange-500",
	anime: "bg-pink-500",
	manga: "bg-cyan-500",
};

const unitLabels: Record<WorkType, string> = {
	book: "pages",
	movie: "",
	series: "episodes",
	anime: "episodes",
	manga: "chapters",
};

export function ProgressBar({
	current,
	total,
	type,
	showLabel = true,
	className,
}: ProgressBarProps) {
	const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

	return (
		<div className={cn("space-y-1", className)}>
			<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
				<div
					className={cn(
						"h-full rounded-full transition-all",
						progressColors[type],
					)}
					style={{ width: `${percentage}%` }}
				/>
			</div>
			{showLabel && (
				<p className="text-xs text-muted-foreground">
					{current} / {total} {unitLabels[type]}
				</p>
			)}
		</div>
	);
}

import { Link } from "@tanstack/react-router";
import type { Work } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRight } from "./icons";
import { ProgressBar } from "./progress-bar";
import { StarRating } from "./star-rating";
import { StatusBadge } from "./status-badge";
import { TypeBadge } from "./type-badge";

interface WorkCardProps {
	work: Work;
	variant?: "default" | "compact";
	className?: string;
}

export function WorkCard({
	work,
	variant = "default",
	className,
}: WorkCardProps) {
	const showProgress =
		work.progress &&
		work.type !== "movie" &&
		(work.status === "in-progress" || work.status === "backlog");

	if (variant === "compact") {
		return (
			<Link
				to="/work/$workId"
				params={{ workId: work.id }}
				className={cn(
					"group flex items-center justify-between rounded-lg border border-border/50 bg-card/50 px-4 py-3 transition-all hover:border-border hover:bg-card",
					className,
				)}
			>
				<div className="flex items-center gap-3 min-w-0">
					<TypeBadge type={work.type} showIcon={false} />
					<span className="truncate font-medium">{work.title}</span>
				</div>
				<div className="flex items-center gap-3">
					{work.rating && <StarRating rating={work.rating} size="sm" />}
					<ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
				</div>
			</Link>
		);
	}

	return (
		<Link
			to="/work/$workId"
			params={{ workId: work.id }}
			className={cn(
				"group flex flex-col rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-border hover:bg-card",
				className,
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2 mb-1">
						<TypeBadge type={work.type} />
						<StatusBadge status={work.status} />
					</div>
					<h3 className="truncate font-semibold text-foreground group-hover:text-foreground/90">
						{work.title}
					</h3>
					{work.creator && (
						<p className="text-sm text-muted-foreground truncate">
							{work.creator}
						</p>
					)}
				</div>
				{work.rating && <StarRating rating={work.rating} size="sm" />}
			</div>

			{showProgress && work.progress && (
				<div className="mt-3">
					<ProgressBar
						current={work.progress.current}
						total={work.progress.total}
						type={work.type}
					/>
				</div>
			)}

			{work.tags.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-1">
					{work.tags.slice(0, 3).map((tag) => (
						<span
							key={tag}
							className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
						>
							{tag}
						</span>
					))}
					{work.tags.length > 3 && (
						<span className="text-xs text-muted-foreground">
							+{work.tags.length - 3}
						</span>
					)}
				</div>
			)}
		</Link>
	);
}

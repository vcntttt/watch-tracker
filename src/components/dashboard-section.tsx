import type { Work } from "@/lib/types";
import { cn } from "@/lib/utils";
import { WorkCard } from "./work-card";

interface DashboardSectionProps {
	title: string;
	works: Work[];
	variant?: "default" | "compact";
	emptyMessage?: string;
	className?: string;
}

export function DashboardSection({
	title,
	works,
	variant = "default",
	emptyMessage = "Nothing here yet",
	className,
}: DashboardSectionProps) {
	return (
		<section className={cn("space-y-4", className)}>
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-foreground">{title}</h2>
				<span className="text-sm text-muted-foreground">{works.length}</span>
			</div>
			{works.length > 0 ? (
				<div
					className={cn(
						variant === "default"
							? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
							: "flex flex-col gap-2",
					)}
				>
					{works.map((work) => (
						<WorkCard key={work.id} work={work} variant={variant} />
					))}
				</div>
			) : (
				<div className="rounded-lg border border-dashed border-border/50 py-8 text-center">
					<p className="text-sm text-muted-foreground">{emptyMessage}</p>
				</div>
			)}
		</section>
	);
}

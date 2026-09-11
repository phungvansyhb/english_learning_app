import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function CheckboxRow({
	checked,
	onChange,
	label,
}: {
	checked: boolean;
	onChange: (value: boolean) => void;
	label: string;
}) {
	return (
		<button
			type='button'
			onClick={() => onChange(!checked)}
			className='flex items-center gap-2 text-sm text-foreground'>
			<span
				className={cn(
					'flex size-4 items-center justify-center rounded border transition-colors',
					checked
						? 'border-primary bg-primary text-primary-foreground'
						: 'border-input bg-card',
				)}>
				{checked && <Check className='size-3' />}
			</span>
			{label}
		</button>
	);
}

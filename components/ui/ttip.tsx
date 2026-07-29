import { ReactNode } from 'react';
import { Tooltip } from '@base-ui/react/tooltip';
type Props = {
	triggerComponent: ReactNode;
	triggerClassName?: string;
	children: ReactNode;
	popupClassName?: string;
};
const arrowClass =
	"relative block w-3 h-1.5 overflow-clip data-[side=bottom]:top-[-6px] data-[side=left]:right-[-9px] data-[side=left]:rotate-90 data-[side=right]:left-[-9px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-6px] data-[side=top]:rotate-180 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-[calc(6px*sqrt(2))] before:h-[calc(6px*sqrt(2))] before:bg-white dark:before:bg-neutral-950  dark:before:border-white before:[transform:translate(-50%,50%)_rotate(45deg)]";
export default function Ttip({
	triggerComponent,
	triggerClassName,
	popupClassName = 'relative flex flex-col border rounded bg-white p-2 text-sm text-muted-foreground origin-[var(--transform-origin)] shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[transform,opacity] duration-100 ease-out data-ending-style:opacity-0 data-ending-style:[transform:scale(0.98)] data-instant:transition-none data-starting-style:opacity-0 data-starting-style:[transform:scale(0.98)] dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none',
	children,
}: Props) {
	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger className={triggerClassName}>{triggerComponent}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Positioner sideOffset={11}>
						<Tooltip.Popup className={popupClassName}>
							<Tooltip.Arrow className={arrowClass} />
							{children}
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}

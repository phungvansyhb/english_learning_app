'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export type DragDirection = 'left' | 'right';
export type DragOffset = { x: number; y: number };
export const DRAG_THRESHOLD = 280;

type UseDragResult = {
    direction: DragDirection | null;
    offset: DragOffset;
    progress: number;
    isDragging: boolean;
};

type UseDragOptions = {
    onSwipe?: (direction: DragDirection) => void;
};

export function useDrag<T extends HTMLElement>(
    ref: RefObject<T | null>,
    options: UseDragOptions = {},
): UseDragResult {
    const [direction, setDirection] = useState<DragDirection | null>(null);
    const [offset, setOffset] = useState<DragOffset>({ x: 0, y: 0 });
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startPointRef = useRef<{ x: number; y: number } | null>(null);
    const directionRef = useRef<DragDirection | null>(null);
    const crossedThresholdRef = useRef(false);
    const onSwipeRef = useRef(options.onSwipe);

    useEffect(() => {
        onSwipeRef.current = options.onSwipe;
    }, [options.onSwipe]);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select')) {
                return;
            }

            startPointRef.current = { x: event.clientX, y: event.clientY };
            setDirection(null);
            directionRef.current = null;
            crossedThresholdRef.current = false;
            setOffset({ x: 0, y: 0 });
            setProgress(0);
            setIsDragging(true);
            element.setPointerCapture(event.pointerId);
        };

        const handlePointerMove = (event: PointerEvent) => {
            const startPoint = startPointRef.current;

            if (!startPoint) {
                return;
            }

            const deltaX = event.clientX - startPoint.x;
            const deltaY = event.clientY - startPoint.y;

            if (Math.abs(deltaX) < Math.abs(deltaY)) {
                setOffset({ x: 0, y: 0 });
                setProgress(0);
                directionRef.current = null;
                crossedThresholdRef.current = false;
                setDirection(null);
                return;
            }

            const nextDirection = deltaX > 0 ? 'right' : 'left';
            directionRef.current = nextDirection;
            setDirection(nextDirection);
            setOffset({
                x: Math.sign(deltaX) * Math.min(Math.abs(deltaX), DRAG_THRESHOLD),
                y: 0,
            });
            setProgress(Math.min(Math.abs(deltaX) / DRAG_THRESHOLD, 1));

            if (Math.abs(deltaX) < DRAG_THRESHOLD) {
                return;
            }

            crossedThresholdRef.current = true;
        };

        const finishDrag = (event: PointerEvent, shouldNotify = true) => {
            if (shouldNotify && crossedThresholdRef.current && directionRef.current) {
                onSwipeRef.current?.(directionRef.current);
            }

            startPointRef.current = null;
            setIsDragging(false);
            setOffset({ x: 0, y: 0 });
            setProgress(0);
            setDirection(null);
            crossedThresholdRef.current = false;

            if (element.hasPointerCapture(event.pointerId)) {
                element.releasePointerCapture(event.pointerId);
            }
        };

        const cancelDrag = (event: PointerEvent) => {
            finishDrag(event, false);
            directionRef.current = null;
            crossedThresholdRef.current = false;
            setDirection(null);
        };

        element.addEventListener('pointerdown', handlePointerDown);
        element.addEventListener('pointermove', handlePointerMove);
        element.addEventListener('pointerup', finishDrag);
        element.addEventListener('pointercancel', cancelDrag);

        return () => {
            element.removeEventListener('pointerdown', handlePointerDown);
            element.removeEventListener('pointermove', handlePointerMove);
            element.removeEventListener('pointerup', finishDrag);
            element.removeEventListener('pointercancel', cancelDrag);
            startPointRef.current = null;
            directionRef.current = null;
            crossedThresholdRef.current = false;
            setIsDragging(false);
            setProgress(0);
        };
    }, [ref]);

    return { direction, offset, progress, isDragging };
}

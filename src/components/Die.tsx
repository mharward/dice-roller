import { useRef, useState, useCallback, useEffect } from 'react';
import './Die.css';
import { PoolDie } from '../utils/dice';

interface DieProps {
  die: PoolDie;
  onRemove: (id: string) => void;
  poolRef: React.RefObject<HTMLDivElement | null>;
}

const FLICK_VELOCITY_THRESHOLD = 0.5;

function Die({ die, onRemove, poolRef }: DieProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const dragState = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();
    dragState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: now,
      lastX: touch.clientX,
      lastY: touch.clientY,
      lastTime: now,
      offsetX: 0,
      offsetY: 0,
    };
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !elementRef.current) return;

    const touch = e.touches[0];
    const now = Date.now();

    dragState.current.lastX = touch.clientX;
    dragState.current.lastY = touch.clientY;
    dragState.current.lastTime = now;
    dragState.current.offsetX = touch.clientX - dragState.current.startX;
    dragState.current.offsetY = touch.clientY - dragState.current.startY;

    elementRef.current.style.transform = `translate(${dragState.current.offsetX}px, ${dragState.current.offsetY}px) scale(1.1)`;

    // Check if outside pool
    if (poolRef.current) {
      const poolRect = poolRef.current.getBoundingClientRect();
      const isOutside =
        touch.clientX < poolRect.left ||
        touch.clientX > poolRect.right ||
        touch.clientY < poolRect.top ||
        touch.clientY > poolRect.bottom;
      setIsRemoving(isOutside);
    }
  }, [isDragging, poolRef]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !elementRef.current) return;

    const { lastX, lastY, lastTime, startX, startY, startTime } = dragState.current;
    const deltaTime = (lastTime - startTime) / 1000;
    const deltaX = lastX - startX;
    const deltaY = lastY - startY;
    const velocityX = deltaTime > 0 ? Math.abs(deltaX) / deltaTime / 1000 : 0;
    const velocityY = deltaTime > 0 ? Math.abs(deltaY) / deltaTime / 1000 : 0;
    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

    // Check if flicked out or dragged outside pool
    const shouldRemove = velocity > FLICK_VELOCITY_THRESHOLD || isRemoving;

    if (shouldRemove) {
      onRemove(die.id);
    } else {
      elementRef.current.style.transform = '';
    }

    setIsDragging(false);
    setIsRemoving(false);
  }, [isDragging, isRemoving, die.id, onRemove]);

  // Desktop: right-click or double-click to remove
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onRemove(die.id);
  }, [die.id, onRemove]);

  const handleDoubleClick = useCallback(() => {
    onRemove(die.id);
  }, [die.id, onRemove]);

  // Reset transform when not dragging
  useEffect(() => {
    if (!isDragging && elementRef.current) {
      elementRef.current.style.transform = '';
    }
  }, [isDragging]);

  const classNames = ['die'];
  if (isDragging) classNames.push('die--dragging');
  if (isRemoving) classNames.push('die--removing');

  return (
    <div
      ref={elementRef}
      className={classNames.join(' ')}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      <span className="die__type">D{die.type}</span>
      <span className={`die__value ${die.value === null ? 'die__value--empty' : ''}`}>
        {die.value ?? '?'}
      </span>
      <button
        className="die__remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(die.id);
        }}
      >
        ×
      </button>
    </div>
  );
}

export default Die;

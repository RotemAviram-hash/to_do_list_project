import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// מגדירים ממשק לפרופס שהילד (TaskCard) יכול לקבל
interface ChildProps {
  isDragging?: boolean;
}

interface DraggableTaskCardProps {
  id: string;
  // אנחנו מגדירים ש-children הוא אלמנט React שמסוגל לקבל את ה-ChildProps שלנו
  children: React.ReactElement<ChildProps>;
}

export const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
  id,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  // עכשיו TypeScript יודע בוודאות שהילד מוכן לקבל את הפרופ isDragging
  const childWithProps = React.cloneElement(children, { isDragging });

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {childWithProps}
    </div>
  );
};

"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

const PageThumbnail = ({ page, onRemove }) => {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative
        group
        border border-(--border)
        p-3 
        rounded-lg 
        bg-(--card) 
        shadow-sm 
        hover:shadow-md 
        transition-all
        flex flex-col
        items-center
      `}
    >
      {/* Header: Drag Handle + Page Number + Delete */}
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-(--muted-foreground) hover:text-(--foreground) p-1 rounded hover:bg-(--muted)"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-(--muted-foreground)">
            Page {page.pageNumber}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag start
            onRemove(page.id);
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
          title="Remove Page"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail Image */}
      <div className="relative w-full aspect-[1/1.4] bg-(--muted) rounded overflow-hidden border border-(--border) flex items-center justify-center">
        {page.image ? (
          <img
            src={page.image}
            alt={`Page ${page.pageNumber}`}
            className="w-full h-full object-contain bg-white"
            draggable={false}
          />
        ) : (
          <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-gray-700" />
        )}
      </div>
    </div>
  );
};

export default PageThumbnail;

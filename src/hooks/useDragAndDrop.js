import { useState } from "react";

export const useDragAndDrop = (initialState) => {
  const [isDragging, setIsDragging] = useState(false);
  const [listItems, setListItems] = useState(initialState);

  const handleUpdateList = (segmentid, status) => {
    let card = listItems.find((item) => item.segmentid === segmentid);

    if (card && card.status !== status) {
      card.status = status;
      if (Array.isArray(listItems)) {
        setListItems((prev) => [
          card,
          ...prev.filter((item) => item.segmentid !== segmentid),
        ]);
      }
    }
  };

  const handleDragging = (dragging) => setIsDragging(dragging);

  return {
    isDragging,
    listItems,
    handleUpdateList,
    handleDragging,
  };
};

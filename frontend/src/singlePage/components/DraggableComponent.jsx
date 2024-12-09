import React, { useState, useRef } from 'react';
import './DraggableComponent.css'; // CSS file for styling

const DraggableComponent = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const dragItem = useRef(null);
  const dragTimeout = useRef(null);

  const handleMouseDown = (e) => {
    // Start a timer to detect a long press
    dragTimeout.current = setTimeout(() => {
      setIsDragging(true);
      dragItem.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }, 500); // 500ms for long press
  };

  const handleMouseUp = () => {
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }

    if (!isDragging) {
      // If it wasn't a drag, it's a click
      setIsModalOpen(true);
    }

    setIsDragging(false); // Reset dragging state
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    if (!dragItem.current.timer) {
      console.log('eee');
      dragItem.current.timer = setTimeout(() => {
        const newX = e.clientX - dragItem.current.x;
        const newY = e.clientY - dragItem.current.y;
        setPosition({ x: newX, y: newY });

        // Clear the timer
        dragItem.current.timer = null;
      }, 50); // Adjust the throttle interval (in ms) as needed
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'pointer',
      }}
      className="draggable"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div>Drag or Click Me</div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <p>This is a modal!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableComponent;

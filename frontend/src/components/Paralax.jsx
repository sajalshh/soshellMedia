import React, { useState } from "react";
import Modal from "react-modal";

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#000",
    border: "none",
    padding: "0",
    width: "90%",
    maxWidth: "800px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

export default function Paralax() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      <div
        className="paralax-section-2 mt-0 fix bg-cover"
        style={{ backgroundImage: "url('/assets/img/paralax-bg-2.jpg')" }}
      >
        <div className="video-text" aria-label="Play video">
          <button onClick={openModal} className="video-btn ripple video-popup">
            <i className="fas fa-play"></i>
          </button>
          <h3>Free training</h3>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Video Popup"
      >
        <div
          style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
        >
          <iframe
            src="https://www.youtube.com/embed/Cn4G2lZ_g2I?autoplay=1"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="video"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </Modal>
    </>
  );
}

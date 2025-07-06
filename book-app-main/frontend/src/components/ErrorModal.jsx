import { Modal } from "react-bootstrap";

function ErrorModal({ message, handleClose, show }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <span className="text-danger">Error</span>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
    </Modal>
  );
}

export default ErrorModal;

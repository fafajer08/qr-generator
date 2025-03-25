import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Image } from "react-bootstrap";

const App = () => {
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState("");

  const generateQR = async () => {
    if (!url) return alert("Please enter a URL");

    try {
      const response = await fetch("http://localhost:5000/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (data.success) {
        setQrCode(data.qrPath);
        console.log("QR Code generated successfully");
      } else {
        alert("Invalid URL");
      }
    } catch (error) {
      console.error("Error generating QR:", error);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <Card className="p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="text-center mb-3">QR Code Generator</h1>

        <Form>
          <Form.Group controlId="urlInput">
            <Form.Label>Enter URL:</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" className="w-100 mt-3" onClick={generateQR}>
            Generate QR Code
          </Button>
        </Form>

        {qrCode && (
          <Alert variant="success" className="text-center mt-3">
            <h5>Generated QR Code:</h5>
            <Image src={qrCode} alt="QR Code" fluid className="border p-2 shadow" />
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default App;

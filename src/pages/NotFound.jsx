import { useEffect, useRef } from "react";

export const NotFound = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let mouse = { x: 200, y: 200 };

    // Listen for mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Simple bone/limb system
    const length = 5;
    const segmentLength = 40;
    let nodes = Array.from({ length }, (_, i) => ({
      x: 200,
      y: 200 + i * segmentLength,
    }));

    function update() {
  // Move the first node to the mouse
  nodes[0].x += (mouse.x - nodes[0].x) * 0.2;
  nodes[0].y += (mouse.y - nodes[0].y) * 0.2;

  // Each node follows the previous one
  for (let i = 1; i < length; i++) {
    const dx = nodes[i].x - nodes[i - 1].x;
    const dy = nodes[i].y - nodes[i - 1].y;
    // const dist = Math.sqrt(dx * dx + dy * dy); // Remove this line if not used
    const angle = Math.atan2(dy, dx);
    nodes[i].x = nodes[i - 1].x + Math.cos(angle) * segmentLength;
    nodes[i].y = nodes[i - 1].y + Math.sin(angle) * segmentLength;
  }
}

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#8bf65c";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < length; i++) {
        ctx.lineTo(nodes[i].x, nodes[i].y);
      }
      ctx.stroke();

      // Draw joints
      ctx.fillStyle = "#fff";
      for (let i = 0; i < length; i++) {
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animate() {
      update();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <h1 style={{ fontSize: 48, color: "#8bf65c" }}>404 - Not Found</h1>
      <p style={{ color: "#888" }}>Oops! The page you're looking for doesn't exist.</p>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          margin: "40px auto",
          display: "block",
          background: "#222",
          borderRadius: 16,
        }}
      />
    </div>
  );
};
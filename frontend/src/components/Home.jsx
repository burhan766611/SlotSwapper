import gsap from "gsap";
import React, { useRef } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const barRef = useRef(null);
  const textRef = useRef(null);
  const canvasRef = useRef(null);
  const [showlogin, setShowLogin] = useState(false);

  if (location.pathname !== "/") return null;

  const handleToggle = (val) => {
    const targetLeft = val === "signup" ? "38.5%" : "54.5%";
    val === "signup" ? setShowLogin(false) : setShowLogin(true);
    gsap.to(barRef.current, {
      left: targetLeft,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    const letters = text.textContent.split("");
    text.innerHTML = letters
      .map(
        (char) =>
          `<span class="inline-block text-white">${
            char === " " ? "&nbsp;" : char
          }</span>`
      )
      .join("");

    const spans = text.querySelectorAll("span");

    spans.forEach((span, i) => {
      gsap.to(span, {
        y: "+=15",
        duration: 2 + Math.random() * 1.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.1,
      });
    });

    gsap.to(text, {
      scale: 1.03,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  // 🎆 Floating Particle Background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particles = [];
    const numParticles = 50;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        // bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <div className="h-screen w-full flex bg-black overflow-hidden">
        {/* LEFT SIDE */}
        <div className="h-full w-[45%] relative flex items-center justify-end pr-10 overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          {/* Particle Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          ></canvas>

          {/* Floating Text */}
          <h1
            ref={textRef}
            className="text-7xl font-extrabold tracking-wide text-white z-10 drop-shadow-lg"
          >
            SlotSwapper
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="h-full w-[55%] bg-indigo-400">
          <div className="h-[30%] w-full relative">
            <div
              className="h-[20%] w-[16%] [font-size:2vw] font-bold absolute left-[40%] top-[59%] cursor-pointer z-10"
              onClick={() => handleToggle("signup")}
            >
              <p>SignUp</p>
            </div>
            <div
              className="h-[20%] w-[16%] [font-size:2vw] font-bold absolute left-[58%] top-[59%] cursor-pointer z-10"
              onClick={() => handleToggle("login")}
            >
              <p>Login</p>
            </div>
            <div
              ref={barRef}
              className="h-[4lvw] w-[9lvw] bg-black rounded-3xl absolute top-[57%] opacity-25"
              style={{ left: "38%" }}
            ></div>
          </div>

          <div className="h-[70%] w-full flex justify-center">
            {showlogin ? <Login /> : <Signup />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;


{
  /* <div className="h-screen w-full flex bg-black">
  <div className="h-full w-[45%] bg-gray-50 relative">
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
    ></canvas>
    <h1
      ref={textRef}
      className="text-6xl font-bold absolute right-0 top-[40%] font-stretch-extra-expanded
            name
            "
    >
      SlotSwapper
    </h1>
  </div>
  <div className="h-full w-[55%] bg-indigo-400 ">
    <div className="h-[30%] w-full relative">
      <div
        className="h-[20%] w-[16%] text-3xl font-bold absolute left-[40%] top-[60%] cursor-pointer z-10"
        onClick={() => handleToggle("signup")}
      >
        <h1 className="h-full w-full">SignUp</h1>
      </div>
      <div
        className=" h-[20%] w-[16%] text-3xl font-bold absolute left-[57%] top-[60%] cursor-pointer z-10"
        onClick={() => handleToggle("login")}
      >
        <h1 className="h-full w-full">login</h1>
      </div>
      <div
        className="h-[20%] w-[16%] bg-black rounded-3xl absolute top-[57%] opacity-25 cursor-pointer"
        style={{
          left: "38%",
        }}
        ref={barRef}
      ></div>
    </div>
    <div className="h-[70%] w-full flex justify-center ">
      {showlogin ? <Login /> : <Signup />}
    </div>
  </div>
</div>; */
}

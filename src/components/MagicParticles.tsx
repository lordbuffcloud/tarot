'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    fadeSpeed: number;
    color: string;
}

export default function MagicParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        const colors = ['rgba(147, 51, 234, ', 'rgba(236, 72, 153, ', 'rgba(99, 102, 241, ']; // Purple, Pink, Indigo

        const createParticle = (): Particle => {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                fadeSpeed: Math.random() * 0.005 + 0.002,
                color: colors[Math.floor(Math.random() * colors.length)],
            };
        };

        // Initialize particles
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Occasionally add new particles
            if (particles.length < 50 && Math.random() < 0.1) {
                particles.push(createParticle());
            }

            particles.forEach((p, index) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.opacity -= p.fadeSpeed;

                if (p.opacity <= 0) {
                    particles[index] = createParticle();
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.opacity + ')';
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color + '1)';
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}

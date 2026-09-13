import { ImageResponse } from 'next/og';
import { siteConfig } from '@/src/constants/site-config';

export const alt = `${siteConfig.name} - ${siteConfig.role}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#090D16',
        backgroundImage:
          'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(1, 180, 186, 0.15) 5%, transparent 0%)',
        backgroundSize: '100px 100px',
        padding: '70px 80px',
        fontFamily: 'sans-serif',
        color: '#ffffff',
        border: '12px solid #0E1626',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#01B4BA',
            boxShadow: '0 0 18px #01B4BA',
          }}
        />
        <span
          style={{
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#01B4BA',
          }}
        >
          Senior Web Instructor & Full Stack Engineer
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1
          style={{
            fontSize: '68px',
            fontWeight: 800,
            letterSpacing: '-1px',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {siteConfig.name}
        </h1>
        <p
          style={{
            fontSize: '28px',
            color: '#94A3B8',
            margin: 0,
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          Building scalable MERN & Next.js architectures • Mentored 2,000+ developers
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '30px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          {['React', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind'].map((tech) => (
            <span
              key={tech}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: 'rgba(1, 180, 186, 0.12)',
                border: '1px solid rgba(1, 180, 186, 0.3)',
                color: '#5EEAD4',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <span style={{ fontSize: '20px', color: '#64748B' }}>ismailjosim.com</span>
      </div>
    </div>,
    {
      ...size,
    }
  );
}

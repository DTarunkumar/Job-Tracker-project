import { useState } from 'react';
import RegisterModal from '../components/RegisterModal';
import LoginModal from '../components/LoginModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const Section = ({
  children,
  className = '',
}: React.PropsWithChildren<{ className?: string }>) => (
  <section className={`w-full px-6 md:px-10 ${className}`}>{children}</section>
);

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);


  const handleAuthSuccess = () => {
    setShowLogin(false);
    setShowRegister(false);
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen w-full font-inter text-gray-800 bg-white relative overflow-x-hidden">
      <div className="relative h-[46vh] md:h-[52vh] w-full flex items-center justify-center overflow-hidden">
        <img
          src="src/assets/workspace.png"
          className="absolute inset-0 h-full w-full object-cover object-center scale-105 blur-sm"
          alt="workspace background"
        />
        <div className="absolute inset-0 bg-blue-900/50 mix-blend-multiply" />
        <div className="absolute top-10 w-full flex flex-col items-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md tracking-wide mb-4">
                Job Tracker
            </h1>
            <p className="text-white text-base md:text-lg mb-8 opacity-90">
                Track, Analyze, Land your dream job.
            </p>
        </div>

        <div className="relative flex gap-6 z-10">
          <button
            onClick={() => setShowRegister(true)}
            className="px-8 py-3 rounded-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition"
          >
            SignUp
          </button>

          <button
            onClick={() => setShowLogin(true)}
            className="px-8 py-3 rounded-lg text-lg font-semibold bg-white text-gray-800 hover:bg-gray-100 shadow-lg transition"
          >
            Login
          </button>
        </div>
      </div>

      <Section className="py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-14">Features</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-6 mx-auto max-w-5xl">
          {[
            ['folder.svg', 'Track Multiple<br/>Applications', 'Save company name,<br/>job ID, status…'],
            ['chart.svg', 'Visual Dashboard<br/>& Stats', 'View status distribution<br/>and progress.'],
            ['upload.svg', 'Resume & Cover Letter<br/>Upload', 'Store and access every<br/>document securely.'],
            ['download.svg', 'Export as CSV', 'Keep offline records<br/>in one click.'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} className="flex flex-col items-center text-center">
              <img src={`src/assets/${icon}`} className="h-9 mb-4 opacity-90" alt="" />
              <h3
                className="font-semibold leading-snug"
                dangerouslySetInnerHTML={{ __html: title as string }}
              />
              <p
                className="text-gray-500 mt-2 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: desc as string }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section className="pb-24">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
          <img src="src/assets/dashboard-shot.png" alt="App screenshot" className="w-full" />
        </div>
      </Section>

      <Section className="pb-24 text-center">
        <h2 className="text-3xl font-bold mb-12">Technology Stack</h2>
        <div className="flex flex-wrap justify-center gap-10 md:gap-16 items-center">
          {[
            ['react', 'React'],
            ['ts', 'TypeScript'],
            ['tailwind', 'Tailwind CSS'],
            ['firebase', 'Firebase'],
          ].map(([key, label]) => (
            <div key={key} className="flex flex-col items-center text-base">
              <img src={`src/assets/${key}.png`} alt={label} className="h-10 mb-2" />
              {label}
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl mx-auto text-gray-600">
          Built with modern web technologies for a fast & seamless experience.
        </p>
      </Section>

      <Section className="pb-20 text-center">
        <blockquote className="text-2xl md:text-3xl font-semibold leading-snug italic">
          “Built to help job-seekers track every application and land offers faster.”
        </blockquote>
      </Section>

      <footer className="text-center text-sm text-gray-500 py-10">
        © {new Date().getFullYear()} Job Tracker — All rights reserved 
        <div className='font-bold leading-snug italic'>“Designed & Built by Tarun Kumar Reddy Doranala”</div>
      </footer>

      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} onSuccess={handleAuthSuccess} />
      )}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleAuthSuccess} onForgotPassword={() => {
            setShowLogin(false);       
            setShowForgotPassword(true);
        }}
         />
      )}
      {showForgotPassword && (
  <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
)}

    </div>
  );
}

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { tokens } from "../../tokens";
import { pageTransition } from "../../animations";

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div
      className={`${tokens.spacing.section} ${tokens.spacing.container} flex flex-col min-h-screen`}
      style={{ backgroundColor: tokens.color.background, color: tokens.color.text }}
    >
      {/* Header (outside AnimatePresence) */}
      <header className="py-4 border-b" style={{ borderColor: tokens.color.border }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: tokens.font.heading }}>
            Crypto Tracker
          </h1>
        </div>
      </header>

      {/* Main content with page transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer (outside AnimatePresence) */}
      <footer className="py-4 border-t" style={{ borderColor: tokens.color.border }}>
        <div className="text-center text-sm" style={{ fontFamily: tokens.font.body }}>
          © {new Date().getFullYear()} Crypto Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
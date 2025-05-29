import React from "react";
import * as motion from "motion/react-client";

export const LoadingSpinner: React.FC = () => (
    <div className="relative w-8 h-8 mt-2">
        <motion.div
            className="absolute top-0 left-0 w-4 h-4 bg-blue-600 rounded-full"
            animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"],
            }}
            transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 0,
            }}
        />
    </div>
);

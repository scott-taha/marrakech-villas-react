import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffect = ({ text, className = "" }: { text: string; className?: string }) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  let wordsArray = text.split(" ");
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        { opacity: 1 },
        { duration: 0.1, delay: stagger(0.05) }
      );
    }
  }, [isInView, animate]);

  return (
    <div className={className}>
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.split("").map((char, index) => (
                <motion.span
                  initial={{ opacity: 0 }}
                  key={`char-${index}`}
                  className="text-white opacity-0"
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block rounded-sm w-[4px] h-[1em] bg-orange-400 ml-1 align-middle translate-y-[-10%]"
      ></motion.span>
    </div>
  );
};

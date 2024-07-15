import { motion, Variants } from 'framer-motion';

interface AnimationsProps {
  circleVariants: Variants;
}

const Animations: React.FC<AnimationsProps> = ({ circleVariants }) => (
  <>
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      variants={circleVariants}
      animate="animate1"
    >
      <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-r from-blue-200 to-blue-600"></div>
    </motion.div>
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      variants={circleVariants}
      animate="animate2"
    >
      <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-r from-blue-300 to-blue-500"></div>
    </motion.div>
  </>
);

export default Animations;

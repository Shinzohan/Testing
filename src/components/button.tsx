import { motion } from "framer-motion";

interface EncryptButtonProps {
  icon: React.ElementType;  
  hoverGradient: string;
}

const EncryptButton: React.FC<EncryptButtonProps> = ({ icon: Icon, hoverGradient }) => {
  return (
    <motion.button
      whileHover={{ background: hoverGradient }}
      className="group relative overflow-hidden rounded-lg border-[1px] border-black p-2"
      style={{ width: "70px", height: "70px", margin: "8px" }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <motion.div
          whileHover={{ rotate: -360 }}
          transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
          className="flex items-center justify-center w-full h-full"
        >
          <Icon className="text-2xl" /> 
        </motion.div>
      </div>
    </motion.button>
  );
};

export default EncryptButton;

import { Popover, PopoverTrigger, PopoverContent } from "./Popover";

const RobotDesc = ({ children }) => {
  return (
    <Popover placement="right">
      <PopoverTrigger asChild>
        <span className="bg-secondary before:lg:bg-secondary absolute -bottom-6 left-5 flex items-center justify-center rounded-full p-2 text-white lg:bottom-1/2 lg:left-1/2 lg:flex lg:-translate-x-1/2 lg:translate-y-1/2 lg:p-1 lg:text-sm before:lg:pointer-events-none before:lg:absolute before:lg:inset-0 before:lg:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] before:lg:rounded-full before:lg:content-['']">
          <svg
            stroke="currentColor"
            fill="currentColor"
            className="h-6 w-6 lg:h-4 lg:w-4"
            strokeWidth="0"
            viewBox="0 0 192 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"></path>
          </svg>
        </span>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-full max-w-xs rounded-lg bg-white p-5 text-base font-bold text-black shadow-lg shadow-black !outline-none">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default RobotDesc;

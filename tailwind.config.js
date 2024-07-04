module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        textLoop: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        textLoop: "textLoop 25s linear infinite",
      },
      colors: {
        customGray: "#9D9993",
      },
    },
    fontFamily: {
      sans: ["var(--nanum_gothic)"],
      happySans: ["var(--press_start_2p)"],
    },
  },
  plugins: [],
  variants: {
    extend: {
      animation: ["hover"],
    },
  },
};

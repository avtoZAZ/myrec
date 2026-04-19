import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF7EE",
        espresso: "#2D2117",
        saffron: "#ECA72C",
        terracotta: "#D97757"
      },
      boxShadow: {
        premium: "0 15px 45px rgba(45,33,23,0.16)"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Thêm dòng này để quét toàn bộ file trong src
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0b3c32",
          light: "#faf9f6",
        },
      },
    },
  },
  plugins: [],
};
export default config;

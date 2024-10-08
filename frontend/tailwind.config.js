/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        backgroundImage: {
            "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            'rainbow': "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
            'rainbow-less': "linear-gradient(45deg, red, blue, indigo)",
            'rainbow-less-hover': "linear-gradient(45deg, #ff4d4d, #4d4dff, #4d4dff)",
            'rainbow-less-disabled': "linear-gradient(45deg, darkred, darkblue, darkindigo)",
        },
      colors: {
        primary: "#0F0F0F",
        secondary: "#232D3F",
        darkblue: "#2e3b52",
        lightblue: "#465b82",
        tertiary: "#005B41",
        quaternary: "#008170",
        quaternaryhover: "#029c87",
        quaternarydisabled: "#014f45"
      },
    },
  },
  plugins: [],
};

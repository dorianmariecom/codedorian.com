const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/helpers/**/*.rb",
    "./app/javascript/**/*.js",
    "./app/views/**/*.html",
    "./app/views/**/*.html.erb",
    "./app/views/**/*.html.haml",
    "./app/views/**/*.html.slim",
    "./config/initializers/**/*.rb",
    "./public/*.html",
  ],
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};

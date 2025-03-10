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
    ({ addVariant }) => {
      addVariant(
        "hotwire-native",
        "html[data-hotwire-native=\"true\"] &",
      );

      addVariant(
        "not-hotwire-native",
        "html[data-hotwire-native=\"false\"]) &",
      );
    },
  ],
}
};

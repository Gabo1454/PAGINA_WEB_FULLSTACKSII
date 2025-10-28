// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],

    // Qué tests correr
    files: [
      { pattern: "src/**/*.spec.ts",  watched: false },
      { pattern: "src/**/*.spec.tsx", watched: false },
    ],

    // Transpilar TS/TSX con esbuild (rápido y simple)
    preprocessors: {
      "src/**/*.spec.ts":  ["esbuild"],
      "src/**/*.spec.tsx": ["esbuild"],
    },

    esbuild: {
      target: "es2020",
      tsconfig: "tsconfig.json",
      jsx: "automatic", // React 17+ / 18 / 19
      sourcemap: true,
      // Evita errores al importar CSS/imagenes en componentes
      loader: {
        ".css": "css",
        ".svg": "file",
        ".png": "file",
        ".jpg": "file",
        ".jpeg": "file",
        ".webp": "file",
      },
      define: {
        "process.env.NODE_ENV": '"test"',
      },
    },

    reporters: ["progress", "coverage"],

    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html" },
        { type: "text-summary" }
      ],
      includeAllSources: true,
    },

    browsers: ["ChromeHeadless"], // necesita Chrome/Chromium instalado
    singleRun: true,
    client: { clearContext: false }, // deja visible el resultado en la UI de Karma si la abrís
  });
};

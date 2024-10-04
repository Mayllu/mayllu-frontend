module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@/components': './components',
            '@/screens': './screens',
            '@/utils': './utils',
            '@/constants': './constants',
            '@/pages': './pages',
            '@/types': './types',
          },
        }
      ],
    ],
  };
};

export default {
  plugins: {
    autoprefixer: {},
    'postcss-nested': {},
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: 'default',
      },
    }),
  },
};

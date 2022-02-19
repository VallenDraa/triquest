module.exports = {
  content: ['./views/**/*.ejs', './public/**/*.js', './test-html.html'],
  theme: {
    extend: {
      fontSize: {
        xxs: '0.5rem',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'pop-up': {
          '0%': {
            transform: 'scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.1)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'slide-from-top': {
          '0%': {
            transform: ' translateY(-180%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        'slide-to-top': {
          '0%': {
            transform: ' translateY(0%)',
          },
          '100%': {
            transform: 'translateY(-180%)',
          },
        },
        'fade-out': {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 400ms ease-in-out',
        'pop-up': ' pop-up 400ms ease-in-out',
        'slide-from-top': 'slide-from-top 600ms ease-in-out',
        'slide-to-top': 'slide-to-top 600ms ease-in-out',
        'fade-out': 'fade-out 400ms ease-in-out',
      },
    },
  },
  plugins: [],
};

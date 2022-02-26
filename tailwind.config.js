module.exports = {
  mode: 'jit',
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
        'fade-in-half': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '50%',
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
        'slide-x': {
          '0%': {
            opacity: '0.5',
            transform: 'translateX(0)',
          },
          '25%': {
            opacity: '0.25',
            transform: 'translateX(-180%)',
          },
          '50%': {
            opacity: '0',
          },
          '75%': {
            opacity: '0.25',
            transform: 'translateX(180%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
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
        shake: {
          '0%': {
            transform: 'rotate(0)',
          },
          '25%': {
            transform: 'rotate(-10deg)',
          },
          '50%': {
            transform: 'rotate(0)',
          },
          '75%': {
            transform: 'rotate(10deg)',
          },
          '100%': {
            transform: 'rotate(0deg)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 400ms ease-in-out',
        'fade-in-half': 'fade-in-half 400ms ease-in-out',
        'pop-up': ' pop-up 400ms ease-in-out',
        'slide-from-top': 'slide-from-top 600ms ease-in-out',
        'slide-to-top': 'slide-to-top 600ms ease-in-out',
        'slide-x': ' slide-x 1200ms ease-in-out',
        'fade-out': 'fade-out 400ms ease-in-out',
        shake: 'shake 250ms ease-in-out',
      },
      fontFamily: {
        teko: ['Teko', 'sans-serif'],
        'fira-sans': ['Fira Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

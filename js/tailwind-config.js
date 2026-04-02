tailwind.config = {
    theme: {
        extend: {
            colors: {
                deepBlack: '#0B0B0F',
                neonPurple: '#7A5CFF',
                elecBlue: '#00D4FF',
                offWhite: '#F5F5F5'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            }
        }
    }
};
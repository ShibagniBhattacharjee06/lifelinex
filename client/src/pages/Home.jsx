import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-red-600 blur-3xl mix-blend-screen animate-pulse"></div>
                <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600 blur-3xl mix-blend-screen opacity-50"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 h-screen flex flex-col justify-center items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 font-medium text-sm">
                        🚑 {t('home.tagline')}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {t('home.title')}
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 leading-relaxed"
                >
                    {t('home.subtitle')}
                    <br />
                    <span className="text-white font-semibold">{t('home.empowerment')}</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <Link to="/login" className="group relative px-8 py-4 bg-red-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-red-500/40 transition-all hover:-translate-y-1 overflow-hidden">
                        <span className="relative z-10">{t('home.get_started')}</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    </Link>
                    <Link to="/register" className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl font-bold text-lg hover:bg-white/10 transition-all hover:-translate-y-1">
                        {t('home.join_donor')}
                    </Link>
                </motion.div>

                {/* Floating cards animation later? */}
            </div>

        </div>
    );
};

export default Home;

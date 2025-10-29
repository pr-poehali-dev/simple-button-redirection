import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const [userCount, setUserCount] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserCount();
    checkAuth();
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/90a90c4a-40c9-41af-af24-115e95643a7d');
      const data = await response.json();
      setUserCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  const checkAuth = () => {
    const auth = localStorage.getItem('kick_auth');
    if (auth) {
      const userData = JSON.parse(auth);
      setIsAuthenticated(true);
      setUsername(userData.username);
    }
  };

  const handleKickAuth = async () => {
    window.location.href = 'YOUR_API_URL/auth/kick';
  };

  const handleLogout = () => {
    localStorage.removeItem('kick_auth');
    setIsAuthenticated(false);
    setUsername(null);
    fetchUserCount();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col">
        <header className="py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/50">
              V
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">VLADICH</h1>
              <p className="text-xs text-muted-foreground">Casino Streamer</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-card/50 backdrop-blur-sm px-6 py-3 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Icon name="Users" size={18} className="text-primary" />
                <span className="text-sm text-muted-foreground">Пользователей:</span>
                <span className="text-xl font-bold text-primary">{userCount}</span>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/30">
                  <span className="text-sm text-primary font-medium">{username}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-secondary/50 hover:bg-secondary/20"
                >
                  <Icon name="LogOut" size={16} />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleKickAuth}
                className="bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-black font-semibold shadow-lg shadow-primary/50"
              >
                <Icon name="UserPlus" size={18} />
                Войти через Kick
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center py-12 space-y-16">
          <div className="text-center space-y-6 max-w-3xl">
            <div className="inline-block animate-pulse">
              <div className="text-8xl mb-4">🎰</div>
            </div>
            <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-yellow-400 to-secondary bg-clip-text text-transparent">
              VLADICH CASINO
            </h2>
            <p className="text-xl text-muted-foreground">
              Официальное сообщество стримера vladich
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl px-4">
            <Button
              onClick={() => window.open('https://kick.com/vladich', '_blank')}
              size="lg"
              className="group relative h-20 flex-1 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-xl shadow-2xl shadow-green-500/30 border-2 border-green-400/50 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <Icon name="Video" size={28} />
                Kick
                <Icon name="ExternalLink" size={20} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>

            <Button
              onClick={() => window.open('https://t.me/vladich_community', '_blank')}
              size="lg"
              className="group relative h-20 flex-1 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xl shadow-2xl shadow-blue-500/30 border-2 border-blue-400/50 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <Icon name="Send" size={28} />
                Telegram
                <Icon name="ExternalLink" size={20} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>

            <Button
              onClick={() => navigate('/clips')}
              size="lg"
              className="group relative h-20 flex-1 bg-gradient-to-br from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-black font-bold text-xl shadow-2xl shadow-primary/50 border-2 border-primary/50 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <Icon name="Film" size={28} />
                Нарезки
                <Icon name="ChevronRight" size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4 mt-12">
            <div className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-primary/20 text-center space-y-2 hover:border-primary/40 transition-all">
              <Icon name="TrendingUp" size={32} className="text-primary mx-auto" />
              <div className="text-3xl font-bold text-foreground">24/7</div>
              <p className="text-sm text-muted-foreground">Стримы каждый день</p>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-primary/20 text-center space-y-2 hover:border-primary/40 transition-all">
              <Icon name="DollarSign" size={32} className="text-primary mx-auto" />
              <div className="text-3xl font-bold text-foreground">SLOTS</div>
              <p className="text-sm text-muted-foreground">Лучшие слоты</p>
            </div>
            
            <div className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-primary/20 text-center space-y-2 hover:border-primary/40 transition-all">
              <Icon name="Flame" size={32} className="text-primary mx-auto" />
              <div className="text-3xl font-bold text-foreground">HOT</div>
              <p className="text-sm text-muted-foreground">Горячие заносы</p>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50">
          <p>© 2024 VLADICH CASINO. Играй ответственно 18+</p>
        </footer>
      </div>
    </div>
  );
}
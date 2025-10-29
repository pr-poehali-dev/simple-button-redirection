import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const REDIRECT_URL = 'https://test.ru';
const API_URL = 'https://functions.poehali.dev/18327805-636e-40b4-8baf-c4bb7426aaa3';

export default function Index() {
  const [clicks, setClicks] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClickCount();
  }, []);

  const fetchClickCount = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setClicks(data.clicks || 0);
    } catch (error) {
      console.error('Error fetching clicks:', error);
    }
  };

  const handleRedirect = async () => {
    setIsLoading(true);
    
    try {
      await fetch(API_URL, { method: 'POST' });
      window.location.href = REDIRECT_URL;
    } catch (error) {
      console.error('Error recording click:', error);
      window.location.href = REDIRECT_URL;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-50 to-blue-50 p-4">
      <div className="max-w-2xl w-full text-center space-y-12 animate-fade-in">
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-foreground tracking-tight">
            Переход
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Нажмите кнопку для перехода на test.ru
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <Button
            onClick={handleRedirect}
            disabled={isLoading}
            size="lg"
            className="group relative h-20 px-12 text-xl font-semibold shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
          >
            <span className="flex items-center gap-3">
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="animate-spin" size={28} />
                  Переход...
                </>
              ) : (
                <>
                  Перейти на test.ru
                  <Icon name="ExternalLink" size={28} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </Button>

          <div className="flex flex-col items-center gap-3 p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg min-w-[280px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="MousePointerClick" size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">Всего переходов</span>
            </div>
            <div className="text-6xl font-bold text-primary tabular-nums">
              {clicks.toLocaleString('ru-RU')}
            </div>
          </div>
        </div>

        <div className="pt-8 text-sm text-muted-foreground/60 font-light">
          Каждый клик учитывается в реальном времени
        </div>
      </div>
    </div>
  );
}

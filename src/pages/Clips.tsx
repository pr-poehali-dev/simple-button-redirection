import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface Clip {
  id: string;
  url: string;
  title: string;
  created_at: string;
}

export default function Clips() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClips();
    checkAdminAuth();
  }, []);

  const fetchClips = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/b36a01b0-7b82-4974-bb30-47e407497b45');
      const data = await response.json();
      setClips(data.clips || []);
    } catch (error) {
      console.error('Error fetching clips:', error);
    }
  };

  const checkAdminAuth = () => {
    const auth = localStorage.getItem('kick_auth');
    if (auth) {
      const userData = JSON.parse(auth);
      setIsAdmin(userData.isAdmin || false);
    }
  };

  const handleAddClip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newTitle) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/b36a01b0-7b82-4974-bb30-47e407497b45', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl, title: newTitle })
      });
      
      if (response.ok) {
        setNewUrl('');
        setNewTitle('');
        fetchClips();
      }
    } catch (error) {
      console.error('Error adding clip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClip = async (id: string) => {
    try {
      await fetch(`https://functions.poehali.dev/b36a01b0-7b82-4974-bb30-47e407497b45/${id}`, { method: 'DELETE' });
      fetchClips();
    } catch (error) {
      console.error('Error deleting clip:', error);
    }
  };

  const extractVideoId = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return match ? match[1] : null;
    }
    if (url.includes('kick.com')) {
      return url;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="icon"
              className="border-primary/50 hover:bg-primary/10"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary">НАРЕЗКИ СТРИМОВ</h1>
              <p className="text-muted-foreground">Лучшие моменты с стримов vladich</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm border-primary/20">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Plus" size={24} className="text-primary" />
              Добавить нарезку
            </h2>
            <form onSubmit={handleAddClip} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Название</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например: Занос x1000 в Sweet Bonanza"
                  className="bg-input/50 border-border/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Ссылка на видео (YouTube/Kick)</label>
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... или https://kick.com/..."
                  className="bg-input/50 border-border/50"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !newUrl || !newTitle}
                className="bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90 text-black font-semibold"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="animate-spin" size={18} />
                    Добавление...
                  </>
                ) : (
                  <>
                    <Icon name="Plus" size={18} />
                    Добавить нарезку
                  </>
                )}
              </Button>
            </form>
          </Card>
        )}

        {clips.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Пока нет нарезок</h3>
            <p className="text-muted-foreground">
              {isAdmin ? 'Добавьте первую нарезку через форму выше' : 'Нарезки скоро появятся!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((clip) => {
              const videoId = extractVideoId(clip.url);
              const isYouTube = clip.url.includes('youtube') || clip.url.includes('youtu.be');
              
              return (
                <Card key={clip.id} className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden hover:border-primary/40 transition-all group">
                  <div className="aspect-video bg-muted/30 relative overflow-hidden">
                    {isYouTube && videoId ? (
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={clip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="Video" size={48} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        onClick={() => window.open(clip.url, '_blank')}
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-black font-bold shadow-xl"
                      >
                        <Icon name="Play" size={24} />
                        Смотреть
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{clip.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(clip.created_at).toLocaleDateString('ru-RU')}
                      </span>
                      {isAdmin && (
                        <Button
                          onClick={() => handleDeleteClip(clip.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
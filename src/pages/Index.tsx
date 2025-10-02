import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Poll {
  id: number;
  question: string;
  options: { text: string; votes: number; dislikes: number }[];
  totalVotes: number;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'meeting' | 'initiative' | 'event';
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 1,
      question: 'Какое мероприятие провести в следующем месяце?',
      options: [
        { text: 'Спортивный турнир', votes: 45, dislikes: 5 },
        { text: 'Творческий конкурс', votes: 32, dislikes: 8 },
        { text: 'Научная конференция', votes: 28, dislikes: 12 },
        { text: 'Концерт', votes: 51, dislikes: 3 }
      ],
      totalVotes: 156
    },
    {
      id: 2,
      question: 'Улучшение условий в столовой',
      options: [
        { text: 'Расширить меню', votes: 67, dislikes: 10 },
        { text: 'Увеличить время работы', votes: 43, dislikes: 15 },
        { text: 'Добавить вегетарианские блюда', votes: 38, dislikes: 20 }
      ],
      totalVotes: 148
    }
  ]);
  const [userVotes, setUserVotes] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});

  const [events] = useState<Event[]>([
    { id: 1, title: 'Собрание совета обучающихся', date: '2025-10-09', time: '16:00', location: '2 корпус, 3 этаж, аудитория 312', type: 'meeting' },
    { id: 2, title: 'Пресс-служба', date: '-', time: '-', location: '-', type: 'event' },
    { id: 3, title: '-', date: '-', time: '-', location: '-', type: 'initiative' },
    { id: 4, title: '-', date: '-', time: '-', location: '-', type: 'event' }
  ]);

  const [achievements] = useState<Achievement[]>([
    { id: 1, title: 'Грант на развитие студенческих проектов', description: 'Получен грант 500 000 руб. на реализацию инициатив', date: 'Сентябрь 2025' },
    { id: 2, title: 'Победа в региональном конкурсе', description: 'Проект "Экология в действии" занял 1 место', date: 'Август 2025' },
    { id: 3, title: '500+ активных участников', description: 'Совет обучающихся объединил более 500 студентов', date: 'Октябрь 2025' }
  ]);

  const handleSubmitFeedback = () => {
    alert('Спасибо за отзыв! Ваше мнение важно для нас.');
  };

  const handleSubmitInitiative = () => {
    alert('Инициатива отправлена! Мы рассмотрим ваше предложение.');
  };

  const handleSubmitQuestion = () => {
    alert('Вопрос отправлен! Мы ответим вам на email.');
  };

  const handleVote = (pollId: number, optionIndex: number, type: 'like' | 'dislike') => {
    const voteKey = `${pollId}-${optionIndex}`;
    const currentVote = userVotes[voteKey];
    
    if (currentVote === type) return;
    
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const newOptions = [...poll.options];
        
        if (currentVote === 'like') {
          newOptions[optionIndex].votes -= 1;
        } else if (currentVote === 'dislike') {
          newOptions[optionIndex].dislikes -= 1;
        }
        
        if (type === 'like') {
          newOptions[optionIndex].votes += 1;
        } else {
          newOptions[optionIndex].dislikes += 1;
        }
        
        return {
          ...poll,
          options: newOptions,
          totalVotes: poll.totalVotes
        };
      }
      return poll;
    }));
    
    setUserVotes({ ...userVotes, [voteKey]: type });
  };

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'meeting': return 'Users';
      case 'initiative': return 'Lightbulb';
      case 'event': return 'Calendar';
      default: return 'Calendar';
    }
  };

  const getEventColor = (type: string) => {
    switch(type) {
      case 'meeting': return 'from-[#c71432] to-[#4b877b]';
      case 'initiative': return 'from-[#c71432] to-[#4b877b]';
      case 'event': return 'from-[#c71432] to-[#4b877b]';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(to bottom right, #fde8ec, #e6f4f1)'}}>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/55ad8279-97c3-41a8-b8d3-c5dfed336cac.jpg" 
                alt="Совет Обучающихся"
                className="w-20 h-20 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#c71432] to-[#4b877b] bg-clip-text text-transparent">
                  Совет Обучающихся
                </h1>
                <p className="text-sm text-muted-foreground">Твой голос имеет значение</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-2">
              {['Главная', 'Новости', 'Мероприятия', 'Голосования', 'Контакты'].map((item) => (
                <Button 
                  key={item}
                  variant={activeTab === item.toLowerCase() ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className="font-medium"
                >
                  {item}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl p-12 text-white" style={{background: 'linear-gradient(to bottom right, #c71432, #4b877b)'}}>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-5xl font-bold mb-4">Создаём будущее вместе</h2>
              <p className="text-xl mb-6 opacity-90">
                Присоединяйся к сообществу активных студентов. Предлагай идеи, голосуй за изменения и участвуй в жизни учебного заведения.
              </p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary" className="bg-white hover:bg-gray-100" style={{color: '#c71432'}} onClick={() => setActiveTab('initiative')}>
                  <Icon name="Sparkles" className="mr-2" size={20} />
                  Подать инициативу
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" onClick={() => alert('Контакты: +7 (996) 136-79-47, maksimenkov012@mail.ru')}>
                  О совете
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold">Активные голосования</h3>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Icon name="TrendingUp" className="mr-2" size={16} />
              Активно сейчас
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {polls.map((poll) => (
              <Card key={poll.id} className="overflow-hidden border-2 hover:shadow-xl transition-all animate-scale-in">
                <CardHeader className="bg-gradient-to-r from-[#fde8ec] to-[#e6f4f1]">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Vote" size={24} style={{color: '#c71432'}} />
                    {poll.question}
                  </CardTitle>
                  <CardDescription>Всего голосов: {poll.totalVotes}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {poll.options.map((option, index) => {
                      const totalOptionVotes = option.votes + option.dislikes;
                      const likesPercentage = totalOptionVotes > 0 ? ((option.votes / totalOptionVotes) * 100).toFixed(1) : 0;
                      const dislikesPercentage = totalOptionVotes > 0 ? ((option.dislikes / totalOptionVotes) * 100).toFixed(1) : 0;
                      const progressPercentage = poll.totalVotes > 0 ? (totalOptionVotes / poll.totalVotes) * 100 : 0;
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{option.text}</span>
                            <div className="flex gap-3 text-sm">
                              <span className="text-emerald-600 font-medium">👍 {option.votes} ({likesPercentage}%)</span>
                              <span className="text-rose-600 font-medium">👎 {option.dislikes} ({dislikesPercentage}%)</span>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1 relative h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="absolute h-full transition-all duration-300"
                                style={{
                                  width: `${progressPercentage}%`,
                                  background: userVotes[`${poll.id}-${index}`] === 'like' 
                                    ? '#10b981' 
                                    : userVotes[`${poll.id}-${index}`] === 'dislike' 
                                      ? '#ef4444'
                                      : 'linear-gradient(to right, #c71432, #4b877b)'
                                }}
                              />
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button 
                                size="sm" 
                                variant={userVotes[`${poll.id}-${index}`] === 'like' ? 'default' : 'outline'}
                                onClick={() => handleVote(poll.id, index, 'like')}
                                className="px-2"
                              >
                                <Icon name="ThumbsUp" size={16} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={userVotes[`${poll.id}-${index}`] === 'dislike' ? 'destructive' : 'outline'}
                                onClick={() => handleVote(poll.id, index, 'dislike')}
                                className="px-2"
                              >
                                <Icon name="ThumbsDown" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-3xl font-bold mb-6">Календарь мероприятий</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                <div className={`h-2 bg-gradient-to-r ${getEventColor(event.type)}`}></div>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getEventColor(event.type)} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon name={getEventIcon(event.type)} className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base mb-1 line-clamp-2">{event.title}</CardTitle>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Icon name="Calendar" size={12} />
                          <span>{new Date(event.date).toLocaleDateString('ru-RU')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Clock" size={12} />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="MapPin" size={12} />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Card className="overflow-hidden border-2">
            <CardHeader className="bg-gradient-to-r from-[#fde8ec] to-[#e6f4f1]">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icon name="MessageSquare" size={28} style={{color: '#c71432'}} />
                Обратная связь
              </CardTitle>
              <CardDescription>Поделись своим мнением, предложи улучшения или задай вопрос</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="feedback" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="feedback">
                    <Icon name="MessageCircle" size={16} className="mr-2" />
                    Отзыв
                  </TabsTrigger>
                  <TabsTrigger value="initiative">
                    <Icon name="Lightbulb" size={16} className="mr-2" />
                    Инициатива
                  </TabsTrigger>
                  <TabsTrigger value="question">
                    <Icon name="HelpCircle" size={16} className="mr-2" />
                    Вопрос
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="feedback" className="space-y-4 mt-4">
                  <div>
                    <Input placeholder="Ваше имя" className="mb-3" />
                    <Input type="email" placeholder="Email (необязательно)" className="mb-3" />
                    <Textarea 
                      placeholder="Расскажите, что можно улучшить в работе совета или учебного процесса..." 
                      rows={4}
                      className="mb-3"
                    />
                    <Button className="w-full hover:opacity-90" style={{background: 'linear-gradient(to right, #c71432, #4b877b)'}} onClick={handleSubmitFeedback}>
                      <Icon name="Send" size={16} className="mr-2" />
                      Отправить отзыв
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="initiative" className="space-y-4 mt-4">
                  <div>
                    <Input placeholder="Название инициативы" className="mb-3" />
                    <Input placeholder="Ваше имя" className="mb-3" />
                    <Textarea 
                      placeholder="Опишите вашу идею и как она улучшит жизнь студентов..." 
                      rows={4}
                      className="mb-3"
                    />
                    <Button className="w-full hover:opacity-90" style={{background: 'linear-gradient(to right, #c71432, #4b877b)'}} onClick={handleSubmitInitiative}>
                      <Icon name="Sparkles" size={16} className="mr-2" />
                      Предложить инициативу
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="question" className="space-y-4 mt-4">
                  <div>
                    <Input placeholder="Ваше имя" className="mb-3" />
                    <Input type="email" placeholder="Email для ответа" className="mb-3" />
                    <Textarea 
                      placeholder="Задайте ваш вопрос..." 
                      rows={4}
                      className="mb-3"
                    />
                    <Button className="w-full hover:opacity-90" style={{background: 'linear-gradient(to right, #c71432, #4b877b)'}} onClick={handleSubmitQuestion}>
                      <Icon name="Send" size={16} className="mr-2" />
                      Задать вопрос
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-2 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icon name="Mail" size={28} />
                Контакты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{background: 'linear-gradient(to bottom right, #c71432, #4b877b)'}}>
                    <Icon name="Phone" size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Телефон</p>
                    <a href="tel:+79961367947" className="text-sm text-muted-foreground hover:text-primary transition-colors">+7 (996) 136-79-47</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <a 
                    href="mailto:maksimenkov012@mail.ru" 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity" 
                    style={{background: 'linear-gradient(to bottom right, #c71432, #4b877b)'}}
                  >
                    <Icon name="Mail" size={20} className="text-white" />
                  </a>
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <a href="mailto:maksimenkov012@mail.ru" className="text-sm text-muted-foreground hover:text-primary transition-colors">maksimenkov012@mail.ru</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{background: 'linear-gradient(to bottom right, #c71432, #4b877b)'}}>
                    <Icon name="MapPin" size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Адрес</p>
                    <p className="text-sm text-muted-foreground">Первомайская улица, 16/2<br />Великие Луки, Псковская область<br />182110</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-16 bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="https://cdn.poehali.dev/files/55ad8279-97c3-41a8-b8d3-c5dfed336cac.jpg" 
                alt="Совет Обучающихся"
                className="w-16 h-16 object-contain"
              />
              <div>
                <p className="font-bold text-lg">Совет Обучающихся</p>
                <p className="text-gray-400 text-sm">Твой голос имеет значение</p>
              </div>
            </div>
            <p className="text-gray-400">© 2025 Совет обучающихся. Вместе создаём лучшее будущее</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
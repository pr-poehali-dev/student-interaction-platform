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
  options: { text: string; votes: number }[];
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
        { text: 'Спортивный турнир', votes: 45 },
        { text: 'Творческий конкурс', votes: 32 },
        { text: 'Научная конференция', votes: 28 },
        { text: 'Концерт', votes: 51 }
      ],
      totalVotes: 156
    },
    {
      id: 2,
      question: 'Улучшение условий в столовой',
      options: [
        { text: 'Расширить меню', votes: 67 },
        { text: 'Увеличить время работы', votes: 43 },
        { text: 'Добавить вегетарианские блюда', votes: 38 }
      ],
      totalVotes: 148
    }
  ]);

  const [events] = useState<Event[]>([
    { id: 1, title: 'Собрание совета обучающихся', date: '2025-10-05', time: '15:00', location: 'Аудитория 301', type: 'meeting' },
    { id: 2, title: 'День открытых дверей', date: '2025-10-10', time: '10:00', location: 'Главный холл', type: 'event' },
    { id: 3, title: 'Инициатива "Зеленый кампус"', date: '2025-10-12', time: '14:00', location: 'Территория', type: 'initiative' },
    { id: 4, title: 'Студенческая конференция', date: '2025-10-18', time: '09:00', location: 'Актовый зал', type: 'event' }
  ]);

  const [achievements] = useState<Achievement[]>([
    { id: 1, title: 'Грант на развитие студенческих проектов', description: 'Получен грант 500 000 руб. на реализацию инициатив', date: 'Сентябрь 2025' },
    { id: 2, title: 'Победа в региональном конкурсе', description: 'Проект "Экология в действии" занял 1 место', date: 'Август 2025' },
    { id: 3, title: '500+ активных участников', description: 'Совет обучающихся объединил более 500 студентов', date: 'Октябрь 2025' }
  ]);

  const handleVote = (pollId: number, optionIndex: number) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const newOptions = [...poll.options];
        newOptions[optionIndex].votes += 1;
        return {
          ...poll,
          options: newOptions,
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    }));
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
      case 'meeting': return 'from-pink-500 to-rose-500';
      case 'initiative': return 'from-indigo-500 to-purple-500';
      case 'event': return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-emerald-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/55ad8279-97c3-41a8-b8d3-c5dfed336cac.jpg" 
                alt="Совет Обучающихся"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Совет Обучающихся
                </h1>
                <p className="text-sm text-muted-foreground">Твой голос имеет значение</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-2">
              {['Главная', 'Новости', 'Мероприятия', 'Голосования', 'Достижения', 'Контакты'].map((item) => (
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-emerald-500 p-12 text-white">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-5xl font-bold mb-4">Создаём будущее вместе</h2>
              <p className="text-xl mb-6 opacity-90">
                Присоединяйся к сообществу активных студентов. Предлагай идеи, голосуй за изменения и участвуй в жизни учебного заведения.
              </p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Icon name="Sparkles" className="mr-2" size={20} />
                  Подать инициативу
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
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
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Vote" size={24} className="text-purple-600" />
                    {poll.question}
                  </CardTitle>
                  <CardDescription>Всего голосов: {poll.totalVotes}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {poll.options.map((option, index) => {
                      const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{option.text}</span>
                            <span className="text-sm text-muted-foreground">{option.votes} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Progress value={percentage} className="flex-1" />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleVote(poll.id, index)}
                              className="shrink-0"
                            >
                              <Icon name="ThumbsUp" size={16} />
                            </Button>
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
          <h3 className="text-3xl font-bold mb-6">Наши достижения</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="overflow-hidden border-2 hover:shadow-xl transition-all">
                <div className="h-32 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 flex items-center justify-center">
                  <Icon name="Trophy" size={48} className="text-white" />
                </div>
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{achievement.date}</Badge>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Card className="overflow-hidden border-2">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icon name="MessageSquare" size={28} className="text-emerald-600" />
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
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
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
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
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
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
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
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Icon name="Phone" size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Телефон</p>
                    <p className="text-sm text-muted-foreground">+7 (XXX) XXX-XX-XX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Icon name="Mail" size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <p className="text-sm text-muted-foreground">council@university.edu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Icon name="MapPin" size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Адрес</p>
                    <p className="text-sm text-muted-foreground">Корпус 1, каб. 105</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-16 bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Совет обучающихся. Вместе создаём лучшее будущее</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
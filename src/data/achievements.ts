export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "progress" | "streak" | "module" | "special";
  requirement: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_lesson",
    title: "Первый шаг",
    description: "Завершите первый урок",
    icon: "🎯",
    category: "progress",
    requirement: "completed_lessons >= 1",
  },
  {
    id: "five_lessons",
    title: "Новичок",
    description: "Завершите 5 уроков",
    icon: "📚",
    category: "progress",
    requirement: "completed_lessons >= 5",
  },
  {
    id: "ten_lessons",
    title: "Ученик",
    description: "Завершите 10 уроков",
    icon: "🎓",
    category: "progress",
    requirement: "completed_lessons >= 10",
  },
  {
    id: "fifteen_lessons",
    title: "Продвинутый",
    description: "Завершите 15 уроков",
    icon: "⚡",
    category: "progress",
    requirement: "completed_lessons >= 15",
  },
  {
    id: "twenty_lessons",
    title: "Эксперт",
    description: "Завершите 20 уроков",
    icon: "🏆",
    category: "progress",
    requirement: "completed_lessons >= 20",
  },
  {
    id: "all_lessons",
    title: "Мастер PostgreSQL",
    description: "Завершите все 30 уроков",
    icon: "👑",
    category: "progress",
    requirement: "completed_lessons >= 30",
  },
  {
    id: "module_1",
    title: "Репликация",
    description: "Завершите модуль 1",
    icon: "🔄",
    category: "module",
    requirement: "module_1_complete",
  },
  {
    id: "module_2",
    title: "Слоты",
    description: "Завершите модуль 2",
    icon: "🎰",
    category: "module",
    requirement: "module_2_complete",
  },
  {
    id: "module_3",
    title: "Безопасность",
    description: "Завершите модуль 3",
    icon: "🔒",
    category: "module",
    requirement: "module_3_complete",
  },
  {
    id: "module_4",
    title: "Отказоустойчивость",
    description: "Завершите модуль 4",
    icon: "🛡️",
    category: "module",
    requirement: "module_4_complete",
  },
  {
    id: "streak_3",
    title: "На волне",
    description: "Занимайтесь 3 дня подряд",
    icon: "🔥",
    category: "streak",
    requirement: "streak >= 3",
  },
  {
    id: "streak_7",
    title: "Неделя без перерыва",
    description: "Занимайтесь 7 дней подряд",
    icon: "💪",
    category: "streak",
    requirement: "streak >= 7",
  },
  {
    id: "half_way",
    title: "Половина пути",
    description: "Завершите 50% курса",
    icon: "⏳",
    category: "special",
    requirement: "percent >= 50",
  },
  {
    id: "graduate",
    title: "Выпускник",
    description: "Завершите весь курс",
    icon: "🎉",
    category: "special",
    requirement: "percent >= 100",
  },
];

export function checkAchievements(stats: {
  completedLessons: number;
  completedModules: number[];
  streak: number;
  percent: number;
}): string[] {
  const earned: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    let unlocked = false;

    if (achievement.id === "first_lesson" && stats.completedLessons >= 1) unlocked = true;
    if (achievement.id === "five_lessons" && stats.completedLessons >= 5) unlocked = true;
    if (achievement.id === "ten_lessons" && stats.completedLessons >= 10) unlocked = true;
    if (achievement.id === "fifteen_lessons" && stats.completedLessons >= 15) unlocked = true;
    if (achievement.id === "twenty_lessons" && stats.completedLessons >= 20) unlocked = true;
    if (achievement.id === "all_lessons" && stats.completedLessons >= 30) unlocked = true;
    if (achievement.id === "module_1" && stats.completedModules.includes(1)) unlocked = true;
    if (achievement.id === "module_2" && stats.completedModules.includes(2)) unlocked = true;
    if (achievement.id === "module_3" && stats.completedModules.includes(3)) unlocked = true;
    if (achievement.id === "module_4" && stats.completedModules.includes(4)) unlocked = true;
    if (achievement.id === "streak_3" && stats.streak >= 3) unlocked = true;
    if (achievement.id === "streak_7" && stats.streak >= 7) unlocked = true;
    if (achievement.id === "half_way" && stats.percent >= 50) unlocked = true;
    if (achievement.id === "graduate" && stats.percent >= 100) unlocked = true;

    if (unlocked) earned.push(achievement.id);
  }

  return earned;
}

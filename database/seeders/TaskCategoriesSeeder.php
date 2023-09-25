<?php

namespace Database\Seeders;

use App\Models\TaskCategory;
use Illuminate\Database\Seeder;

class TaskCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            'Буст аккаунта',
            'Коучинг',
            'Стриминг и Комментирования',
            'Менеджер, Тренер в команду',
            'Поиск игроков в Команду',
            'Поиск игроков в Гильдию',
            'Графика, Дизайн, Видеомонтаж',
            'Программирование и Тестирование',
            'Другое',
        ];

        $categories_en = [
            'Account boost',
            'Coaching',
            'Streaming and Commenting',
            'Manager, Team coach',
            'Search players for the team',
            'Search players for the gaming Guild',
            'Graphics, Design, Video editing',
            'programming and Testing',
            'Other',
        ];

        foreach ($categories as $n => $category) {
            TaskCategory::updateOrCreate(
                ['name' => $category],
                ['name_en' => $categories_en[$n]],
            );
        }
    }
}

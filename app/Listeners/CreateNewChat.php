<?php

namespace App\Listeners;

use App\Models\Chat;
use App\Events\AddNewChat;

class CreateNewChat
{
    public function handle(AddNewChat $event): void
    {
        $user1 = $event->user1;
        $user2 = $event->user2;
        $task = $event->task;

        Chat::updateOrCreate(
            [
            'user_one' => $user1->id,
            'user_two' => $user2->id,
            'task_id' => $task->id,
            ],
            [
                'active' => true,
            ]
        );
    }
}

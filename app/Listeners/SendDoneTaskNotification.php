<?php

namespace App\Listeners;

use App\Events\DoneTask;
use App\Models\Notification;

class SendDoneTaskNotification
{
    public function handle(DoneTask $event): void
    {
        $task = $event->task;

        Notification::create([
            'user_id' => $task->user_id,
            'type' => Notification::TYPE_TASK_DONE,
            'message' => __($task->name . ' помечено как завершенное'),
            'message_en' => __($task->name . ' marked as complete'),
            'params' => json_encode(['task_id' => $task->id])
        ]);
    }
}

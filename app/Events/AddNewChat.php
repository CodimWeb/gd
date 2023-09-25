<?php

namespace App\Events;

use App\Models\Task;
use App\Models\User;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class AddNewChat
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public User $user1;
    public User $user2;
    public Task $task;

    public function __construct(User $user1, User $user2, Task $task)
    {
        $this->user1 = $user1;
        $this->user2 = $user2;
        $this->task = $task;
    }
}

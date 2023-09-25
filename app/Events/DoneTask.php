<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class DoneTask
{
    use Dispatchable;
    use SerializesModels;
    use InteractsWithSockets;

    public Task $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }
}

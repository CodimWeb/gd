<?php

namespace App\Http\Resources;

use App\Models\Task;
use App\Models\User;
use App\Models\Offer;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserInfoResource extends JsonResource
{
    public function toArray($request): array
    {
        $userId = $this->id;

        return [
            'id' => $userId,
            'username' => $this->username,
            'email' => $this->email,
            'birthday' => $this->birthday,
            'biography' => $this->biography,
            'country_id' => $this->country_id,
            'country_ru' => ($this->country_id) ? $this->country?->title_ru : null,
            'country_en' => ($this->country_id) ? $this->country?->title_en : null,
            'avatar' => $this->avatar,
            'created_tasks' => $this->tasks->count(),
            'done_tasks' => $this->tasks->filter(function(Task $task, $key) {
                if (!in_array($task->status, [Task::STATUS_WAITING, Task::STATUS_IN_PROGRESS])) {
                    foreach ($task->offers as $offer) {
                        if ($offer->status == Offer::STATUS_ACCEPTED) {
                            return $task;
                        }
                    }
                }
            })->count(),
            'created_at' => $this->created_at,
        ];
    }
}

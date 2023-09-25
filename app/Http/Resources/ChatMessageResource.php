<?php

namespace App\Http\Resources;

use App\Models\User;
use App\Models\ChatMessage;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ChatMessage
 */
class ChatMessageResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'message' => $this->message,
            'task_id' => $this->chat->task?->id,
            'user_id' => $this->user_id,
            'user' => new UserResource(User::find($this->user_id)),
            'chat_id' => $this->chat_id,
            'read' => $this->read,
            'created_at' => $this->created_at,
        ];
    }
}

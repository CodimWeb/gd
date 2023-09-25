<?php

namespace App\Models;

use Eloquent;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\ChatMessage
 *
 * @property int $id
 * @property string $message
 * @property int $user_id
 * @property int $chat_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property bool $read
 * @property-read \App\Models\User $chat
 * @property-read \App\Models\User $user
 * @method static Builder|ChatMessage newModelQuery()
 * @method static Builder|ChatMessage newQuery()
 * @method static Builder|ChatMessage query()
 * @method static Builder|ChatMessage whereChatId($value)
 * @method static Builder|ChatMessage whereCreatedAt($value)
 * @method static Builder|ChatMessage whereId($value)
 * @method static Builder|ChatMessage whereMessage($value)
 * @method static Builder|ChatMessage whereRead($value)
 * @method static Builder|ChatMessage whereUpdatedAt($value)
 * @method static Builder|ChatMessage whereUserId($value)
 * @method static Builder|ChatMessage chatMessages($userOneId, $userTwoId)
 * @mixin Eloquent
 */
class ChatMessage extends Model
{
    protected $guarded = ['id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class, 'chat_id', 'id');
    }

    public function scopeChatMessages(Builder $query, $userOneId, $userTwoId): Builder
    {
        return $query->where(function ($query) use ($userOneId, $userTwoId) {
            $query->where('user_id', '=', $userOneId)
                ->orWhere('user_id', '=', $userTwoId);
        });
    }
}

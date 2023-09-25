<?php

namespace App\Models;

use Eloquent;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Chat
 *
 * @property int $id
 * @property int $user_one
 * @property int $user_two
 * @property int $task_id
 * @property bool $active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\ChatMessage> $messages
 * @property-read int|null $messages_count
 * @property-read \App\Models\Task $task
 * @property-read \App\Models\User|null $user1
 * @property-read \App\Models\User|null $user2
 * @method static Builder|Chat newModelQuery()
 * @method static Builder|Chat newQuery()
 * @method static Builder|Chat query()
 * @method static Builder|Chat whereActive($value)
 * @method static Builder|Chat whereCreatedAt($value)
 * @method static Builder|Chat whereId($value)
 * @method static Builder|Chat whereTaskId($value)
 * @method static Builder|Chat whereUpdatedAt($value)
 * @method static Builder|Chat whereUserOne($value)
 * @method static Builder|Chat whereUserTwo($value)
 * @mixin Eloquent
 */
class Chat extends Model
{
    protected $guarded = ['id'];

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id', 'id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'chat_id', 'id');
    }
}

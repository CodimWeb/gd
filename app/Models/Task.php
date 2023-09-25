<?php

namespace App\Models;

use Eloquent;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Task
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int|null $category_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $user_id
 * @property string $status
 * @property int|null $updated_by
 * @property string|null $logo
 * @property-read \App\Models\TaskCategory|null $category
 * @property-read Collection<int, \App\Models\Chat> $chats
 * @property-read int|null $chats_count
 * @property-read string|null $status_text
 * @property-read Collection<int, \App\Models\Offer> $offers
 * @property-read int|null $offers_count
 * @property-read \App\Models\User|null $updater
 * @property-read \App\Models\User|null $user
 * @method static Builder|Task newModelQuery()
 * @method static Builder|Task newQuery()
 * @method static Builder|Task query()
 * @method static Builder|Task whereCategoryId($value)
 * @method static Builder|Task whereCreatedAt($value)
 * @method static Builder|Task whereDescription($value)
 * @method static Builder|Task whereId($value)
 * @method static Builder|Task whereLogo($value)
 * @method static Builder|Task whereName($value)
 * @method static Builder|Task whereStatus($value)
 * @method static Builder|Task whereUpdatedAt($value)
 * @method static Builder|Task whereUpdatedBy($value)
 * @method static Builder|Task whereUserId($value)
 * @mixin Eloquent
 */
class Task extends Model
{
    const COUNT_PER_USER = 10;
    const COUNT_MAIN_PAGE = 4;
    const COUNT_CATEGORY_PAGE = 16;

    const LOCAL_LOGO_PATH = 'storage' . DIRECTORY_SEPARATOR . 'tasks';

    const STATUS_WAITING = 'waiting';
    const STATUS_IN_PROGRESS = 'in progress';
    const STATUS_DONE = 'done';
    const STATUS_CLOSED = 'closed';
    const STATUS_HIDDEN = 'hidden';
    const STATUS_ARCHIVED = 'archived';

    protected $guarded = ['id'];
    protected $appends = [
        'status_text',
    ];

    public function category(): HasOne
    {
        return $this->hasOne(TaskCategory::class, 'id', 'category_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id', 'updated_by');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'task_id', 'id');
    }

    public function chats(): HasMany
    {
        return $this->hasMany(Chat::class, 'task_id', 'id');
    }

    public function getStatusTextAttribute(): ?string
    {
        $statuses = static::allStatusesText();

        return ($this->status)
            ? $statuses[$this->status] ?? null
            : null;
    }

    public static function allStatusesText(): array
    {
        return [
            self::STATUS_WAITING => __('Ожидание'),
            self::STATUS_IN_PROGRESS => __('Выполняется'),
            self::STATUS_DONE => __('Выполнено'),
            self::STATUS_CLOSED => __('Закрыто'),
            self::STATUS_HIDDEN => __('Скрыто'),
            self::STATUS_ARCHIVED => __('В архиве'),
        ];
    }

    public static function allStatuses(): array
    {
        return [
            self::STATUS_WAITING,
            self::STATUS_IN_PROGRESS,
            self::STATUS_DONE,
            self::STATUS_CLOSED,
            self::STATUS_HIDDEN,
            self::STATUS_ARCHIVED,
        ];
    }
}

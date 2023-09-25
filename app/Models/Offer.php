<?php

namespace App\Models;

use Eloquent;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Offer.
 *
 * @property int $id
 * @property int $user_id
 * @property int $task_id
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Task $task
 * @property-read User $user
 * @method static Builder|Offer newModelQuery()
 * @method static Builder|Offer newQuery()
 * @method static Builder|Offer query()
 * @method static Builder|Offer whereCreatedAt($value)
 * @method static Builder|Offer whereId($value)
 * @method static Builder|Offer whereStatus($value)
 * @method static Builder|Offer whereTaskId($value)
 * @method static Builder|Offer whereUpdatedAt($value)
 * @method static Builder|Offer whereUserId($value)
 * @mixin Eloquent
 */
class Offer extends Model
{
    const STATUS_NEW = 'new';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_REJECTED = 'rejected';

    protected $guarded = ['id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public static function allStatuses(): array
    {
        return [
            self::STATUS_NEW,
            self::STATUS_ACCEPTED,
            self::STATUS_REJECTED,
        ];
    }
}

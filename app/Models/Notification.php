<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Notification
 *
 * @property int $id
 * @property int $user_id
 * @property string $type
 * @property string $message
 * @property string $message_en
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property bool $read
 * @property mixed|null $params
 * @property-read \App\Models\User $user
 * @method static Builder|Notification newModelQuery()
 * @method static Builder|Notification newQuery()
 * @method static Builder|Notification query()
 * @method static Builder|Notification whereCreatedAt($value)
 * @method static Builder|Notification whereId($value)
 * @method static Builder|Notification whereMessage($value)
 * @method static Builder|Notification whereParams($value)
 * @method static Builder|Notification whereRead($value)
 * @method static Builder|Notification whereType($value)
 * @method static Builder|Notification whereUpdatedAt($value)
 * @method static Builder|Notification whereUserId($value)
 * @mixin Eloquent
 */
class Notification extends Model
{
    const TYPE_NEW_OFFER = 'new_offer';
    const TYPE_OFFER_ACCEPTED = 'offer_accepted';

    const TYPE_OFFER_REJECTED = 'offer_rejected';

    const TYPE_TASK_DONE = 'task_done';

    protected $guarded = ['id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function allTypes(): array
    {
        return [
            self::TYPE_NEW_OFFER,
            self::TYPE_OFFER_ACCEPTED,
            self::TYPE_OFFER_REJECTED,
            self::TYPE_TASK_DONE,
        ];
    }

    protected function params(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value),
        );
    }
}

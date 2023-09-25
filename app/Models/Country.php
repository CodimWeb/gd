<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Country.
 *
 * @property int $id
 * @property string $title_ru
 * @property string $title_en
 * @property-read User|null $user
 * @method static Builder|Country newModelQuery()
 * @method static Builder|Country newQuery()
 * @method static Builder|Country query()
 * @method static Builder|Country whereId($value)
 * @method static Builder|Country whereTitleEn($value)
 * @method static Builder|Country whereTitleRu($value)
 * @mixin Eloquent
 */
class Country extends Model
{
    protected $guarded = ['id'];
    public $timestamps = false;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'country_id', 'id');
    }
}

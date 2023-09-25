<?php

namespace App\Models;

use Eloquent;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\TaskCategory
 *
 * @property int $id
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $name_en
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @method static Builder|TaskCategory newModelQuery()
 * @method static Builder|TaskCategory newQuery()
 * @method static Builder|TaskCategory query()
 * @method static Builder|TaskCategory whereCreatedAt($value)
 * @method static Builder|TaskCategory whereId($value)
 * @method static Builder|TaskCategory whereName($value)
 * @method static Builder|TaskCategory whereNameEn($value)
 * @method static Builder|TaskCategory whereUpdatedAt($value)
 * @mixin Eloquent
 */
class TaskCategory extends Model
{
    protected $guarded = ['id'];

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'category_id', 'id');
    }
}
